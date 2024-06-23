import formStyles from "@/styles/formStyles";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, View, Alert } from "react-native";

import SectionTitle from "@/components/FormUtils/SectionTitle";
import TotalServicesSection from "@/components/TotalServicesSection";
import { GeneralConfigState } from "@/models/Config";
import { updateFlight } from "@/redux/slices/flightsSlice";
import { selectCurrentFlight } from "@/redux/slices/flightsSlice/selectors";
import { RootState, useAppDispatch } from "@/redux/store";
import { getFuelFeeAmount } from "@/services/AirportFeesManager";
import { IService, Service } from "@/models/Services";
import {
  getBasicHandlingPrice,
  getLoungeFeePrice,
  getTotalAirportFeesPrice,
} from "@/services/servicesCalculator";
import ERROR_MESSAGES from "@/utils/formErrorMessages";
import formatMDLPriceToEuro from "@/utils/priceFormatter";
import REGEX from "@/utils/regexp";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery, useRealm } from "@realm/react";
import { useRouter } from "expo-router";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  Button,
  Divider,
  HelperText,
  Icon,
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
import _selectCurrentFlight from "@/utils/selectCurrentFlight";
import { IProvidedServices, ProvidedServices } from "@/models/ProvidedServices";
import { IBasicHandling } from "@/models/BasicHandling";
import { IVIPLoungeService } from "@/models/VIPLoungeService";
import { ISupportServices } from "@/models/SupportServices";
import { ObjectId } from "bson";
import { IServiceCategory } from "@/models/ServiceCategory";
import { IProvidedService, ProvidedService } from "@/models/ProvidedService";
import uuid from "react-uuid";
type FormData = IFlight;

