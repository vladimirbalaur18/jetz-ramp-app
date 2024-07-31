import formStyles from "@/styles/formStyles";
import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";

import SectionTitle from "@/components/FormUtils/SectionTitle";
import TotalServicesSection from "@/components/TotalServicesSection";
import { GeneralConfigState } from "@/models/Config";
import { RootState } from "@/redux/store";
import { getFuelFeeAmount } from "@/services/AirportFeesManager";
import { Service } from "@/models/Services";
import {
  getBasicHandlingPrice,
  getVIPLoungeFeePrice,
  getTotalAirportFeesPrice,
} from "@/services/feeCalculator";
import ERROR_MESSAGES from "@/utils/formErrorMessages";
import formatMDLPriceToEuro from "@/utils/priceFormatter";
import REGEX from "@/utils/regexp";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery, useRealm } from "@realm/react";
import { Stack, useRouter } from "expo-router";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  Button,
  Divider,
  HelperText,
  IconButton,
  Modal,
  Portal,
  Switch,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { useSelector } from "react-redux";
import { IFlight } from "@/models/Flight";
import _selectCurrentFlight from "@/utils/selectCurrentFlight";
import { IProvidedServices } from "@/models/ProvidedServices";
import { IBasicHandling } from "@/models/BasicHandling";
import { IVIPLoungeService } from "@/models/VIPLoungeService";
import { ISupportServices } from "@/models/SupportServices";
import { IServiceCategory } from "@/models/ServiceCategory";
import { ProvidedService } from "@/models/ProvidedService";
import {
  onlyIntNumber,
  replaceCommaWithDot,
} from "@/utils/numericInputFormatter";
import { useSnackbar } from "@/context/snackbarContext";
import _ from "lodash";
import { isSummerNightTime, isWinterNightTime } from "@/utils/isNightTime";
import getParsedDateTime from "@/utils/getParsedDateTime";
import { SafeNumber } from "@/utils/SafeNumber";
import { AirportSubFeeTotal } from "@/services/AirportFeesManager/types";
import { useProvidedServicesFields } from "@/hooks/useProvidedServicesFields";
type FormData = IFlight;

