import React, { useLayoutEffect, useState } from "react";
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
import { useForm, Controller } from "react-hook-form";
import { FlightSchedule } from "@/redux/types";
import {
  DatePickerInput,
  DatePickerModal,
  TimePicker,
  TimePickerModal,
} from "react-native-paper-dates";
import dayjs, { Dayjs } from "dayjs";
import { useLocalSearchParams, useRouter } from "expo-router";
type FormData = Flight;
import REGEX from "@/utils/regexp";
const ERROR_MESSAGES = {
  REQUIRED: "This Field Is Required",
  NAME_INVALID: "Not a Valid Name",
  TERMS: "Terms Must Be Accepted To Continue",
  EMAIL_INVALID: "Not a Valid Email",
};
import { useDispatch, useSelector } from "react-redux";
import { pushArrivalInformation } from "@/redux/slices/flightsSlice";
import { RootState } from "@/redux/store";
const Form: React.FC = () => {
  const router = useRouter();
  const currentFlight = useSelector(
    (state: RootState) => state?.flights?.currentFlight
  );

  const dispatch = useDispatch();
  const { control, formState, handleSubmit, getValues } = useForm<FormData>({
    mode: "onChange",
    defaultValues: (currentFlight as Flight) || {
      aircraftRegistration: "LY-TBA",
      aircraftType: "SR22",
      arrival: {
        arrivalTime: { hours: 10, minutes: 12 },
        arrivalDate: new Date(),
        from: "LUKK",
        adultCount: 1,
        minorCount: 2,
        rampInspectionBeforeArrival: {
          status: true,
          FOD: true,
        },
      },
      parkingPosition: 22,
      flightNumber: "TY123",
      operatorName: "Mama",
      orderingCompanyName: "Mama",
      scheduleType: FlightSchedule.NonScheduled,
    },
  });

  const { errors } = formState;

  const submit = (data: any) => {
    console.log(data, currentFlight);
    dispatch(pushArrivalInformation(data));
    router.navigate("/(createFlight)/departure");
  };
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
          defaultValue={FlightSchedule.NonScheduled}
          rules={{
            required: { message: ERROR_MESSAGES.REQUIRED, value: true },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <List.Section title="Schedule type">
                <RadioButton.Group
                  value={FlightSchedule.NonScheduled}
                  onValueChange={(value: string) => {
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
        <Controller
          control={control}
          defaultValue=""
          name="parkingPosition"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            // pattern: {
            //   message: "Not a valid operator Name",
            // },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Parking position"
                style={styles.input}
                value={String(value)}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={errors.parkingPosition && true}
              />
              <HelperText type="error">
                {errors.parkingPosition?.message}
              </HelperText>
            </>
          )}
        />
        <Controller
          control={control}
          defaultValue={0}
          name="mtow"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            // pattern: {
            //   message: "Not a valid operator Name",
            // },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="MTOW (kg)"
                style={styles.input}
                value={String(value)}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={errors.mtow && true}
              />
              <HelperText type="error">{errors.mtow?.message}</HelperText>
            </>
          )}
        />
        <View style={styles.row}>
          <Text variant="headlineSmall">Arrival</Text>
        </View>
        <Controller
          control={control}
          defaultValue=""
          name="arrival.from"
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
                error={errors?.arrival?.from && true}
              />
              <HelperText type="error">
                {errors.arrival?.from?.message}
              </HelperText>
            </>
          )}
        />
        <Controller
          control={control}
          defaultValue={dayjs().toDate()}
          name="arrival.arrivalDate"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <DatePickerInput
                locale="en-GB"
                label="Arrival date"
                value={value}
                onChange={(d) => {
                  alert(d);
                  onChange(d);
                }}
                inputMode="start"
                style={{ width: 200 }}
                mode="outlined"
              />
              <HelperText type="error">
                {errors.arrival?.arrivalDate?.message}
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
          name="arrival.arrivalTime"
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
                {errors.arrival?.arrivalTime?.message}
              </HelperText>
            </>
          )}
        />
        <Controller
          control={control}
          defaultValue={0}
          name="arrival.adultCount"
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
                value={String(value)}
                onBlur={onBlur}
                keyboardType="numeric"
                onChangeText={(text) => onChange(text)}
                error={errors.arrival?.adultCount && true}
              />
              <HelperText type="error">
                {errors.arrival?.adultCount?.message}
              </HelperText>
            </>
          )}
        />
        <Controller
          control={control}
          defaultValue={0}
          name="arrival.minorCount"
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
                label="Minor passenger count"
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
        <Text variant="bodyLarge">
          Total passengers:
          {Number(getValues("arrival.adultCount")) +
            Number(getValues("arrival.minorCount"))}
        </Text>
        <View style={styles.row}>
          <Text variant="headlineSmall">Ramp</Text>
        </View>
        <Controller
          control={control}
          defaultValue={""}
          name="arrival.rampInspectionBeforeArrival.agent.fullname"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            pattern: {
              message: "The name inserted is not in the correct format",
              value: REGEX.name,
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Ramp agent name"
                style={styles.input}
                value={String(value)}
                onBlur={onBlur}
                keyboardType="default"
                onChangeText={(text) => onChange(text)}
                error={
                  errors.arrival?.rampInspectionBeforeArrival?.agent
                    ?.fullname && true
                }
              />
              <HelperText type="error">
                {
                  errors.arrival?.rampInspectionBeforeArrival?.agent?.fullname
                    ?.message
                }
              </HelperText>
            </>
          )}
        />
        <View style={styles.row}>
          <Text variant="bodyLarge">Found FOD before arrival</Text>
          <Controller
            control={control}
            defaultValue={false}
            name="arrival.rampInspectionBeforeArrival.FOD"
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
            name="arrival.rampInspectionBeforeArrival.status"
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
          Submit arrival information
        </Button>
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
