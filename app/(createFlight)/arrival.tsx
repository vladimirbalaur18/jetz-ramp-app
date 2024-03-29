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
import {
  useForm,
  Controller,
  useFieldArray,
  UseFieldArrayRemove,
  Control,
  FieldErrors,
} from "react-hook-form";
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
import { createFlight, updateFlight } from "@/redux/slices/flightsSlice";
import { RootState } from "@/redux/store";
import { selectCurrentFlight } from "@/redux/slices/flightsSlice/selectors";
import CrewMemberInputFields from "@/components/FormUtils/CrewMemberInputFields";
const Form: React.FC = () => {
  const router = useRouter();
  const state = useSelector((state: RootState) => state);
  const currentFlight = selectCurrentFlight(state);

  const dispatch = useDispatch();

  const { control, formState, handleSubmit, getValues } = useForm<FormData>({
    mode: "onChange",
    defaultValues: (currentFlight as unknown as Flight) || {
      arrival: {
        arrivalTime: { hours: 10, minutes: 12 },
        arrivalDate: new Date(),
        from: "LUKK",
        adultCount: 1,
        minorCount: 2,
        rampInspectionBeforeArrival: {
          status: true,
          FOD: true,
          agent: { fullname: "Costea" },
        },
      },
    },
  });

  const { errors } = formState;

  const submit = (data: Flight) => {
    if (currentFlight) dispatch(updateFlight(data));
    else {
      alert("creating a flight");
      dispatch(createFlight(data));
    }

    router.navigate(
      data?.handlingType === "Arrival"
        ? "/(createFlight)/providedServices"
        : "/(createFlight)/departure"
    );
  };
  const [arrivalTimerVisible, setArrivalTimerVisible] = React.useState(false);

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="always"
        alwaysBounceVertical={false}
      >
        <View style={styles.row}>
          <Text variant="headlineSmall">Arrival {currentFlight?.flightId}</Text>
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
                  label="Arrival time:"
                  editable={false}
                  style={{ ...styles.input, flex: 3 }}
                  value={`${
                    value.hours < 10 ? "0" + value.hours : value.hours
                  }:${
                    value.minutes < 10 ? "0" + value.minutes : value.minutes
                  }`}
                />
                <Button
                  onPress={() => setArrivalTimerVisible(true)}
                  uppercase={false}
                  mode="outlined"
                  icon={"clock"}
                >
                  Select
                </Button>
                <TimePickerModal
                  locale="en-GB"
                  label="Select arrival time"
                  visible={arrivalTimerVisible}
                  onDismiss={() => setArrivalTimerVisible(false)}
                  onConfirm={(value) => {
                    setArrivalTimerVisible(false);
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
          {Number(getValues("arrival.adultCount") || 0) +
            Number(getValues("arrival.minorCount") || 0)}
        </Text>
        <View style={styles.row}>
          <Text variant="bodyLarge">Is commercial flight</Text>
          <Controller
            control={control}
            defaultValue={false}
            name="isCommercialFlight"
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
          <Text variant="headlineSmall">Arrival ramp agent</Text>
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
          {currentFlight
            ? "Save arrival information"
            : "Submit arrival information"}
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