const Form: React.FC = () => {
  const [airportFeeModalVisible, setAirportFeeModalVisible] = useState(false);
  const [priceOverrideModalVisible, setPriceOverrideModalVisible] = useState<
    number | null
  >(null);

  const [general] = useQuery<GeneralConfigState>("General");
  const realm = useRealm();
  const router = useRouter();
  const snackbar = useSnackbar();
  const theme = useTheme();
  const currentFlightId = useSelector(
    (state: RootState) => state?.flights.currentFlightId
  );

  const realmExistingFlight = _selectCurrentFlight(currentFlightId || "");
  if (!realmExistingFlight)
    throw new Error(
      "There was an error initiailzing the existing flight from database on providedServices page. Reload the app."
    );

  const existingFlight = realmExistingFlight?.toJSON() as IFlight;

  if (!currentFlightId)
    throw new Error(
      "There was an error initiailzing currentFlightId on providedServices page. Reload the app."
    );

  console.log(
    "Existing flight on render providedServices",
    JSON.stringify(existingFlight, null, 5)
  );
  const basicHandlingPricePerLegs =
    existingFlight && getBasicHandlingPrice({ ...existingFlight });

  const { control, formState, handleSubmit, getFieldState, watch, setValue } =
    useForm<FormData>({
      mode: "onBlur",
      defaultValues: {
        providedServices: {
          basicHandling: existingFlight?.providedServices?.basicHandling
            ? { ...existingFlight.providedServices.basicHandling }
            : {
                total:
                  (basicHandlingPricePerLegs?.arrival || 0) +
                  (basicHandlingPricePerLegs?.departure || 0),
                isPriceOverriden: false,
              },
          supportServices: {
            airportFee: {
              total: Number(
                existingFlight?.providedServices?.supportServices?.airportFee
                  ?.total
                  ? existingFlight?.providedServices?.supportServices
                      ?.airportFee?.total
                  : getTotalAirportFeesPrice(existingFlight).total.toFixed(2)
              ),
            },
            fuel: {
              fuelLitersQuantity:
                existingFlight?.providedServices?.supportServices?.fuel
                  ?.fuelLitersQuantity || 0,
              fuelDensity:
                existingFlight?.providedServices?.supportServices?.fuel
                  ?.fuelDensity || 0,
            },
            catering: {
              total:
                existingFlight?.providedServices?.supportServices?.catering
                  ?.total || 0,
            },
            HOTAC: {
              total:
                existingFlight?.providedServices?.supportServices?.HOTAC
                  ?.total || 0,
            },
          },
          VIPLoungeServices: {
            departureAdultPax:
              existingFlight?.providedServices?.VIPLoungeServices
                ?.departureAdultPax || 0,
            departureMinorPax:
              existingFlight?.providedServices?.VIPLoungeServices
                ?.departureMinorPax || 0,
            arrivalAdultPax:
              existingFlight?.providedServices?.VIPLoungeServices
                ?.arrivalAdultPax || 0,
            arrivalMinorPax:
              existingFlight?.providedServices?.VIPLoungeServices
                ?.arrivalMinorPax || 0,
            remarks:
              existingFlight?.providedServices?.VIPLoungeServices?.remarks ||
              "",
          },
        },
      },
    });

  const { fields, update } = useProvidedServicesFields({
    control,
    existingFlight,
  });

  const submit = (data: IFlight) => {
    realm.write(() => {
      const providedServices = realm.create<IProvidedServices>(
        "ProvidedServices",
        {
          VIPLoungeServices: realm.create<IVIPLoungeService>(
            "VIPLoungeService",
            {
              departureAdultPax: Number(
                data.providedServices?.VIPLoungeServices?.departureAdultPax || 0
              ),
              departureMinorPax: Number(
                data.providedServices?.VIPLoungeServices?.departureMinorPax || 0
              ),
              arrivalAdultPax: Number(
                data.providedServices?.VIPLoungeServices?.arrivalAdultPax || 0
              ),
              arrivalMinorPax: Number(
                data.providedServices?.VIPLoungeServices?.arrivalMinorPax || 0
              ),
              remarks: data.providedServices?.VIPLoungeServices?.remarks || "",
            }
          ),
          basicHandling: realm.create<IBasicHandling>("BasicHandling", {
            total: Number(data?.providedServices?.basicHandling?.total),
            isPriceOverriden:
              data.providedServices?.basicHandling?.isPriceOverriden,
          }),
          supportServices: realm.create<ISupportServices>("SupportServices", {
            HOTAC: {
              total: Number(
                data?.providedServices?.supportServices.HOTAC?.total
              ),
            },
            airportFee: {
              total: Number(
                data?.providedServices?.supportServices?.airportFee?.total
              ),
            },
            catering: {
              total: Number(
                data?.providedServices?.supportServices?.catering?.total
              ),
            },
            fuel: {
              fuelDensity: Number(
                data.providedServices?.supportServices?.fuel?.fuelDensity
              ),
              fuelLitersQuantity: Number(
                data.providedServices?.supportServices?.fuel?.fuelLitersQuantity
              ),
            },
          }),
          otherServices: data?.providedServices?.otherServices?.map((s) => {
            console.log("HH", JSON.stringify(s));
            const _service = realm.objectForPrimaryKey(
              "Service",
              s.service._id
            );
            return new ProvidedService(realm, {
              isPriceOverriden: s.isPriceOverriden,
              isUsed: s.isUsed,
              notes: s.notes,
              quantity: s.isPriceOverriden ? 1 : Number(s.quantity),
              service: _service as any,
              totalPriceOverride: Number(s.totalPriceOverride),
            });
          }),
        }
      );
      if (realmExistingFlight)
        realmExistingFlight.providedServices = providedServices;
    });
    router.navigate("/signature");
  };

  let providedServicesObj = watch("providedServices");
  const { errors } = formState;
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

  const resetServices = () => {
    realm.write(() => {
      if (realmExistingFlight?.providedServices) {
        realm.delete(realmExistingFlight?.providedServices);
        router.replace("/(createFlight)/providedServices");
        snackbar.showSnackbar("Services have been reset");
      }
    });
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <>
              <Button
                disabled={!realmExistingFlight?.providedServices}
                onPress={resetServices}
                mode="text"
                icon={"table-refresh"}
              >
                Reset services
              </Button>
            </>
          ),
        }}
      />
      <SafeAreaView>
        <ScrollView
          contentContainerStyle={formStyles.container}
          keyboardShouldPersistTaps="always"
          alwaysBounceVertical={false}
        >
          <AirportFeeOverrideModal
            currentSum={
              watch("providedServices.supportServices.airportFee.total") || 0
            }
            visible={airportFeeModalVisible}
            onDismiss={() => setAirportFeeModalVisible(false)}
            existingFlight={existingFlight}
            onSubmit={(sum) => {
              setValue(
                "providedServices.supportServices.airportFee.total",
                sum
              );

              setAirportFeeModalVisible(false);
              snackbar.showSnackbar("Airport fees modified successfully");
            }}
          />

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
                pattern: {
                  message: "Invalid number format",
                  value: REGEX.number,
                },
              }}
              render={({ field: { onBlur, onChange, value } }) => (
                <>
                  <TextInput
                    label="Basic handling fee:"
                    style={formStyles.input}
                    value={SafeNumber(value)}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    onChangeText={(value) => {
                      onChange(replaceCommaWithDot(value));
                      setValue(
                        "providedServices.basicHandling.isPriceOverriden",
                        true
                      );
                    }}
                    error={errors?.providedServices?.basicHandling && true}
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
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ alignItems: "center" }}>Airport fee </Text>
              <IconButton
                icon="information"
                size={16}
                onPress={() => setAirportFeeModalVisible(true)}
              />
            </View>

            <Controller
              control={control}
              defaultValue={0}
              name="providedServices.supportServices.airportFee.total"
              rules={{
                required: { value: true, message: ERROR_MESSAGES.REQUIRED },
                pattern: {
                  message: "Invalid number format",
                  value: REGEX.number,
                },
              }}
              render={({ field: { onBlur, onChange, value } }) => (
                <>
                  <TextInput
                    label="Total airport fee:"
                    style={formStyles.input}
                    value={SafeNumber(value)}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    onChangeText={(value) =>
                      onChange(replaceCommaWithDot(value))
                    }
                    error={
                      errors?.providedServices?.supportServices?.airportFee
                        ?.total && true
                    }
                  />
                  <HelperText type="error">
                    {
                      errors?.providedServices?.supportServices?.airportFee
                        ?.total?.message
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
                  message: "Invalid number format",
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
                    onChangeText={(value) =>
                      onChange(replaceCommaWithDot(value))
                    }
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
                  message: "Invalid number format",
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
                    onChangeText={(value) =>
                      onChange(replaceCommaWithDot(value))
                    }
                    error={
                      errors?.providedServices?.supportServices?.fuel
                        ?.fuelDensity && true
                    }
                  />
                  <HelperText type="error">
                    {
                      errors?.providedServices?.supportServices?.fuel
                        ?.fuelDensity?.message
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
                  message: "Invalid number format",
                  value: REGEX.number,
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
                    onChangeText={(value) =>
                      onChange(replaceCommaWithDot(value))
                    }
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
                    onChangeText={(value) =>
                      onChange(replaceCommaWithDot(value))
                    }
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
                    onChangeText={(value) =>
                      _.isString(value) && onChange(onlyIntNumber(value))
                    }
                    onBlur={(e) => {
                      if (!value) onChange(0);
                      onBlur();
                    }}
                    keyboardType="numeric"
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
                    onChangeText={(value) => onChange(onlyIntNumber(value))}
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
                    onChangeText={(value) => onChange(onlyIntNumber(value))}
                    error={
                      errors?.providedServices?.VIPLoungeServices
                        ?.arrivalAdultPax && true
                    }
                  />
                  <HelperText type="error">
                    {
                      errors?.providedServices?.VIPLoungeServices
                        ?.arrivalAdultPax?.message
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
                    onChangeText={(value) => onChange(onlyIntNumber(value))}
                    error={
                      errors?.providedServices?.VIPLoungeServices
                        ?.arrivalMinorPax && true
                    }
                  />
                  <HelperText type="error">
                    {
                      errors?.providedServices?.VIPLoungeServices
                        ?.arrivalMinorPax?.message
                    }
                  </HelperText>
                </>
              )}
            />
            <Text variant="bodyMedium">Remarks:</Text>
            <Controller
              control={control}
              defaultValue={""}
              name="providedServices.VIPLoungeServices.remarks"
              render={({ field: { onBlur, onChange, value, name } }) => (
                <>
                  <TextInput
                    label="VIP lounge remarks:"
                    style={formStyles.input}
                    value={String(value)}
                    onChangeText={(value) => onChange(value)}
                    error={
                      errors?.providedServices?.VIPLoungeServices?.remarks &&
                      true
                    }
                  />
                  <HelperText type="error">
                    {
                      errors?.providedServices?.VIPLoungeServices?.remarks
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
                                quantity: 1,
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
                                    value={
                                      isPriceOverriden ? "1" : String(value)
                                    }
                                    onBlur={onBlur}
                                    disabled={isPriceOverriden === true}
                                    keyboardType="numeric"
                                    onChangeText={(value) =>
                                      onChange(onlyIntNumber(value))
                                    }
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
                                  : (watch(
                                      `providedServices.otherServices.${serviceIndex}.quantity`
                                    ) || 0) * price}
                                &euro;
                              </Text>
                              <Button
                                onPress={() =>
                                  setPriceOverrideModalVisible(serviceIndex)
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
                                visible={
                                  priceOverrideModalVisible === serviceIndex
                                }
                                onDismiss={() =>
                                  setPriceOverrideModalVisible(null)
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
                                        keyboardType="numeric"
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
                                            setPriceOverrideModalVisible(null);
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
                                            setPriceOverrideModalVisible(null);
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
    </>
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

const AirportFeeOverrideModal = ({
  visible = false,
  onDismiss = () => {},
  onSubmit = (sum: number) => {},
  existingFlight,
  currentSum,
}: {
  existingFlight: IFlight;
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (sum: number) => void;
  currentSum: number;
}) => {
  if (!existingFlight)
    throw new Error(
      "Existing flight not found. Cant initialize airport fees modal"
    );

  const theme = useTheme();
  const airportFeesDetails = getTotalAirportFeesPrice(existingFlight).fees;
  const airportFeeOverrideForm = useForm<{
    landing: AirportSubFeeTotal;
    takeOff: AirportSubFeeTotal;
    passengers: AirportSubFeeTotal;
    security: AirportSubFeeTotal;
    parking: AirportSubFeeTotal;
  }>({
    defaultValues: {
      ...airportFeesDetails,
    },
  });

  const fullDepartureDateTime = getParsedDateTime(
    existingFlight?.departure?.departureDate,
    existingFlight?.departure?.departureTime
  );
  const fullArrivalDateTime = getParsedDateTime(
    existingFlight?.arrival?.arrivalDate,
    existingFlight?.arrival?.arrivalTime
  );

  const flightHasDeparture =
    existingFlight?.handlingType === "FULL" ||
    existingFlight?.handlingType === "Departure";

  const flightHasArrival =
    existingFlight?.handlingType === "FULL" ||
    existingFlight?.handlingType === "Arrival";

  const [isLoading, setIsLoading] = useState(false);
  const fees = airportFeeOverrideForm.watch();

  const totals = useMemo(
    () => Object.values(fees).reduce((acc, val) => acc + val.total, 0),
    [fees]
  );

  useEffect(() => {
    setIsLoading(false);
  }, [visible]);
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
            // height: ,
            padding: 30,
            justifyContent: "center",
            borderRadius: 15,
          }}
        >
          <View>
            <Text variant="headlineSmall">Airport fee details</Text>
            {existingFlight?.providedServices && totals != currentSum && (
              <Text style={{ marginVertical: 10 }} variant="bodySmall">
                Note: below numbers are the fees precalculated by system. Their
                sum will not match if the total was overriden before. By
                clicking submit, you will override the values to default.
              </Text>
            )}
            <Controller
              control={airportFeeOverrideForm.control}
              name="landing.total"
              rules={{
                required: { value: true, message: ERROR_MESSAGES.REQUIRED },
                pattern: {
                  message: "Invalid number format",
                  value: REGEX.number,
                },
              }}
              render={({ field: { onBlur, onChange, value } }) => (
                <>
                  <TextInput
                    label="Landing fee:"
                    style={formStyles.input}
                    value={SafeNumber(value)}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    onChangeText={(value) =>
                      onChange(replaceCommaWithDot(value))
                    }
                    error={
                      airportFeeOverrideForm.formState.errors.landing?.total &&
                      true
                    }
                  />
                  {airportFeeOverrideForm?.formState?.errors?.landing?.total &&
                    true && (
                      <HelperText type="error">
                        {
                          airportFeeOverrideForm?.formState?.errors?.landing
                            .total?.message
                        }
                      </HelperText>
                    )}
                  {airportFeeOverrideForm.getFieldState("landing.total")
                    .isDirty && (
                    <HelperText type="info">
                      *Price has been manually overriden
                    </HelperText>
                  )}
                  {flightHasArrival &&
                    !airportFeeOverrideForm.getFieldState("landing.total")
                      .isDirty &&
                    isWinterNightTime(fullArrivalDateTime) && (
                      <HelperText type="info">
                        *Winter night Quota has been applied
                      </HelperText>
                    )}
                  {flightHasArrival &&
                    !airportFeeOverrideForm.getFieldState("landing.total")
                      .isDirty &&
                    isSummerNightTime(fullArrivalDateTime) && (
                      <HelperText type="info">
                        *Summer night Quota has been applied
                      </HelperText>
                    )}
                  {!airportFeeOverrideForm.getFieldState("landing.total")
                    .isDirty &&
                    airportFeeOverrideForm.getValues("landing.VAT") && (
                      <HelperText type="info">*With VAT</HelperText>
                    )}
                </>
              )}
            />
            <Controller
              control={airportFeeOverrideForm.control}
              name="takeOff.total"
              rules={{
                required: { value: true, message: ERROR_MESSAGES.REQUIRED },
                pattern: {
                  message: "Invalid number format",
                  value: REGEX.number,
                },
              }}
              render={({ field: { onBlur, onChange, value } }) => (
                <>
                  <TextInput
                    label="Takeoff fee:"
                    style={formStyles.input}
                    value={SafeNumber(value)}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    onChangeText={(value) =>
                      onChange(replaceCommaWithDot(value))
                    }
                    error={
                      airportFeeOverrideForm.formState.errors.takeOff?.total &&
                      true
                    }
                  />
                  {airportFeeOverrideForm?.formState?.errors?.takeOff
                    ?.total && (
                    <HelperText type="error">
                      {
                        airportFeeOverrideForm?.formState?.errors?.takeOff
                          ?.total?.message
                      }
                    </HelperText>
                  )}
                  {airportFeeOverrideForm.getFieldState("takeOff.total")
                    .isDirty && (
                    <HelperText type="info">
                      *Price has been manually overriden
                    </HelperText>
                  )}
                  {flightHasDeparture &&
                    !airportFeeOverrideForm.getFieldState("takeOff.total")
                      .isDirty &&
                    isWinterNightTime(fullDepartureDateTime) && (
                      <HelperText type="info">
                        *Winter night Quota has been applied
                      </HelperText>
                    )}
                  {flightHasDeparture &&
                    !airportFeeOverrideForm.getFieldState("takeOff.total")
                      .isDirty &&
                    isSummerNightTime(fullDepartureDateTime) && (
                      <HelperText type="info">
                        *Summer night Quota has been applied
                      </HelperText>
                    )}
                  {!airportFeeOverrideForm.getFieldState("takeOff.total")
                    .isDirty &&
                    airportFeeOverrideForm.getValues("takeOff.VAT") && (
                      <HelperText type="info">*With VAT</HelperText>
                    )}
                </>
              )}
            />
            <Controller
              control={airportFeeOverrideForm.control}
              name="passengers.total"
              rules={{
                required: { value: true, message: ERROR_MESSAGES.REQUIRED },
                pattern: {
                  message: "Invalid number format",
                  value: REGEX.number,
                },
              }}
              render={({ field: { onBlur, onChange, value } }) => (
                <>
                  <TextInput
                    label="Passenger fee:"
                    style={formStyles.input}
                    value={SafeNumber(value)}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    onChangeText={(value) =>
                      onChange(replaceCommaWithDot(value))
                    }
                    error={
                      airportFeeOverrideForm.formState.errors.passengers
                        ?.total && true
                    }
                  />
                  {airportFeeOverrideForm?.formState?.errors?.passengers
                    ?.total && (
                    <HelperText type="error">
                      {
                        airportFeeOverrideForm?.formState?.errors?.passengers
                          .total?.message
                      }
                    </HelperText>
                  )}
                  {airportFeeOverrideForm.getFieldState("passengers.total")
                    .isDirty && (
                    <HelperText type="info">
                      *Price has been manually overriden
                    </HelperText>
                  )}
                  {!airportFeeOverrideForm.getFieldState("passengers.total")
                    .isDirty &&
                    airportFeeOverrideForm.getValues("passengers.VAT") && (
                      <HelperText type="info">*With VAT</HelperText>
                    )}
                </>
              )}
            />
            <Controller
              control={airportFeeOverrideForm.control}
              name="security.total"
              rules={{
                required: { value: true, message: ERROR_MESSAGES.REQUIRED },
                pattern: {
                  message: "Invalid number format",
                  value: REGEX.number,
                },
              }}
              render={({ field: { onBlur, onChange, value } }) => (
                <>
                  <TextInput
                    label="Security fee:"
                    style={formStyles.input}
                    value={SafeNumber(value)}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    onChangeText={(value) =>
                      onChange(replaceCommaWithDot(value))
                    }
                    error={
                      airportFeeOverrideForm.formState.errors.security?.total &&
                      true
                    }
                  />
                  {airportFeeOverrideForm?.formState?.errors?.security
                    ?.total && (
                    <HelperText type="error">
                      {
                        airportFeeOverrideForm?.formState?.errors?.security
                          .total?.message
                      }
                    </HelperText>
                  )}
                  {airportFeeOverrideForm.getFieldState("security.total")
                    .isDirty && (
                    <HelperText type="info">
                      *Price has been manually overriden
                    </HelperText>
                  )}
                  {!airportFeeOverrideForm.getFieldState("security.total")
                    .isDirty &&
                    airportFeeOverrideForm.getValues("security.VAT") && (
                      <HelperText type="info">*With VAT</HelperText>
                    )}
                </>
              )}
            />
            <Controller
              control={airportFeeOverrideForm.control}
              name="parking.total"
              rules={{
                required: { value: true, message: ERROR_MESSAGES.REQUIRED },
                pattern: {
                  message: "Invalid number format",
                  value: REGEX.number,
                },
              }}
              render={({ field: { onBlur, onChange, value } }) => (
                <>
                  <TextInput
                    label="Parking fee:"
                    style={formStyles.input}
                    value={SafeNumber(value)}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    onChangeText={(value) =>
                      onChange(replaceCommaWithDot(value))
                    }
                    error={
                      airportFeeOverrideForm.formState.errors.parking?.total &&
                      true
                    }
                  />
                  {airportFeeOverrideForm?.formState?.errors?.parking
                    ?.total && (
                    <HelperText type="error">
                      {
                        airportFeeOverrideForm?.formState?.errors?.parking
                          ?.total?.message
                      }
                    </HelperText>
                  )}
                  {airportFeeOverrideForm.getFieldState("parking.total")
                    .isDirty && (
                    <HelperText type="info">
                      *Price has been manually overriden
                    </HelperText>
                  )}
                  {!airportFeeOverrideForm.getFieldState("parking.total")
                    .isDirty &&
                    airportFeeOverrideForm.getValues("parking.VAT") && (
                      <HelperText type="info">*With VAT</HelperText>
                    )}
                </>
              )}
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
                mode="contained"
                onPress={() => {
                  airportFeeOverrideForm.reset();
                  onDismiss && onDismiss();
                  setIsLoading(false);
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={
                  !airportFeeOverrideForm?.formState.isValid || isLoading
                }
                loading={isLoading}
                mode="outlined"
                onPress={airportFeeOverrideForm.handleSubmit((data) => {
                  setIsLoading(true);

                  const sum = Object.values(data).reduce(
                    (acc, val) => Number(acc) + Number(val.total),
                    0
                  );

                  console.log("Override sum", sum);
                  onSubmit && onSubmit(Number(sum));
                })}
              >
                Save
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

export default Form;
