import formStyles from "@/styles/formStyles";
import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";

import SectionTitle from "@/components/FormUtils/SectionTitle";
import TotalServicesSection from "@/components/TotalServicesSection";
import { GeneralConfigState } from "@/models/Config";
import { ServiceCategorySchema } from "@/models/Services";
import { updateFlight } from "@/redux/slices/flightsSlice";
import { selectCurrentFlight } from "@/redux/slices/flightsSlice/selectors";
import { RootState, useAppDispatch } from "@/redux/store";
import { getFuelFeeAmount } from "@/services/AirportFeesManager";
import {
  getBasicHandlingPrice,
  getLoungeFeePrice,
  getTotalAirportFeesPrice,
} from "@/services/servicesCalculator";
import ERROR_MESSAGES from "@/utils/formErrorMessages";
import formatMDLPriceToEuro from "@/utils/priceFormatter";
import REGEX from "@/utils/regexp";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@realm/react";
import { useRouter } from "expo-router";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  Button,
  Divider,
  HelperText,
  Modal,
  Portal,
  Switch,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import DropDown from "react-native-paper-dropdown";
import { useSelector } from "react-redux";
import { IFlight } from "@/models/Flight";
type FormData = IFlight;

const Form: React.FC = () => {
  // const allServices = getAllServices();
  const allServices = useQuery<ServiceCategorySchema>("Services");
  const state = useSelector((state: RootState) => state);
  const [general] = useQuery<GeneralConfigState>("General");
  const existingFlight = selectCurrentFlight(state);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const basicHandlingPricePerLegs = getBasicHandlingPrice(existingFlight);

  const [showVIPDropdown, setShowVIPDropdown] = useState(false);
  const {
    control,
    formState,
    handleSubmit,
    getFieldState,
    getValues,
    resetField,
    watch,
    setValue,
  } = useForm<FormData>({
    mode: "all",
    defaultValues: {
      providedServices: existingFlight?.providedServices || {
        basicHandling: {
          total:
            basicHandlingPricePerLegs.arrival +
            basicHandlingPricePerLegs.departure,
          isPriceOverriden: false,
        },
        disbursementFees: {
          airportFee: 0,
          cateringFee: 0,
          fuelFee: 0,
          HOTACFee: 0,
          VIPLoungeFee: 0,
        },
        supportServices: {
          airportFee: {
            total: Number(
              getTotalAirportFeesPrice(existingFlight).total.toFixed(2)
            ),
          },
          fuel: {
            fuelLitersQuantity: 0,
          },
          catering: { total: 0 },
          HOTAC: { total: 0 },
        },
        VIPLoungeServices: {
          typeOf: "None",
        },
      },
    },
  });
  const { errors } = formState;
  const [priceOverrideModalVisible, setPriceOverrideModalVisible] =
    useState(false);
  const { fields, append, update } = useFieldArray({
    control,
    name: "providedServices.otherServices",
  });

  const VIPLoungeOptions =
    existingFlight?.handlingType === "Departure"
      ? [
          { label: "None", value: "None" },
          { label: "Departure", value: "Departure" },
        ]
      : existingFlight?.handlingType === "Arrival"
      ? [
          { label: "None", value: "None" },
          { label: "Arrival", value: "Arrival" },
        ]
      : [
          { label: "None", value: "None" },
          { label: "Departure", value: "Departure" },
          { label: "Arrival", value: "Arrival" },
          {
            label: "Departure & Arrival",
            value: "Departure & Arrival",
          },
        ];

  let providedServicesObj = watch("providedServices");

  //disbursement calculation
  useEffect(() => {
    const disbursementFeeMultplier = general?.disbursementPercentage / 100;
    const disbursementFees = {
      airportFee:
        providedServicesObj.supportServices.airportFee.total *
        disbursementFeeMultplier,
      fuelFee:
        getFuelFeeAmount({
          ...providedServicesObj.supportServices.fuel,
          flight: existingFlight,
        }) * disbursementFeeMultplier,
      cateringFee:
        providedServicesObj.supportServices.catering.total *
        disbursementFeeMultplier,
      HOTACFee:
        providedServicesObj.supportServices.HOTAC.total *
        disbursementFeeMultplier,
      VIPLoungeFee:
        formatMDLPriceToEuro({
          ...getLoungeFeePrice({ ...providedServicesObj.VIPLoungeServices }),
          euroToMDL: Number(existingFlight?.chargeNote.currency.euroToMDL),
        }).amountEuro * disbursementFeeMultplier,
    };

    setValue("providedServices.disbursementFees", disbursementFees);
  }, [
    providedServicesObj.supportServices.HOTAC.total,
    providedServicesObj.supportServices.catering.total,
    JSON.stringify(providedServicesObj.supportServices.fuel),
    providedServicesObj.supportServices.airportFee.total,
    JSON.stringify(providedServicesObj.VIPLoungeServices),
  ]);
  const theme = useTheme();
  useEffect(() => {
    //render additional services inputs

    //prevent from appending too many fields
    const areThereFieldsLeftToRender = fields?.length < allServices.length;

    areThereFieldsLeftToRender &&
      allServices?.forEach(({ serviceCategoryName, services }) => {
        append({
          serviceCategoryName: serviceCategoryName,
          services: services.map(({ serviceName, pricing, hasVAT }) => {
            return {
              serviceName: serviceName,
              pricing,
              isUsed: false,
              quantity: 1,
              isPriceOverriden: false,
              notes: "",

              hasVAT:
                existingFlight?.departure?.isLocalFlight ||
                existingFlight?.arrival?.isLocalFlight
                  ? hasVAT
                  : false,
            };
          }),
        });
      });
  }, [append, allServices]);

  const renderBasicHandlingVATString = () => {
    if (
      existingFlight?.departure?.isLocalFlight &&
      existingFlight?.arrival?.isLocalFlight
    ) {
      return `*${general?.VAT}% VAT applied`;
    } else if (existingFlight?.departure?.isLocalFlight) {
      return `*${general?.VAT}% VAT applied on departure leg`;
    } else if (existingFlight?.arrival?.isLocalFlight) {
      return `*${general?.VAT}% VAT applied on arrival leg`;
    }
  };

  // HELPERS
  const submit = (data: IFlight) => {
    dispatch(
      updateFlight({
        ...existingFlight,
        providedServices: {
          ...data.providedServices,
          basicHandling: {
            total: data?.providedServices?.basicHandling?.total,
            isPriceOverriden:
              data?.providedServices?.basicHandling?.total !==
              existingFlight?.providedServices?.basicHandling?.total,
          },
        },
      })
    );
    router.navigate("/signature");
  };

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={formStyles.container}
        keyboardShouldPersistTaps="always"
        alwaysBounceVertical={false}
      >
        <SectionTitle>
          Basic Handling (MTOW: {existingFlight?.mtow}kg )
        </SectionTitle>
        <View>
          <Controller
            control={control}
            defaultValue={0}
            name="providedServices.basicHandling.total"
            rules={{
              required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            }}
            render={({ field: { onBlur, onChange, value } }) => (
              <>
                <TextInput
                  label="Basic handling fee:"
                  style={formStyles.input}
                  value={value ? String(value) : ""}
                  onBlur={onBlur}
                  keyboardType="numeric"
                  onChangeText={(text) => (text ? onChange(text) : onChange(0))}
                  error={errors.providedServices?.basicHandling?.total && true}
                />
                {/* <Text>{renderBasicHandlingVATString()}</Text> */}
                <HelperText type="error">
                  {errors?.providedServices?.basicHandling?.total?.message}
                </HelperText>
                {!getFieldState("providedServices.basicHandling.total")
                  .isDirty ? (
                  <Text>{renderBasicHandlingVATString()}</Text>
                ) : (
                  <Text>*Price has been manually overriden</Text>
                )}
              </>
            )}
          />
        </View>

        <SectionTitle>Support services</SectionTitle>
        <View>
          <Text>Airport fee</Text>
          <Controller
            control={control}
            defaultValue={0}
            name="providedServices.supportServices.airportFee.total"
            rules={{
              required: { value: true, message: ERROR_MESSAGES.REQUIRED },
              pattern: {
                message: "Please insert correct format",
                value: REGEX.price,
              },
            }}
            render={({ field: { onBlur, onChange, value } }) => (
              <>
                <TextInput
                  label="Total airport fee:"
                  style={formStyles.input}
                  value={String(value)}
                  onBlur={onBlur}
                  keyboardType="numeric"
                  onChangeText={(text) => onChange(text)}
                  error={
                    errors?.providedServices?.supportServices?.airportFee
                      ?.total && true
                  }
                />
                <HelperText type="error">
                  {
                    errors?.providedServices?.supportServices?.airportFee?.total
                      ?.message
                  }
                </HelperText>
              </>
            )}
          />

          <Text>Fuel fee</Text>
          <Controller
            control={control}
            defaultValue={0}
            name="providedServices.supportServices.fuel.fuelLitersQuantity"
            rules={{
              required: { value: true, message: ERROR_MESSAGES.REQUIRED },
              pattern: {
                message: "Please insert correct format",
                value: REGEX.number,
              },
            }}
            render={({ field: { onBlur, onChange, value, name } }) => (
              <>
                <TextInput
                  label="Fuel liters quantity:"
                  style={formStyles.input}
                  value={String(value)}
                  onBlur={(e) => {
                    if (!value) onChange(0);
                    onBlur();
                  }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    if (text) {
                      onChange(text.replace(/[^0-9]/g, ""));
                    } else {
                      setValue(name, "" as any); //prevent throwing undefined errors
                    }
                  }}
                  error={
                    errors?.providedServices?.supportServices?.fuel
                      ?.fuelLitersQuantity && true
                  }
                />
                <HelperText type="error">
                  {
                    errors?.providedServices?.supportServices?.fuel
                      ?.fuelLitersQuantity?.message
                  }
                </HelperText>
              </>
            )}
          />
          <Controller
            control={control}
            defaultValue={0}
            name="providedServices.supportServices.fuel.fuelDensity"
            rules={{
              required: { value: true, message: ERROR_MESSAGES.REQUIRED },
              pattern: {
                message: "Please insert correct format",
                value: REGEX.number,
              },
            }}
            render={({ field: { onBlur, onChange, value, name } }) => (
              <>
                <TextInput
                  label="Fuel density:"
                  style={formStyles.input}
                  value={String(value)}
                  onBlur={(e) => {
                    if (!value) onChange(0);
                    onBlur();
                  }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    if (text) {
                      onChange(text.replace(/[^0-9.]/g, ""));
                    } else {
                      setValue(name, "" as any); //prevent throwing undefined errors
                    }
                  }}
                  error={
                    errors?.providedServices?.supportServices?.fuel
                      ?.fuelDensity && true
                  }
                />
                <HelperText type="error">
                  {
                    errors?.providedServices?.supportServices?.fuel?.fuelDensity
                      ?.message
                  }
                </HelperText>
              </>
            )}
          />

          <Text>Catering fee</Text>
          <Controller
            control={control}
            defaultValue={0}
            name="providedServices.supportServices.catering.total"
            rules={{
              required: { value: true, message: ERROR_MESSAGES.REQUIRED },
              pattern: {
                message: "Please insert correct format",
                value: REGEX.price,
              },
            }}
            render={({ field: { onBlur, onChange, value, name } }) => (
              <>
                <TextInput
                  label="Catering:"
                  style={formStyles.input}
                  value={String(value)}
                  onBlur={(e) => {
                    if (!value) onChange(0);
                    onBlur();
                  }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    if (text) {
                      onChange(text.replace(/[^0-9]/g, ""));
                    } else {
                      setValue(name, "" as any); //prevent throwing undefined errors
                    }
                  }}
                  error={
                    errors?.providedServices?.supportServices?.catering
                      ?.total && true
                  }
                />
                <HelperText type="error">
                  {
                    errors?.providedServices?.supportServices?.catering?.total
                      ?.message
                  }
                </HelperText>
              </>
            )}
          />
          <Text>HOTAC fee</Text>
          <Controller
            control={control}
            defaultValue={0}
            name="providedServices.supportServices.HOTAC.total"
            rules={{
              required: { value: true, message: ERROR_MESSAGES.REQUIRED },
              pattern: {
                message: "Please insert correct format",
                value: REGEX.number,
              },
            }}
            render={({ field: { onBlur, onChange, value, name } }) => (
              <>
                <TextInput
                  label="HOTAC:"
                  style={formStyles.input}
                  value={String(value)}
                  onBlur={(e) => {
                    if (!value) onChange(0);
                    onBlur();
                  }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    if (text) {
                      onChange(text.replace(/[^0-9]/g, ""));
                    } else {
                      setValue(name, "" as any); //prevent throwing undefined errors
                    }
                  }}
                  error={
                    errors?.providedServices?.supportServices?.HOTAC?.total &&
                    true
                  }
                />
                <HelperText type="error">
                  {
                    errors?.providedServices?.supportServices?.HOTAC?.total
                      ?.message
                  }
                </HelperText>
              </>
            )}
          />
        </View>

        <SectionTitle>VIP Lounge services</SectionTitle>
        <Controller
          control={control}
          defaultValue={"None"}
          name="providedServices.VIPLoungeServices.typeOf"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <DropDown
                label={"VIP Lounge"}
                mode={"outlined"}
                visible={showVIPDropdown}
                showDropDown={() => setShowVIPDropdown(true)}
                onDismiss={() => setShowVIPDropdown(false)}
                value={value}
                setValue={(value) => {
                  onChange(value);
                }}
                list={VIPLoungeOptions}
              />
              <HelperText type="error">
                {errors?.providedServices?.VIPLoungeServices?.typeOf?.message}
              </HelperText>
            </>
          )}
        />
        {providedServicesObj.VIPLoungeServices?.typeOf !== "None" && (
          <View>
            <Controller
              control={control}
              defaultValue={0}
              name="providedServices.VIPLoungeServices.adultPax"
              rules={{
                required: { value: true, message: ERROR_MESSAGES.REQUIRED },
                pattern: {
                  message: "Please insert correct format",
                  value: REGEX.number,
                },
              }}
              render={({ field: { onBlur, onChange, value, name } }) => (
                <>
                  <TextInput
                    label="Adult passengers:"
                    style={formStyles.input}
                    value={String(value)}
                    onBlur={(e) => {
                      if (!value) onChange(0);
                      onBlur();
                    }}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      if (text) {
                        onChange(text.replace(/[^0-9]/g, ""));
                      } else {
                        setValue(name, "" as any); //prevent throwing undefined errors
                      }
                    }}
                    error={
                      errors?.providedServices?.VIPLoungeServices?.adultPax &&
                      true
                    }
                  />
                  <HelperText type="error">
                    {
                      errors?.providedServices?.VIPLoungeServices?.adultPax
                        ?.message
                    }
                  </HelperText>
                </>
              )}
            />
            <Controller
              control={control}
              defaultValue={0}
              name="providedServices.VIPLoungeServices.minorPax"
              rules={{
                required: { value: true, message: ERROR_MESSAGES.REQUIRED },
                pattern: {
                  message: "Please insert correct format",
                  value: REGEX.number,
                },
              }}
              render={({ field: { onBlur, onChange, value, name } }) => (
                <>
                  <TextInput
                    label="Minor passengers:"
                    style={formStyles.input}
                    value={String(value)}
                    onBlur={(e) => {
                      if (!value) onChange(0);
                      onBlur();
                    }}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      if (text) {
                        onChange(text.replace(/[^0-9]/g, ""));
                      } else {
                        setValue(name, "" as any); //prevent throwing undefined errors
                      }
                    }}
                    error={
                      errors?.providedServices?.VIPLoungeServices?.minorPax &&
                      true
                    }
                  />
                  <HelperText type="error">
                    {
                      errors?.providedServices?.VIPLoungeServices?.minorPax
                        ?.message
                    }
                  </HelperText>
                </>
              )}
            />
          </View>
        )}
        <View>
          {fields?.map((category, categoryIndex) => {
            return (
              <>
                <SectionTitle>{category?.serviceCategoryName}</SectionTitle>
                {category?.services?.map((service, serviceIndex) => {
                  const {
                    isUsed,
                    notes,
                    quantity,
                    serviceName,
                    hasVAT,
                    isPriceOverriden,
                    pricing: { amount, currency },
                  } = service;
                  return (
                    <>
                      <View style={{ ...formStyles.row, marginVertical: 30 }}>
                        <Text variant="bodyLarge">
                          {isPriceOverriden && (
                            <MaterialCommunityIcons
                              name="pencil"
                              size={14}
                              color={theme.colors.onSurface}
                            />
                          )}{" "}
                          {serviceName} {hasVAT && `(with VAT)`}
                          {"  "}
                        </Text>
                        <Controller
                          control={control}
                          defaultValue={isUsed}
                          name={`providedServices.otherServices.${categoryIndex}.services.${serviceIndex}.isUsed`}
                          render={({ field: { value, onChange } }) => (
                            <>
                              <Switch
                                value={value}
                                onValueChange={(value) => {
                                  //if there is at least oen erroneous field, dont' allow selecting dynamic fields
                                  //this causees race conditions
                                  if (
                                    Object.entries(errors).some(
                                      ([key, value]) => {
                                        if (value) {
                                          alert(
                                            "Please complete the erroneous fields first"
                                          );
                                          return value;
                                        }
                                      }
                                    )
                                  )
                                    return;

                                  update(categoryIndex, {
                                    ...category,
                                    services: (category?.services).map(
                                      (service, i) =>
                                        i === serviceIndex
                                          ? { ...service, isUsed: value }
                                          : service
                                    ),
                                  });
                                  onChange(value);
                                }}
                              />
                            </>
                          )}
                        />
                      </View>
                      <View>
                        {isUsed === true && (
                          <>
                            {
                              <>
                                <Controller
                                  control={control}
                                  defaultValue={1}
                                  name={`providedServices.otherServices.${categoryIndex}.services.${serviceIndex}.quantity`}
                                  rules={{
                                    required: {
                                      value: true,
                                      message: ERROR_MESSAGES.REQUIRED,
                                    },
                                    pattern: {
                                      message: "Please insert correct format",
                                      value: REGEX.number,
                                    },
                                  }}
                                  render={({
                                    field: { onBlur, onChange, value },
                                  }) => (
                                    <>
                                      <TextInput
                                        label="Quantity:"
                                        style={formStyles.input}
                                        value={String(value)}
                                        onBlur={onBlur}
                                        keyboardType="numeric"
                                        onChangeText={(text) => onChange(text)}
                                        error={
                                          //@ts-ignore
                                          errors?.providedServices
                                            ?.otherServices[categoryIndex]
                                            ?.services[serviceIndex]
                                            ?.quantity && true
                                        }
                                      />
                                    </>
                                  )}
                                />
                                <Controller
                                  control={control}
                                  defaultValue={""}
                                  name={`providedServices.otherServices.${categoryIndex}.services.${serviceIndex}.notes`}
                                  render={({
                                    field: { onBlur, onChange, value },
                                  }) => (
                                    <>
                                      <TextInput
                                        label="notes:"
                                        style={formStyles.input}
                                        value={String(value)}
                                        onBlur={onBlur}
                                        onChangeText={(text) => onChange(text)}
                                      />
                                    </>
                                  )}
                                />
                                <View
                                  style={{
                                    ...formStyles.row,
                                    marginVertical: 0,
                                  }}
                                >
                                  <Text
                                    style={{
                                      marginVertical: 5,
                                      alignItems: "center",
                                    }}
                                  >
                                    Amount:{" "}
                                    {isPriceOverriden
                                      ? service?.totalPriceOverride
                                      : (quantity || 0) * amount}
                                    {currency}
                                  </Text>
                                  <Button
                                    onPress={() =>
                                      setPriceOverrideModalVisible(true)
                                    }
                                  >
                                    <MaterialCommunityIcons
                                      name="pencil"
                                      size={14}
                                    />
                                  </Button>
                                </View>
                                <View
                                  style={{
                                    ...formStyles.row,
                                    marginVertical: 0,
                                  }}
                                >
                                  <PriceOverrideModal
                                    visible={priceOverrideModalVisible}
                                    onDismiss={() =>
                                      setPriceOverrideModalVisible(false)
                                    }
                                  >
                                    <Text variant="bodyMedium">
                                      {serviceName}
                                    </Text>
                                    <Controller
                                      control={control}
                                      defaultValue={undefined}
                                      name={`providedServices.otherServices.${categoryIndex}.services.${serviceIndex}.totalPriceOverride`}
                                      render={({
                                        field: { onBlur, onChange, value },
                                      }) => (
                                        <>
                                          <TextInput
                                            label="Manual price override:"
                                            style={formStyles.input}
                                            onBlur={onBlur}
                                            onChangeText={(text) =>
                                              onChange(text)
                                            }
                                          />

                                          <View
                                            style={{
                                              justifyContent: "space-between",
                                              flexDirection: "row",
                                              marginVertical: 10,
                                              alignItems: "center",
                                            }}
                                          >
                                            <Button
                                              onPress={() => {
                                                update(categoryIndex, {
                                                  ...category,
                                                  services:
                                                    (category?.services).map(
                                                      (service, i) =>
                                                        i === serviceIndex
                                                          ? {
                                                              ...service,
                                                              isPriceOverriden:
                                                                false,
                                                            }
                                                          : service
                                                    ),
                                                });
                                                setPriceOverrideModalVisible(
                                                  false
                                                );
                                              }}
                                            >
                                              Reset
                                            </Button>
                                            <Button
                                              style={{ marginVertical: 20 }}
                                              mode="contained"
                                              onPress={() => {
                                                update(categoryIndex, {
                                                  ...category,
                                                  services:
                                                    (category?.services).map(
                                                      (service, i) =>
                                                        i === serviceIndex
                                                          ? {
                                                              ...service,
                                                              isPriceOverriden:
                                                                true,
                                                              totalPriceOverride:
                                                                value,
                                                            }
                                                          : service
                                                    ),
                                                });
                                                setPriceOverrideModalVisible(
                                                  false
                                                );
                                              }}
                                            >
                                              Submit
                                            </Button>
                                          </View>
                                        </>
                                      )}
                                    />
                                  </PriceOverrideModal>
                                </View>
                              </>
                            }

                            {/* {isPriceOverriden && (
                              <Controller
                                control={control}
                                defaultValue={0}
                                name={`providedServices.otherServices.${categoryIndex}.services.${serviceIndex}.totalPriceOverride`}
                                render={({
                                  field: { onBlur, onChange, value },
                                }) => (
                                  <>
                                    <TextInput
                                      label="Manual price override:"
                                      style={formStyles.input}
                                      value={String(value)}
                                      onBlur={onBlur}
                                      onChangeText={(text) => onChange(text)}
                                    />
                                  </>
                                )}
                              />
                            )} */}
                          </>
                        )}
                      </View>
                      <Divider />
                    </>
                  );
                })}
              </>
            );
          })}
        </View>

        <TotalServicesSection
          providedServices={providedServicesObj}
          existingFlight={existingFlight}
        />

        <View style={{ marginVertical: 20 }}>
          <Button
            mode="contained"
            onPress={handleSubmit(submit)}
            disabled={!formState.isValid}
          >
            Submit services information
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const PriceOverrideModal = ({
  //@ts-expect-error
  children,
  visible = false,
  onDismiss = () => {},
  onSubmit = () => {},
}) => {
  const theme = useTheme();

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={{
          padding: 20,
          backgroundColor: "transparent",
        }}
      >
        <View
          style={{
            backgroundColor: theme.colors.surface,
            height: 250,
            padding: 30,
            justifyContent: "center",
            borderRadius: 15,
          }}
        >
          {children}
        </View>
      </Modal>
    </Portal>
  );
};

export default Form;
