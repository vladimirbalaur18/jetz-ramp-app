import React from "react";
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
import { Flight } from "@/redux/slices/flightsSlice/types";
import { useForm, Controller } from "react-hook-form";
import { FlightSchedule } from "@/redux/types";
import {
  DatePickerInput,
  DatePickerModal,
  TimePicker,
  TimePickerModal,
} from "react-native-paper-dates";
import dayjs, { Dayjs } from "dayjs";
type FormData = Flight & {
  name: string;
  surname: string;
  email: string;
  scheduleType: string;
  termsAccepted: boolean;
  arrivalFrom: string;
  arrivalDate: Date;
  arrivalTime: {
    hours: number;
    minutes: number;
  };
  departurePassengers: {
    adultCount: number;
    minorCount: number;
  };

  arrivalPassengers: {
    adultCount: number;
    minorCount: number;
  };
  fodArrival: boolean;
  beforeArrivalInspection: boolean;
};

const PASSWORD_MIN_LENGTH = 6;

const REGEX = {
  number: /^[0-9]*$/,
  airfield: /^[A-Z]{4}$/,
  operatorName: /^[a-z ,.'-]+$/i,
  aircraftRegistration:
    /^[A-Z]-[A-Z]{4}|[A-Z]{2}-[A-Z]{3}|N[0-9]{1,5}[A-Z]{0,2}$/,
  flightNumber:
    /([A-Za-z]{2}|[A-Za-z]\d|\d[A-Za-z])[A-Za-z]{0,1}\d(\d{0,3})[A-Za-z]{0,1}/,
  email:
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
};

const ERROR_MESSAGES = {
  REQUIRED: "This Field Is Required",
  NAME_INVALID: "Not a Valid Name",
  TERMS: "Terms Must Be Accepted To Continue",
  EMAIL_INVALID: "Not a Valid Email",
};

const Form: React.FC = () => {
  const { control, formState, handleSubmit } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      name: "mama",
    },
  });

  const { errors } = formState;

  const submit = (data: any) => console.log(data);
  const [visible, setVisible] = React.useState(false);

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="always"
        alwaysBounceVertical={false}
      >
        <View style={styles.row}>
          <Text variant="headlineSmall">General</Text>
        </View>
        <Controller
          control={control}
          defaultValue=""
          name="operatorName"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            pattern: {
              message: "Not a valid operator Name",
              value: REGEX.operatorName,
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Operator Name"
                style={styles.input}
                value={value}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={errors.operatorName && true}
              />
              <HelperText type="error">
                {errors.operatorName?.message}
              </HelperText>
            </>
          )}
        />
        <Controller
          control={control}
          defaultValue=""
          name="flightNumber"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            pattern: {
              message: "Not a Valid Flight number",
              value: REGEX.flightNumber,
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Flight number"
                style={styles.input}
                value={value}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={errors.flightNumber && true}
              />
              <HelperText type="error">
                {errors.flightNumber?.message}
              </HelperText>
            </>
          )}
        />

        <Controller
          control={control}
          name="scheduleType"
          defaultValue=""
          rules={{
            required: { message: ERROR_MESSAGES.REQUIRED, value: true },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <List.Section title="Schedule type">
                <RadioButton.Group
                  value={value}
                  onValueChange={(value: string) => {
                    console.log(value);
                    onChange(value);
                  }}
                >
                  {Object.entries(FlightSchedule).map(([key, value]) => {
                    return <RadioButton.Item label={key} value={key} />;
                  })}
                </RadioButton.Group>
              </List.Section>
              <HelperText type="error">
                {errors.scheduleType?.message}
              </HelperText>
            </>
          )}
        />
        {/*  */}
        <Controller
          control={control}
          defaultValue=""
          name="orderingCompanyName"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            pattern: {
              message: "Not a valid company Name",
              value: REGEX.operatorName,
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Ordering company name"
                style={styles.input}
                value={value}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={errors.orderingCompanyName && true}
              />
              <HelperText type="error">
                {errors.orderingCompanyName?.message}
              </HelperText>
            </>
          )}
        />
        {/*  */}
        <Controller
          control={control}
          defaultValue=""
          name="aircraftType"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Aircraft type"
                style={styles.input}
                value={value}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={errors.aircraftType && true}
              />
              <HelperText type="error">
                {errors.aircraftType?.message}
              </HelperText>
            </>
          )}
        />
        {/*  */}
        <Controller
          control={control}
          defaultValue=""
          name="aircraftRegistration"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            pattern: {
              message: "Aircraft registration format is not valid",
              value: REGEX.aircraftRegistration,
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Aircraft registration"
                style={styles.input}
                value={value}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={errors.aircraftRegistration && true}
              />
              <HelperText type="error">
                {errors.aircraftRegistration?.message}
              </HelperText>
            </>
          )}
        />
        <View style={styles.row}>
          <Text variant="headlineSmall">Arrival</Text>
        </View>
        <Controller
          control={control}
          defaultValue=""
          name="arrivalFrom"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            pattern: {
              message: "Not a valid ICAO",
              value: REGEX.airfield,
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="From (ICAO):"
                style={styles.input}
                value={value}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={errors.arrivalFrom && true}
              />
              <HelperText type="error">
                {errors.arrivalFrom?.message}
              </HelperText>
            </>
          )}
        />
        <Controller
          control={control}
          defaultValue={dayjs().toDate()}
          name="arrivalDate"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <DatePickerInput
                locale="en-GB"
                label="Arrival date"
                value={value}
                onChange={(d) => onChange(d)}
                inputMode="start"
                style={{ width: 200 }}
                mode="outlined"
              />
              <HelperText type="error">
                {errors.arrivalDate?.message}
              </HelperText>
            </>
          )}
        />
        <Controller
          control={control}
          defaultValue={{
            hours: dayjs().get("hours"),
            minutes: dayjs().get("minutes"),
          }}
          name="arrivalTime"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <View
                style={{
                  justifyContent: "space-between",
                  flex: 1,
                  alignItems: "center",
                  flexDirection: "row",
                  gap: 30,
                }}
              >
                <TextInput
                  label="time"
                  editable={false}
                  style={{ ...styles.input, flex: 1 }}
                  value={`${
                    value.hours < 10 ? "0" + value.hours : value.hours
                  }:${
                    value.minutes < 10 ? "0" + value.minutes : value.minutes
                  }`}
                />
                <Button
                  onPress={() => setVisible(true)}
                  uppercase={false}
                  mode="outlined"
                  style={{ flex: 1 }}
                >
                  Select arrival time
                </Button>
                <TimePickerModal
                  locale="en-GB"
                  visible={visible}
                  onDismiss={() => setVisible(false)}
                  onConfirm={(value) => {
                    setVisible(false);
                    onChange(value);
                  }}
                />
              </View>

              <HelperText type="error">
                {errors.arrivalTime?.message}
              </HelperText>
            </>
          )}
        />
        <Controller
          control={control}
          defaultValue={{ adultCount: 0, minorCount: 0 }}
          name="departurePassengers"
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
                label="Adult passenger count"
                style={styles.input}
                value={value?.adultCount as unknown as string}
                onBlur={onBlur}
                keyboardType="numeric"
                onChangeText={(text) =>
                  onChange({
                    minorCount: value?.minorCount,
                    adultCount: text,
                  })
                }
                error={errors.departurePassengers && true}
              />
              <TextInput
                label="Minor passenger count"
                style={styles.input}
                value={value?.minorCount as unknown as string}
                onBlur={onBlur}
                keyboardType="numeric"
                onChangeText={(text) =>
                  onChange({
                    adultCount: value?.adultCount,
                    minorCount: text,
                  })
                }
                error={errors.departurePassengers && true}
              />
              <HelperText type="error">
                {errors.departurePassengers?.message}
              </HelperText>
              <Text variant="bodyLarge">
                Total passengers:{" "}
                {Number(value?.adultCount) + Number(value?.minorCount)}
              </Text>
            </>
          )}
        />

        <View style={styles.row}>
          <Text variant="bodyLarge">Found FOD before arrival</Text>
          <Controller
            control={control}
            defaultValue={false}
            name="fodArrival"
            render={({ field: { value, onChange } }) => (
              <>
                <Switch
                  value={value}
                  onValueChange={(value) => onChange(value)}
                />
              </>
            )}
          />
        </View>
        <View style={styles.row}>
          <Text variant="bodyLarge">Ramp inspection completed</Text>
          <Controller
            control={control}
            defaultValue={false}
            name="beforeArrivalInspection"
            rules={{
              required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            }}
            render={({ field: { value, onChange } }) => (
              <>
                <Switch
                  value={value}
                  onValueChange={(value) => onChange(value)}
                />
              </>
            )}
          />
          {/* FIND SOMEWHERE TO PLACE THIS FIELD */}
          {/* <HelperText type="error">
            {errors.beforeArrivalInspection?.message}
          </HelperText> */}
        </View>

        <Button
          mode="contained"
          onPress={handleSubmit(submit)}
          disabled={!formState.isValid}
        >
          Submit
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Form;

const styles = StyleSheet.create({
  container: { justifyContent: "center", marginHorizontal: 30 },
  input: { marginVertical: 5 },
  row: {
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 20,
    justifyContent: "space-between",
  },
});