const Form: React.FC = () => {
  // const allServices = getAllServices();
  const allServices = useQuery<IServiceCategory>("ServiceCategory");
  const defaultServicesPerCategories = allServices.flatMap((sc) => [
    ...sc.services,
  ]);
  console.log(defaultServicesPerCategories);
  const services = useQuery<IService>("Service");
  const currentFlightId = useSelector(
    (state: RootState) => state.flights.currentFlightId
  );
  const [general] = useQuery<GeneralConfigState>("General");
  const realmExistingFlight = _selectCurrentFlight(currentFlightId || "");
  const existingFlight = realmExistingFlight?.toJSON() as IFlight;

  console.log("HEY", existingFlight);
  const realm = useRealm();
  const router = useRouter();
  const basicHandlingPricePerLegs =
    existingFlight && getBasicHandlingPrice({ ...existingFlight });
  const disbursementPercentage =
    existingFlight.chargeNote.disbursementPercentage;

  const airportFeesDetails = getTotalAirportFeesPrice(existingFlight).fees;

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
      providedServices: {
        basicHandling: {
          total:
            (basicHandlingPricePerLegs?.arrival || 0) +
            (basicHandlingPricePerLegs?.departure || 0),
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
              existingFlight
                ? getTotalAirportFeesPrice(existingFlight).total.toFixed(2)
                : 0
            ),
          },
          fuel: {
            fuelLitersQuantity: 0,
          },
          catering: { total: 0 },
          HOTAC: { total: 0 },
        },
        VIPLoungeServices: {
          departureAdultPax: 0,
          departureMinorPax: 0,
          arrivalAdultPax: 0,
          arrivalMinorPax: 0,
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

  let providedServicesObj = watch("providedServices");

  useEffect(() => {
    if (!existingFlight.providedServices) {
      defaultServicesPerCategories.map((s) => {
        append({
          service: s,
          isUsed: false,
          isPriceOverriden: false,
          quantity: 1,
        });
      });
      console.log("services count", services.length);
    } else {
      existingFlight.providedServices.otherServices?.forEach((s) => {
        append({
          service: s.service,
          isUsed: s.isUsed,
          isPriceOverriden: s.isPriceOverriden,
          quantity: s.quantity,
          notes: s.notes || "",
          totalPriceOverride: s.totalPriceOverride,
        });
      });
    }
  }, []);
  //disbursement calculation
  useEffect(() => {
    const disbursementFeeMultplier = disbursementPercentage / 100;
    const disbursementFees = {
      airportFee:
        (providedServicesObj?.supportServices.airportFee.total || 0) *
        disbursementFeeMultplier,
      fuelFee:
        getFuelFeeAmount({
          ...(providedServicesObj?.supportServices.fuel || {
            fuelDensity: 0,
            fuelLitersQuantity: 0,
          }),
          flight: existingFlight,
        }) * disbursementFeeMultplier,
      cateringFee:
        (providedServicesObj?.supportServices.catering.total || 0) *
        disbursementFeeMultplier,
      HOTACFee:
        (providedServicesObj?.supportServices.HOTAC.total || 0) *
        disbursementFeeMultplier,
      VIPLoungeFee:
        formatMDLPriceToEuro({
          ...getLoungeFeePrice({ ...providedServicesObj?.VIPLoungeServices }),
          euroToMDL: Number(existingFlight?.chargeNote.currency.euroToMDL),
        }).amountEuro * disbursementFeeMultplier,
    };

    setValue("providedServices.disbursementFees", disbursementFees);
  }, [
    providedServicesObj?.supportServices.HOTAC.total,
    providedServicesObj?.supportServices.catering.total,
    JSON.stringify(providedServicesObj?.supportServices.fuel),
    providedServicesObj?.supportServices.airportFee.total,
    JSON.stringify(providedServicesObj?.VIPLoungeServices),
  ]);
  const theme = useTheme();

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
    console.log("providedServicesSubmit", data);
    console.log("services", data.providedServices?.otherServices);

    realm.write(() => {
      const providedServices = realm.create<IProvidedServices>(
        "ProvidedServices",
        {
          VIPLoungeServices: realm.create<IVIPLoungeService>(
            "VIPLoungeService",
            {
              departureAdultPax: Number(
                data.providedServices?.VIPLoungeServices.departureAdultPax || 0
              ),
              departureMinorPax: Number(
                data.providedServices?.VIPLoungeServices.departureMinorPax || 0
              ),
              arrivalAdultPax: Number(
                data.providedServices?.VIPLoungeServices.arrivalAdultPax || 0
              ),
              arrivalMinorPax: Number(
                data.providedServices?.VIPLoungeServices.arrivalMinorPax || 0
              ),
            }
          ),
          basicHandling: realm.create<IBasicHandling>("BasicHandling", {
            total: Number(data?.providedServices?.basicHandling?.total),
            isPriceOverriden:
              data?.providedServices?.basicHandling?.total !==
              existingFlight?.providedServices?.basicHandling?.total,
          }),
          disbursementFees: data.providedServices?.disbursementFees,
          supportServices: realm.create<ISupportServices>("SupportServices", {
            HOTAC: {
              total: Number(
                data?.providedServices?.supportServices.HOTAC.total
              ),
            },
            airportFee: {
              total: Number(
                data?.providedServices?.supportServices.airportFee.total
              ),
            },
            catering: {
              total: Number(
                data?.providedServices?.supportServices.catering.total
              ),
            },
            fuel: {
              fuelDensity: Number(
                data.providedServices?.supportServices.fuel.fuelDensity
              ),
              fuelLitersQuantity: Number(
                data.providedServices?.supportServices.fuel.fuelLitersQuantity
              ),
            },
          }),
          otherServices: data?.providedServices?.otherServices?.map((s) => {
            return new ProvidedService(realm, {
              isPriceOverriden: s.isPriceOverriden,
              isUsed: s.isUsed,
              notes: s.notes,
              quantity: Number(s.quantity),
              service: new Service(realm, {
                ...s.service,
                _id: new ObjectId(),
              }),
              totalPriceOverride: Number(s.totalPriceOverride),
            });
          }),
        }
      );
      console.log("pushind provided services", providedServices);
      if (realmExistingFlight)
        realmExistingFlight.providedServices = providedServices;
    });

    //   console.log("providedServicesRealm: ", providedServices.toJSON());
    // });
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
          <Text style={{ alignItems: "center" }}>
            Airport fee{" "}
            <Pressable
              onPress={() =>
                Alert.alert(
                  "Airport fee details:",
                  `Take-off: ${airportFeesDetails.takeOff.toFixed(
                    2
                  )}\nSecurity: ${airportFeesDetails.security.toFixed(
                    2
                  )} \nPassengers: ${airportFeesDetails.passengers.toFixed(
                    2
                  )} \nParking: ${airportFeesDetails.parking.toFixed(
                    2
                  )} \nLanding: ${airportFeesDetails.takeOff.toFixed(2)}`,
                  [
                    {
                      text: "OK",
                    },
                  ],
                  { cancelable: true }
                )
              }
            >
              <Icon source="information" size={16} color="white" />
            </Pressable>
          </Text>

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
                      onChange(text.replace(/[,]/g, "."));
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
                      onChange(text.replace(/[,]/g, "."));
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
                      onChange(text.replace(/[^0-9.]/g, ""));
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
                      onChange(text.replace(/[^0-9.]/g, ""));
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

        <View>
          <Text variant="bodyMedium">Departure</Text>
          <Controller
            control={control}
            defaultValue={0}
            name="providedServices.VIPLoungeServices.departureAdultPax"
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
                  label="Departure adult passengers:"
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
                    errors?.providedServices?.VIPLoungeServices
                      ?.departureAdultPax && true
                  }
                />
                <HelperText type="error">
                  {
                    errors?.providedServices?.VIPLoungeServices
                      ?.departureAdultPax?.message
                  }
                </HelperText>
              </>
            )}
          />
          <Controller
            control={control}
            defaultValue={0}
            name="providedServices.VIPLoungeServices.departureMinorPax"
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
                  label="Departure minor passengers:"
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
                    errors?.providedServices?.VIPLoungeServices
                      ?.departureMinorPax && true
                  }
                />
                <HelperText type="error">
                  {
                    errors?.providedServices?.VIPLoungeServices
                      ?.departureMinorPax?.message
                  }
                </HelperText>
              </>
            )}
          />
          <Text variant="bodyMedium">Arrival</Text>
          <Controller
            control={control}
            defaultValue={0}
            name="providedServices.VIPLoungeServices.arrivalAdultPax"
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
                  label="Arrival adult passengers:"
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
                    errors?.providedServices?.VIPLoungeServices
                      ?.arrivalAdultPax && true
                  }
                />
                <HelperText type="error">
                  {
                    errors?.providedServices?.VIPLoungeServices?.arrivalAdultPax
                      ?.message
                  }
                </HelperText>
              </>
            )}
          />
          <Controller
            control={control}
            defaultValue={0}
            name="providedServices.VIPLoungeServices.arrivalMinorPax"
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
                  label="Arrival minor passengers:"
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
                    errors?.providedServices?.VIPLoungeServices
                      ?.arrivalMinorPax && true
                  }
                />
                <HelperText type="error">
                  {
                    errors?.providedServices?.VIPLoungeServices?.arrivalMinorPax
                      ?.message
                  }
                </HelperText>
              </>
            )}
          />
        </View>

        <View>
          {fields.map((field, serviceIndex, array) => {
            const {
              service,
              isPriceOverriden,
              isUsed,
              notes,
              quantity,
              totalPriceOverride,
            } = field;

            const { serviceName, hasVAT, price } = service;

            return (
              <>
                {field.service.categoryName !==
                  array[serviceIndex - 1]?.service?.categoryName && (
                  <SectionTitle>{field.service.categoryName}</SectionTitle>
                )}
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
                    name={`providedServices.otherServices.${serviceIndex}.isUsed`}
                    render={({ field: { value, onChange } }) => (
                      <>
                        <Switch
                          value={value}
                          onValueChange={(value) => {
                            //if there is at least oen erroneous field, dont' allow selecting dynamic fields
                            //this causees race conditions
                            if (
                              Object.entries(errors).some(([key, value]) => {
                                if (value) {
                                  alert(
                                    "Please complete the erroneous fields first"
                                  );
                                  return value;
                                }
                              })
                            )
                              return;

                            update(serviceIndex, {
                              service,
                              isPriceOverriden,
                              notes: notes || "",
                              quantity,
                              totalPriceOverride,
                              isUsed: value,
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
                            name={`providedServices.otherServices.${serviceIndex}.quantity`}
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
                                      serviceIndex
                                    ]?.quantity && true
                                  }
                                />
                              </>
                            )}
                          />
                          <Controller
                            control={control}
                            defaultValue={""}
                            name={`providedServices.otherServices.${serviceIndex}.notes`}
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
                                ? totalPriceOverride
                                : (quantity || 0) * price}
                              &euro;
                            </Text>
                            <Button
                              onPress={() => setPriceOverrideModalVisible(true)}
                            >
                              <MaterialCommunityIcons name="pencil" size={14} />
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
                              <Text variant="bodyMedium">{serviceName}</Text>
                              <Controller
                                control={control}
                                defaultValue={undefined}
                                name={`providedServices.otherServices.${serviceIndex}.totalPriceOverride`}
                                render={({
                                  field: { onBlur, onChange, value },
                                }) => (
                                  <>
                                    <TextInput
                                      label="Manual price override:"
                                      style={formStyles.input}
                                      onBlur={onBlur}
                                      onChangeText={(text) => onChange(text)}
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
                                          update(serviceIndex, {
                                            service,
                                            isPriceOverriden: false,
                                            notes,
                                            quantity,
                                            totalPriceOverride,
                                            isUsed,
                                          });
                                          setPriceOverrideModalVisible(false);
                                        }}
                                      >
                                        Reset
                                      </Button>
                                      <Button
                                        style={{ marginVertical: 20 }}
                                        mode="contained"
                                        onPress={() => {
                                          update(serviceIndex, {
                                            service,
                                            isPriceOverriden: true,
                                            notes,
                                            quantity,
                                            totalPriceOverride: value,
                                            isUsed,
                                          });
                                          setPriceOverrideModalVisible(false);
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
                    </>
                  )}
                </View>
                <Divider />
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
