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
import { Flight } from "@/redux/types";
import { useForm, Controller } from "react-hook-form";
import { FlightSchedule } from "@/redux/types";
import { DatePickerInput, TimePickerModal } from "react-native-paper-dates";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import REGEX from "@/utils/regexp";
import { updateFlight } from "@/redux/slices/flightsSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { selectCurrentFlight } from "@/redux/slices/flightsSlice/selectors";
type FormData = Flight;

const ERROR_MESSAGES = {
  REQUIRED: "This Field Is Required",
  NAME_INVALID: "Not a Valid Name",
  TERMS: "Terms Must Be Accepted To Continue",
  EMAIL_INVALID: "Not a Valid Email",
};

const Form: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const state = useSelector((state: RootState) => state);
  const currentFlight = selectCurrentFlight(state);
  // alert(JSON.stringLUKify(currentFlight));

  const { control, formState, handleSubmit, getValues } = useForm<FormData>({
    mode: "onChange",
    defaultValues: (currentFlight as Flight) || {
      aircraftRegistration: "LY-TBA",
      aircraftType: "SR22",
      departure: {
        departureTime: { hours: 10, minutes: 12 },
        departureDate: new Date(),
        to: "LUKK",
        adultCount: 1,
        minorCount: 2,
        rampInspectionBeforeDeparture: {
          status: true,
          FOD: true,
          agent: {
            fullname: "Costea Andrei",
          },
        },
      },

      flightNumber: "TY123",
      operatorName: "Mama",
      orderingCompanyName: "Mama",
      scheduleType: FlightSchedule.NonScheduled,
    },
  });
  const { errors } = formState;

  const submit = (data: any) => {
    if (currentFlight) dispatch(updateFlight(data));

    router.navigate("/(createFlight)/providedServices");
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

        <View style={styles.row}>
          <Text variant="headlineSmall">Departure</Text>
        </View>
        <Controller
          control={control}
          defaultValue=""
          name="departure.to"
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
                label="To: (ICAO):"
                style={styles.input}
                value={value}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={errors?.departure?.to && true}
              />
              <HelperText type="error">
                {errors.departure?.to?.message}
              </HelperText>
            </>
          )}
        />
        <Controller
          control={control}
          defaultValue={dayjs().toDate()}
          name="departure.departureDate"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <DatePickerInput
                locale="en-GB"
                label="departure date"
                value={value}
                onChange={(d) => onChange(dayjs(d))}
                inputMode="start"
                style={{ width: 200 }}
                mode="outlined"
                validRange={{
                  startDate: currentFlight?.arrival?.arrivalDate,
                }}
              />
              <HelperText type="error">
                {errors.departure?.departureDate?.message}
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
          name="departure.departureTime"
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
                  Select departure time
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
                {errors.departure?.departureTime?.message}
              </HelperText>
            </>
          )}
        />
        <Controller
          control={control}
          defaultValue={0}
          name="departure.adultCount"
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
                error={errors.departure?.adultCount && true}
              />
              <HelperText type="error">
                {errors.departure?.adultCount?.message}
              </HelperText>
            </>
          )}
        />
        <Controller
          control={control}
          defaultValue={0}
          name="departure.minorCount"
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
                error={errors.departure?.minorCount && true}
              />
              <HelperText type="error">
                {errors.departure?.minorCount?.message}
              </HelperText>
            </>
          )}
        />
        <Text variant="bodyLarge">
          Total passengers:
          {Number(getValues("departure.adultCount")) +
            Number(getValues("departure.minorCount"))}
        </Text>
        <View style={styles.row}>
          <Text variant="headlineSmall">Ramp</Text>
        </View>
        <Controller
          control={control}
          defaultValue={""}
          name="departure.rampInspectionBeforeDeparture.agent.fullname"
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
                  errors.departure?.rampInspectionBeforeDeparture?.agent
                    ?.fullname && true
                }
              />
              <HelperText type="error">
                {
                  errors.departure?.rampInspectionBeforeDeparture?.agent
                    ?.fullname?.message
                }
              </HelperText>
            </>
          )}
        />
        <View style={styles.row}>
          <Text variant="bodyLarge">Found FOD before departure</Text>
          <Controller
            control={control}
            defaultValue={false}
            name="departure.rampInspectionBeforeDeparture.FOD"
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
            name="departure.rampInspectionBeforeDeparture.status"
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
            {errors.beforedepartureInspection?.message}
          </HelperText> */}
        </View>
        <Button
          mode="contained"
          onPress={handleSubmit(submit)}
          disabled={!formState.isValid}
        >
          Submit departure information
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
