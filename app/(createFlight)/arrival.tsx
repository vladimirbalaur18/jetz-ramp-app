import { IArrival } from "@/models/DepartureArrival";
import { IFlight } from "@/models/Flight";
import { IProvidedServices } from "@/models/ProvidedServices";
import { IRampAgent } from "@/models/RampAgentName";
import { IRampInspection } from "@/models/RampInspection";
import { ITime } from "@/models/Time";
import {
  createFlight,
  setCurrentFlightById,
  updateFlight,
} from "@/redux/slices/flightsSlice";
import { selectCurrentFlight } from "@/redux/slices/flightsSlice/selectors";
import { RootState } from "@/redux/store";
import REGEX from "@/utils/regexp";
import _selectCurrentFlight from "@/utils/selectCurrentFlight";
import { useRealm } from "@realm/react";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import _ from "lodash";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  HelperText,
  Switch,
  Text,
  TextInput,
} from "react-native-paper";
import { DatePickerInput, TimePickerModal } from "react-native-paper-dates";
import { useDispatch, useSelector } from "react-redux";
type FormData = IFlight;
const ERROR_MESSAGES = {
  REQUIRED: "This Field Is Required",
  NAME_INVALID: "Not a Valid Name",
  TERMS: "Terms Must Be Accepted To Continue",
  EMAIL_INVALID: "Not a Valid Email",
};
const Form: React.FC = () => {
  const router = useRouter();
  const currentFlightId = useSelector(
    (state: RootState) => state.flights.currentFlightId
  );
  const realm = useRealm();
  const _existingFlight = _selectCurrentFlight(currentFlightId || ""); // alert(JSON.stringLUKify(currentFlight));

  const dispatch = useDispatch();

  const { control, formState, handleSubmit, getValues, watch } =
    useForm<FormData>({
      mode: "onChange",
      defaultValues: { ..._existingFlight?.toJSON() },
    });

  const adultPassengersCount = watch("arrival.adultCount");
  const minorPassengersCount = watch("arrival.minorCount");

  const { errors } = formState;

  const submit = (data: IFlight) => {
    console.log("yeah", JSON.stringify(data, null, 4));
    // //nullyfy services if we update new data
    // if (_existingFlight) {
    //   if (!_.isEqual(_existingFlight, data)) {
    //     dispatch(
    //       updateFlight({
    //         ...data,
    //         providedServices: null as unknown as IProvidedServices,
    //       })
    //     );
    //   } else dispatch(updateFlight(data));
    // } else {
    //   alert("creating a flight");
    //   dispatch(createFlight(data));
    // }

    realm.write(() => {
      const arrivalTime = realm.create<ITime>("Time", {
        hours: Number(data.arrival.arrivalTime.hours),
        minutes: Number(data.arrival.arrivalTime.minutes),
      });
      const rampAgent = realm.create<IRampAgent>("RampAgent", {
        fullname: data.arrival.rampInspectionBeforeArrival.agent.fullname,
      });
      const rampInspection = realm.create<IRampInspection>("RampInspection", {
        FOD: !!data.arrival.rampInspectionBeforeArrival.FOD,
        agent: rampAgent,
        status: data.arrival.rampInspectionBeforeArrival.status,
      });
      const arrival = realm.create<IArrival>("Arrival", {
        adultCount: Number(data.arrival.adultCount),
        arrivalDate: dayjs(data.arrival.arrivalDate).toDate(),
        arrivalTime: arrivalTime,
        isLocalFlight: data.arrival.isLocalFlight,
        minorCount: Number(data.arrival.minorCount),
        rampInspectionBeforeArrival: rampInspection,
        from: data.arrival.from,
      });

      if (_existingFlight) {
        if (_.isEqual(_existingFlight.toJSON(), data)) {
          console.log("arrival data", data);
          _existingFlight.arrival = arrival;
        } else {
          console.log(
            "Nullyfying services because arrival date differs frmo previous arrival data",
            "BEFORE",
            JSON.stringify(_existingFlight.arrival, null, 3),
            "AFTER",
            JSON.stringify(arrival, null, 3)
          );
          _existingFlight.providedServices &&
            realm.delete(_existingFlight.providedServices);
          _existingFlight.arrival = arrival;
        }
      } else return arrival;
    });
    dispatch(
      setCurrentFlightById(_existingFlight?.toJSON().flightId as string)
    );

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
        alwaysBounceVertical={false}
      >
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
        <View style={styles.row}>
          <Text variant="bodyLarge">Is local (MD only) leg?</Text>
          <Controller
            control={control}
            defaultValue={false}
            name="arrival.isLocalFlight"
            render={({ field: { value, onChange } }) => (
              <>
                <Switch
                  value={value || false}
                  onValueChange={(value) => onChange(value)}
                />
              </>
            )}
          />
        </View>
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
                  value={
                    value?.hours && value?.minutes
                      ? `${
                          value?.hours < 10 ? "0" + value?.hours : value?.hours
                        }:${
                          value?.minutes < 10
                            ? "0" + value?.minutes
                            : value?.minutes
                        }`
                      : undefined
                  }
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
                value={value ? String(value) : undefined}
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
                value={value ? String(value) : undefined}
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
          {Number(adultPassengersCount) + Number(minorPassengersCount)}
        </Text>
        <View style={styles.row}>
          <Text variant="headlineSmall">Arrival ramp agent</Text>
        </View>
        <Controller
          control={control}
          defaultValue={""}
          name="arrival.rampInspectionBeforeArrival.agent.fullname"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Ramp agent name"
                style={styles.input}
                value={value ? String(value) : ""}
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
                  value={value || false}
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
                  value={value || false}
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
          {_existingFlight
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
