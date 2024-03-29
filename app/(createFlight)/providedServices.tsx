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
import { RootState } from "@/redux/store";
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
import { getFuelFeeData } from "@/services/AirportFeesManager";

type FormData = Flight;

const Form: React.FC = () => {
  const state = useSelector((state: RootState) => state);
  const currentFlight = selectCurrentFlight(state);

  const [showVIPDropdown, setShowVIPDropdown] = useState(false);

  const { control, formState, handleSubmit, getValues, resetField } =
    useForm<FormData>({
      mode: "all",
      defaultValues: {
        providedServices: {
          basicHandling: getBasicHandlingPrice(currentFlight) || 0,
          supportServices: {
            airportFee: {
              total: Number(
                getTotalAirportFeesPrice(currentFlight).total.toFixed(2)
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

  const { fields, append, update } = useFieldArray({
    control,
    name: "providedServices.otherServices",
  });
  const SERVICES_DEFINITIONS = getAllServices();

  const VIPLoungeOptions =
    currentFlight?.handlingType === "Departure"
      ? [
          { label: "None", value: "None" },
          { label: "Departure", value: "Departure" },
        ]
      : currentFlight?.handlingType === "Arrival"
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

  const { errors } = formState;
  const {
    otherServices,
    basicHandling,
    supportServices: { HOTAC, airportFee, catering, fuel },
    VIPLoungeServices,
  } = getValues("providedServices");

  const { amount: loungeFeeAmount, currency: loungeFeeCurrency } =
    getLoungeFeePrice(currentFlight, VIPLoungeServices?.typeOf);
  const { pricePerKg, density } = getFuelFeeData();
  const [uncompletedInput, setCurrentUncompletedInput] = useState<
    string | null
  >("");

  const totalFuelPrice = (
    (fuel?.fuelDensity * fuel?.fuelLitersQuantity * pricePerKg) /
    density
  ).toFixed(2);

  useEffect(() => {
    //render additional services inputs

    //prevent from appending too many fields
    const areFieldsRendered = fields?.length < SERVICES_DEFINITIONS.length;

    areFieldsRendered &&
      SERVICES_DEFINITIONS?.forEach(({ serviceCategoryName, services }) => {
        append({
          serviceCategoryName: serviceCategoryName,
          services: services.map(({ serviceName, pricingRules }) => {
            return {
              serviceName: serviceName,
              pricingRules: pricingRules,
              isUsed: false,
              quantity: 1,
              notes: "",
            };
          }),
        });
      });
  }, [append, SERVICES_DEFINITIONS]);
  const submit = (data: any) => {
    console.log(data);
    // router.navigate("/(createFlight)/providedServices");
  };
  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={formStyles.container}
        keyboardShouldPersistTaps="always"
        alwaysBounceVertical={false}
      >
        <SectionTitle>
          Basic Handling (MTOW: {currentFlight?.mtow}kg )
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
                value: REGEX.number,
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
                value: REGEX.number,
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
                  onFocus={() => setCurrentUncompletedInput(name)}
                  onBlur={(e) => {
                    if (value) {
                      setCurrentUncompletedInput(null);
                    }
                    onBlur();
                  }}
                  keyboardType="numeric"
                  onChangeText={(text) => onChange(text)}
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
            render={({ field: { onBlur, onChange, value } }) => (
              <>
                <TextInput
                  label="Fuel density:"
                  style={formStyles.input}
                  value={String(value)}
                  onBlur={onBlur}
                  keyboardType="numeric"
                  onChangeText={(text) => onChange(text)}
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
                value: REGEX.number,
              },
            }}
            render={({ field: { onBlur, onChange, value } }) => (
              <>
                <TextInput
                  label="Catering:"
                  style={formStyles.input}
                  value={String(value)}
                  onBlur={onBlur}
                  keyboardType="numeric"
                  onChangeText={(text) => onChange(text)}
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
            render={({ field: { onBlur, onChange, value } }) => (
              <>
                <TextInput
                  label="HOTAC:"
                  style={formStyles.input}
                  value={String(value)}
                  onBlur={onBlur}
                  keyboardType="numeric"
                  onChangeText={(text) => onChange(text)}
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
        {VIPLoungeServices?.typeOf !== "None" && (
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
              render={({ field: { onBlur, onChange, value } }) => (
                <>
                  <TextInput
                    label="Adult passengers:"
                    style={formStyles.input}
                    value={String(value)}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      onChange(text);
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
              render={({ field: { onBlur, onChange, value } }) => (
                <>
                  <TextInput
                    label="Minor passengers:"
                    style={formStyles.input}
                    value={String(value)}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    onChangeText={(text) => onChange(text)}
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
                                  console.log(errors);
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

        <View>
          <SectionTitle>Services list:</SectionTitle>
          <Text style={styles.serviceListItem} variant="titleMedium">
            Basic handling (MTOW: {currentFlight?.mtow}kg): {basicHandling}
            &euro;
          </Text>
          <Text style={styles.serviceListItem} variant="titleMedium">
            VIP Lounge ({VIPLoungeServices?.typeOf}): {loungeFeeAmount}{" "}
            {loungeFeeCurrency}
          </Text>
          {otherServices?.map(({ serviceCategoryName, services }) => {
            return (
              <>
                <Text style={styles.serviceListItem} variant="titleMedium">
                  {serviceCategoryName}:
                </Text>
                {!services.some((service) => service.isUsed) ? (
                  <Text>None</Text>
                ) : (
                  services?.map((s) => {
                    return s.isUsed ? (
                      <Text>
                        {" "}
                        {s?.serviceName} (x{s?.quantity}):{" "}
                        {((): ReactNode => {
                          let total: any;

                          for (const rule of s?.pricingRules) {
                            if (rule?.ruleName === "pricePerQty") {
                              total =
                                s?.quantity * rule?.amount +
                                " " +
                                rule?.currency;
                            }
                          }

                          return <>{total}</>;
                        })()}
                      </Text>
                    ) : null;
                  })
                )}
              </>
            );
          })}
          <Text style={styles.serviceListItem} variant="titleMedium">
            Airport fees: {airportFee.total || 0}&euro;
          </Text>
          <Text style={styles.serviceListItem} variant="titleMedium">
            HOTAC fees: {HOTAC.total || 0}&euro;
          </Text>
          <Text style={styles.serviceListItem} variant="titleMedium">
            Catering fees: {catering.total || 0}&euro;
          </Text>
          <Text style={styles.serviceListItem} variant="titleMedium">
            Fuel fee: {totalFuelPrice || 0}&euro;
          </Text>
          <Text style={styles.serviceListItem} variant="titleLarge">
            Total: {totalFuelPrice || 0}&euro;
          </Text>
        </View>

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

const styles = StyleSheet.create({
  serviceListItem: {
    marginVertical: 10,
    fontWeight: "600",
  },
});
