import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { View, ScrollView, SafeAreaView, StyleSheet } from "react-native";
import formStyles from "@/styles/formStyles";

import {
  TextInput,
  Button,
  Switch,
  HelperText,
  Text,
} from "react-native-paper";
import { Flight } from "@/redux/types";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import REGEX from "@/utils/regexp";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/redux/store";
import {
  getTotalAirportFeesPrice,
  getAllServices,
  getBasicHandlingPrice,
  getLoungeFeePrice,
} from "@/services/servicesCalculator";
import { selectCurrentFlight } from "@/redux/slices/flightsSlice/selectors";
import ERROR_MESSAGES from "@/utils/formErrorMessages";
import DropDown from "react-native-paper-dropdown";
import SectionTitle from "@/components/FormUtils/SectionTitle";
import { updateFlight } from "@/redux/slices/flightsSlice";
import { useRouter } from "expo-router";
import TotalServicesSection from "@/components/TotalServicesSection";
import { initializeConfigsAsync } from "@/redux/slices/generalConfigSlice";
import { getFuelFeeAmount } from "@/services/AirportFeesManager";
import convertCurrency from "@/utils/convertCurrency";
type FormData = Flight;

const Form: React.FC = () => {
  const SERVICES_DEFINITIONS = getAllServices();

  const state = useSelector((state: RootState) => state);
  const { general } = state;
  const existingFlight = selectCurrentFlight(state);
  const dispatch = useAppDispatch();
  const router = useRouter();
  useEffect(() => {
    dispatch(initializeConfigsAsync());
  }, [dispatch]);

  const [showVIPDropdown, setShowVIPDropdown] = useState(false);
  const {
    control,
    formState,
    handleSubmit,
    getValues,
    resetField,
    watch,
    setValue,
  } = useForm<FormData>({
    mode: "all",
    defaultValues: {
      providedServices: existingFlight?.providedServices || {
        basicHandling: getBasicHandlingPrice(existingFlight) || 0,
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
            fuelDensity: 1000,
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
        getLoungeFeePrice({ ...providedServicesObj.VIPLoungeServices }).amount *
        disbursementFeeMultplier,
    };

    setValue("providedServices.disbursementFees", disbursementFees);
  }, [
    providedServicesObj.supportServices.HOTAC.total,
    providedServicesObj.supportServices.catering.total,
    JSON.stringify(providedServicesObj.supportServices.fuel),
    providedServicesObj.supportServices.airportFee.total,
    JSON.stringify(providedServicesObj.VIPLoungeServices),
  ]);

  useEffect(() => {
    //render additional services inputs

    //prevent from appending too many fields
    const areThereFieldsLeftToRender =
      fields?.length < SERVICES_DEFINITIONS.length;

    areThereFieldsLeftToRender &&
      SERVICES_DEFINITIONS?.forEach(({ serviceCategoryName, services }) => {
        append({
          serviceCategoryName: serviceCategoryName,
          services: services.map(({ serviceName, pricingRules, hasVAT }) => {
            return {
              serviceName: serviceName,
              pricingRules: pricingRules,
              isUsed: false,
              quantity: 1,
              notes: "",
              hasVAT,
            };
          }),
        });
      });
  }, [append, SERVICES_DEFINITIONS]);

  // HELPERS
  const submit = (data: any) => {
    dispatch(
      updateFlight({
        ...existingFlight,
        providedServices: data.providedServices,
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
            name="providedServices.basicHandling"
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
                  label="Basic handling fee:"
                  style={formStyles.input}
                  value={String(value)}
                  onBlur={onBlur}
                  keyboardType="numeric"
                  onChangeText={(text) => onChange(text)}
                  error={errors.providedServices?.basicHandling && true}
                />
                <HelperText type="error">
                  {errors?.providedServices?.basicHandling?.message}
                </HelperText>
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
                      onChange(text.replace(/[^0-9]/g, ""));
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
                  const { isUsed, notes, quantity, serviceName } = service;
                  return (
                    <>
                      <View style={{ ...formStyles.row, marginVertical: 10 }}>
                        <Text variant="bodyLarge">{serviceName}</Text>
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
                                      errors?.providedServices?.otherServices[
                                        categoryIndex
                                      ]?.services[serviceIndex]?.quantity &&
                                      true
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
                          </>
                        )}
                      </View>
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

export default Form;
