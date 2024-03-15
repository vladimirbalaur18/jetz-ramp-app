import React, { ReactNode, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TextComponent,
  SafeAreaView,
} from "react-native";
import {
  TextInput,
  Button,
  Switch,
  HelperText,
  List,
  Text,
  RadioButton,
} from "react-native-paper";
import { Flight } from "@/redux/types";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { FlightSchedule } from "@/redux/types";
import {
  DatePickerInput,
  DatePickerModal,
  TimePicker,
  TimePickerModal,
} from "react-native-paper-dates";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "expo-router";
import REGEX from "@/utils/regexp";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
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
  const router = useRouter();
  const state = useSelector((state: RootState) => state);

  const currentFlight = selectCurrentFlight(state);

  const { control, formState, handleSubmit, getValues } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      providedServices: {
        basicHandling: getBasicHandlingPrice(currentFlight) || 0,
      },
    },
  });
  const allAdditionalServicesConfig = getAllServices();
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
    name: "providedServices.additionalServices",
  });
  const { errors } = formState;
  const { additionalServices, basicHandling } = getValues("providedServices");

  useEffect(() => {
    allAdditionalServicesConfig?.services?.map(
      ({ serviceName, pricePerQty }) => {
        append({
          serviceName: serviceName,
          isUsed: false,
          quantity: 1,
          notes: "",
          pricePerQty: pricePerQty,
        });
      }
    );
  }, []);
  const submit = (data: any) => {
    console.log(data);
    // router.navigate("/(createFlight)/providedServices");
  };
  const [visible, setVisible] = React.useState(false);

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
        <SectionTitle>Additional services</SectionTitle>

        {fields.map((item, index) => {
          return (
            <>
              <View style={styles.row}>
                <Text variant="bodyLarge">{item?.serviceName}</Text>
                <Controller
                  control={control}
                  defaultValue={item.isUsed}
                  name={`providedServices.additionalServices.${index}.isUsed`}
                  render={({ field: { value, onChange } }) => (
                    <>
                      <Switch
                        value={value}
                        onValueChange={(value) => {
                          update(index, { ...item, isUsed: value });
                          onChange(value);
                        }}
                      />
                    </>
                  )}
                />
              </View>
              <View>
                {item?.isUsed === true && (
                  <Controller
                    control={control}
                    defaultValue={1}
                    name={`providedServices.additionalServices.${index}.quantity`}
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
                    render={({ field: { onBlur, onChange, value } }) => (
                      <>
                        <TextInput
                          label="Quantity:"
                          style={styles.input}
                          value={String(value)}
                          onBlur={onBlur}
                          keyboardType="numeric"
                          onChangeText={(text) => onChange(text)}
                          error={errors.arrival?.minorCount && true}
                        />
                        <HelperText type="error">
                          {errors.arrival?.minorCount?.message}
                        </HelperText>
                      </>
                    )}
                  />
                )}
              </View>
            </>
          );
        })}
        <Button
          mode="contained"
          onPress={handleSubmit(submit)}
          disabled={!formState.isValid}
        >
          Submit services information
        </Button>
        <SectionTitle>Total:</SectionTitle>
        {<Text>Basic handling: {basicHandling}</Text>}
        {additionalServices?.map((s) => {
          return (
            s.isUsed && (
              <Text>
                {s?.serviceName} {s?.quantity * s?.pricePerQty}
              </Text>
            )
          );
        })}
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
