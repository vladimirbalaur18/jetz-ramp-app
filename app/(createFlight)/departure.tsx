import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import {
  TextInput,
  Button,
  Switch,
  HelperText,
  Text,
} from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { DatePickerInput, TimePickerModal } from "react-native-paper-dates";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import REGEX from "@/utils/regexp";
import { setCurrentFlightById } from "@/redux/slices/flightsSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ERROR_MESSAGES from "@/utils/formErrorMessages";
import _ from "lodash";
import { IFlight } from "@/models/Flight";
import _selectCurrentFlight from "@/utils/selectCurrentFlight";
import { useRealm } from "@realm/react";
import { IArrival, IDeparture } from "@/models/DepartureArrival";
import { ITime } from "@/models/Time";
import { IRampInspection } from "@/models/RampInspection";
import { IRampAgent } from "@/models/RampAgentName";
import { formatTime } from "@/utils/formatTime";
import { onlyIntNumber } from "@/utils/numericInputFormatter";
import { useSnackbar } from "@/context/snackbarContext";
import { errorPrint } from "@/utils/errorPrint";
type FormData = IFlight;

export { ErrorBoundary } from "expo-router";

const Form: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const currentFlightId = useSelector(
    (state: RootState) => state.flights.currentFlightId
  );
  if (!currentFlightId)
    throw new Error(
      "There was an error initiailzing currentFlightId on departure page. Reload the app."
    );
  const realm = useRealm();
  const _existingFlight = _selectCurrentFlight(currentFlightId || ""); // alert(JSON.stringLUKify(currentFlight));
  if (!_existingFlight)
    throw new Error(
      "There was an error initiailzing the existing flight frmo database on departure page. Reload the app."
    );

  const { control, formState, handleSubmit, getValues, watch } =
    useForm<FormData>({
      mode: "onBlur",
      defaultValues: _existingFlight?.toJSON()?.departure
        ? _existingFlight?.toJSON()
        : {
            ..._existingFlight?.toJSON(),
            departure: {
              isLocalFlight: false,
              departureTime: { hours: 0, minutes: 0 },
              departureDate: new Date(),
              adultCount: 0,
              minorCount: 0,
              rampInspectionBeforeDeparture: {
                status: false,
                FOD: false,
              },
            },
            arrival: {
              arrivalDate: new Date(),
              arrivalTime: { hours: 0, minutes: 0 },
            },
          },
    });
  const { errors } = formState;
  const adultPassengersCount = watch("departure.adultCount");
  const minorPassengersCount = watch("departure.minorCount");
  const snackbar = useSnackbar();
  const [departureTimerVisible, setDepartureTimerVisible] =
    React.useState(false);
  const [arrivalTimerVisible, setArrivalTimerVisible] = React.useState(false);

  const submit = (data: IFlight) => {
    try {
      realm.write(() => {
        const departureTime = realm.create<ITime>("Time", {
          hours: Number(data.departure.departureTime.hours),
          minutes: Number(data.departure.departureTime.minutes),
        });
        const rampAgent = realm.create<IRampAgent>("RampAgent", {
          fullname: data.departure.rampInspectionBeforeDeparture.agent.fullname,
        });
        const rampInspection = realm.create<IRampInspection>("RampInspection", {
          FOD: !!data.departure.rampInspectionBeforeDeparture.FOD,
          agent: rampAgent,
          status: data.departure.rampInspectionBeforeDeparture.status,
        });
        const departure = realm.create<IDeparture>("Departure", {
          adultCount: Number(data.departure.adultCount),
          departureDate: dayjs(data.departure.departureDate).toDate(),
          departureTime: departureTime,
          isLocalFlight: Boolean(data.departure.isLocalFlight),
          minorCount: Number(data.departure.minorCount),
          rampInspectionBeforeDeparture: rampInspection,
          to: data.departure.to?.toLocaleUpperCase(),
        });

        if (_existingFlight?.departure) {
          if (
            !_.isEqual(
              (_existingFlight.toJSON() as IFlight).departure.isLocalFlight,
              data.departure.isLocalFlight
            ) &&
            _existingFlight.providedServices
          ) {
            // _existingFlight.providedServices &&
            //   realm.delete(_existingFlight.providedServices);
            alert(
              "Basic handling fees were reset due to local flight param being changed"
            );
            if (_existingFlight?.providedServices)
              _existingFlight.providedServices.basicHandling = undefined;
          }

          if (
            !_.isEqual(
              (_existingFlight.toJSON() as IFlight).departure.departureDate,
              data.departure.departureDate
            ) ||
            !_.isEqual(
              (_existingFlight.toJSON() as IFlight).departure.departureTime,
              data.departure.departureTime
            ) ||
            !_.isEqual(
              (_existingFlight.toJSON() as IFlight).arrival.arrivalDate,
              data.arrival.arrivalDate
            ) ||
            (!_.isEqual(
              (_existingFlight.toJSON() as IFlight).arrival.arrivalTime,
              data.arrival.arrivalTime
            ) &&
              _existingFlight.providedServices)
          ) {
            alert(
              "Airport fees were reset due to date time changed for either arrival or departure"
            );
            if (_existingFlight.providedServices?.supportServices?.airportFee) {
              _existingFlight.providedServices.supportServices.airportFee =
                undefined;
            }
          }
        }

        if (_existingFlight) {
          _existingFlight.departure = departure;

          if (_existingFlight.handlingType === "Departure") {
            const arrival = realm.create<IArrival>("Arrival", {
              arrivalDate: data.arrival.arrivalDate,
              arrivalTime: data.arrival.arrivalTime,
            });

            _existingFlight.arrival = arrival;
          }
        }
      });
      dispatch(
        setCurrentFlightById(_existingFlight?.toJSON().flightId as string)
      );
      snackbar.showSnackbar("Departure information saved successfully");

      router.navigate("/(createFlight)/providedServices");
    } catch (e) {
      errorPrint("Error saving departure data", e);
    }
  };

  return (
    <>
      <SafeAreaView>
        <ScrollView
          contentContainerStyle={styles.container}
          alwaysBounceVertical={false}
        >
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
                  autoCapitalize="characters"
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(String(value))}
                  error={errors?.departure?.to && true}
                />
                <HelperText type="error">
                  {errors.departure?.to?.message}
                </HelperText>
              </>
            )}
          />
          <View style={styles.row}>
            <Text variant="bodyLarge">Is local (MD only) leg?</Text>
            <Controller
              control={control}
              defaultValue={false}
              name="departure.isLocalFlight"
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
          {_existingFlight?.handlingType === "Departure" && (
            <>
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
                      validRange={{
                        endDate: dayjs().toDate(),
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
                        value={value && formatTime(value)}
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
            </>
          )}
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
                    startDate: _existingFlight?.arrival?.arrivalDate,
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
              hours: dayjs().get("hours") || 0,
              minutes: dayjs().get("minutes") || 0,
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
                    label="Departure time"
                    editable={false}
                    style={{ ...styles.input, flex: 3 }}
                    value={value && formatTime(value)}
                  />
                  <Button
                    onPress={() => setDepartureTimerVisible(true)}
                    uppercase={false}
                    icon={"clock"}
                    mode="outlined"
                    style={{ flex: 1 }}
                  >
                    Select
                  </Button>
                  <TimePickerModal
                    label="Select departure time"
                    locale="en-GB"
                    visible={departureTimerVisible}
                    onDismiss={() => setDepartureTimerVisible(false)}
                    onConfirm={(value) => {
                      setDepartureTimerVisible(false);
                      onChange({
                        hours: Number(value.hours),
                        minutes: Number(value.minutes),
                      });
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
                message: "Invalid number format",
                value: REGEX.number,
              },
            }}
            render={({ field: { onBlur, onChange, value } }) => (
              <>
                <TextInput
                  label="Adult passenger count"
                  style={styles.input}
                  value={typeof value !== "undefined" ? String(value) : ""}
                  onBlur={onBlur}
                  keyboardType="numeric"
                  onChangeText={(value) => onChange(onlyIntNumber(value))}
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
            name="departure.minorCount"
            defaultValue={0}
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
                  label="Minor passenger count"
                  style={styles.input}
                  value={typeof value !== "undefined" ? String(value) : ""}
                  onBlur={onBlur}
                  keyboardType="numeric"
                  onChangeText={(value) => onChange(onlyIntNumber(value))}
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
            {Number(adultPassengersCount) + Number(minorPassengersCount)}
          </Text>
          <View style={styles.row}>
            <Text variant="headlineSmall">Departure ramp agent</Text>
          </View>
          <Controller
            control={control}
            defaultValue={""}
            name="departure.rampInspectionBeforeDeparture.agent.fullname"
            rules={{
              required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            }}
            render={({ field: { onBlur, onChange, value } }) => (
              <>
                <TextInput
                  label="Ramp agent name"
                  style={styles.input}
                  autoCapitalize="characters"
                  value={value ? String(value) : undefined}
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
              name="departure.rampInspectionBeforeDeparture.status"
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
            {errors.beforedepartureInspection?.message}
          </HelperText> */}
          </View>
          <Button
            mode="contained"
            onPress={handleSubmit(submit)}
            disabled={!formState.isValid}
          >
            {_existingFlight
              ? "Save departure information"
              : "Submit departure information"}
          </Button>
          {_existingFlight?.handlingType === "FULL" && (
            <Button
              mode="outlined"
              style={{ marginVertical: 15 }}
              onPress={() => {
                router.push({
                  pathname: _existingFlight?.crew?.signature
                    ? "/(createFlight)/(tabs)/depArr"
                    : "/(createFlight)/signature",
                  params: {
                    fileType: "Departure",
                  },
                });
              }}
              disabled={!formState.isValid || !_existingFlight?.departure?.to}
            >
              Generate Departure pdf
            </Button>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
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
