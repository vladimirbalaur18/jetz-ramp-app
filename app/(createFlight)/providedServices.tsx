import React, { ReactNode, useEffect } from "react";
import { StyleSheet, View, ScrollView, SafeAreaView } from "react-native";
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
  getAirportFeePrice,
  getAllServices,
  getBasicHandlingPrice,
} from "@/services/servicesCalculator";
import { selectCurrentFlight } from "@/redux/slices/flightsSlice/selectors";
import ERROR_MESSAGES from "@/utils/formErrorMessages";

type FormData = Flight;

const SectionTitle = ({ children }: { children: ReactNode }) => {
  return (
    <View style={styles.row}>
      <Text variant="headlineSmall">{children}</Text>
    </View>
  );
};

const Form: React.FC = () => {
  const state = useSelector((state: RootState) => state);
  console.log("ps", state);
  const currentFlight = selectCurrentFlight(state);

  const { control, formState, handleSubmit, getValues } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      providedServices: {
        basicHandling: getBasicHandlingPrice(currentFlight) || 0,
        supportServices: {
          airportFee: { total: getAirportFeePrice(currentFlight) },
          fuel: {
            fuelDensity: 1000,
            fuelLitersQuantity: 0,
          },
          catering: { total: 0 },
          HOTAC: { total: 0 },
        },
      },
    },
  });
  const SERVICES_DEFINITIONS = getAllServices();
  const {
    fields,
    append,
    prepend,
    remove,
    swap,
    move,
    insert,
    replace,
    update,
  } = useFieldArray({
    control,
    name: "providedServices.otherServices",
  });
  const { errors } = formState;
  const {
    otherServices,
    basicHandling,
    supportServices: { HOTAC, airportFee, catering, fuel },
  } = getValues("providedServices");

  useEffect(() => {
    //render additional services inputs

    //prevent from appending too many fields
    const areFieldsRendered = fields?.length < SERVICES_DEFINITIONS.length;

    areFieldsRendered &&
      SERVICES_DEFINITIONS?.forEach(({ serviceCategoryName, services }) => {
        append({
          serviceCategoryName: serviceCategoryName,
          services: services.map(({ serviceName, pricePerQty }) => {
            return {
              serviceName: serviceName,
              pricePerQty: pricePerQty,
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
  const [visible, setVisible] = React.useState(false);
  console.log("fields", fields);

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={styles.container}
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
                  style={styles.input}
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
                  style={styles.input}
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
            render={({ field: { onBlur, onChange, value } }) => (
              <>
                <TextInput
                  label="Fuel liters quantity:"
                  style={styles.input}
                  value={String(value)}
                  onBlur={onBlur}
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
                  style={styles.input}
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
                  style={styles.input}
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
                  style={styles.input}
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

        {/* RAMP CHECKLIST SERVICES */}
        <View>
          {fields?.map((category, categoryIndex) => {
            return (
              <>
                <SectionTitle>{category?.serviceCategoryName}</SectionTitle>
                {category?.services?.map((service, serviceIndex) => {
                  const { isUsed, notes, quantity, serviceName } = service;
                  return (
                    <>
                      <View style={{ ...styles.row, marginVertical: 10 }}>
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
                                    style={styles.input}
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
                                    style={styles.input}
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
          <Text>
            Basic handling (MTOW: {currentFlight?.mtow}kg): {basicHandling}
            &euro;
          </Text>
          {otherServices?.map(({ serviceCategoryName, services }) => {
            return (
              <>
                <Text>-{serviceCategoryName}</Text>
                {services?.map((s) => {
                  return s.isUsed ? (
                    <Text>
                      {s?.serviceName} (x{s?.quantity}):{" "}
                      {s?.quantity * s?.pricePerQty}&euro;
                    </Text>
                  ) : null;
                })}
              </>
            );
          })}
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
  container: {
    justifyContent: "center",
    marginHorizontal: 30,
    paddingVertical: 30,
  },
  input: { marginVertical: 5 },
  row: {
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 20,
    justifyContent: "space-between",
  },
});
