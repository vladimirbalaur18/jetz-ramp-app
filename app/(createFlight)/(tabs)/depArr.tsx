import SectionTitle from "@/components/FormUtils/SectionTitle";
import { Departure, IArrival, IDeparture } from "@/models/DepartureArrival";
import { HandlingTypes, IFlight } from "@/models/Flight";
import { updateFlight } from "@/redux/slices/flightsSlice";
import { selectCurrentFlight } from "@/redux/slices/flightsSlice/selectors";
import { RootState } from "@/redux/store";
import ArrDepTemplateRenderHTML from "@/utils/arrDepTemplate";
import ERROR_MESSAGES from "@/utils/formErrorMessages";
import { onlyIntNumber } from "@/utils/numericInputFormatter";
import printToFile from "@/utils/printToFile";
import REGEX from "@/utils/regexp";
import _selectCurrentFlight from "@/utils/selectCurrentFlight";
import { useRealm } from "@realm/react";
import {
  router,
  Tabs,
  useGlobalSearchParams,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, ScrollView, StyleSheet } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
export default function Page() {
  const [loading, setIsLoading] = useState(false);

  const realm = useRealm();

  const currentFlightId = useSelector(
    (state: RootState) => state?.flights.currentFlightId
  );
  const { fileType } = useGlobalSearchParams();
  const realmExistingFlight = _selectCurrentFlight(currentFlightId || "");
  const existingFlightJSON = realmExistingFlight?.toJSON() as IFlight;
  const submit = (data: Partial<IFlight>) => {
    try {
      if (realmExistingFlight)
        realm.write(() => {
          if (realmExistingFlight.handlingType != "Departure") {
            if (fileType == "Arrival" || !realmExistingFlight?.arrival?.from) {
              realmExistingFlight.arrival.crewNumber = Number(
                data.arrival?.crewNumber
              );
              realmExistingFlight.arrival.cargoInfo = data.arrival?.cargoInfo;
              realmExistingFlight.arrival.mailInfo = data.arrival?.mailInfo;
              realmExistingFlight.arrival.specialInfo =
                data.arrival?.specialInfo;
              realmExistingFlight.arrival.remarksInfo =
                data.arrival?.remarksInfo;
              return;
            } else {
              realmExistingFlight.arrival.crewNumber = Number(
                data.arrival?.crewNumber
              );
              realmExistingFlight.arrival.cargoInfo = data.arrival?.cargoInfo;
              realmExistingFlight.arrival.mailInfo = data.arrival?.mailInfo;
              realmExistingFlight.arrival.specialInfo =
                data.arrival?.specialInfo;
              realmExistingFlight.arrival.remarksInfo =
                data.arrival?.remarksInfo;
            }
          }

          if (realmExistingFlight.handlingType != "Arrival") {
            if (
              fileType == "Departure" ||
              !realmExistingFlight?.departure?.to
            ) {
              realmExistingFlight.departure.crewNumber = Number(
                data.departure?.crewNumber
              );
              realmExistingFlight.departure.cargoInfo =
                data.departure?.cargoInfo;
              realmExistingFlight.departure.mailInfo = data.departure?.mailInfo;
              realmExistingFlight.departure.specialInfo =
                data.departure?.specialInfo;
              realmExistingFlight.departure.remarksInfo =
                data.departure?.remarksInfo;
              return;
            } else {
              realmExistingFlight.departure.crewNumber = Number(
                data.departure?.crewNumber
              );
              realmExistingFlight.departure.cargoInfo =
                data.departure?.cargoInfo;
              realmExistingFlight.departure.mailInfo = data.departure?.mailInfo;
              realmExistingFlight.departure.specialInfo =
                data.departure?.specialInfo;
              realmExistingFlight.departure.remarksInfo =
                data.departure?.remarksInfo;
            }
          }
        });
    } catch (e) {
      Alert.alert("Error saving data to DepArr", JSON.stringify(e, null, 5));
    }
  };
  const { control, formState, handleSubmit, getValues } = useForm<IFlight>({
    mode: "onBlur",
    defaultValues: {
      arrival: {
        ...existingFlightJSON.arrival,
        crewNumber: existingFlightJSON?.arrival?.crewNumber ?? 1,
        cargoInfo: existingFlightJSON?.arrival?.cargoInfo ?? "NIL",
        mailInfo: existingFlightJSON?.arrival?.mailInfo ?? "NIL",
        specialInfo: existingFlightJSON?.arrival?.specialInfo ?? "NIL",
        remarksInfo: existingFlightJSON?.arrival?.remarksInfo ?? "NIL",
      },
      departure: {
        ...existingFlightJSON.departure,
        crewNumber: existingFlightJSON?.departure?.crewNumber ?? 1,
        cargoInfo: existingFlightJSON?.departure?.cargoInfo ?? "NIL",
        mailInfo: existingFlightJSON?.departure?.mailInfo ?? "NIL",
        specialInfo: existingFlightJSON?.departure?.specialInfo ?? "NIL",
        remarksInfo: existingFlightJSON?.departure?.remarksInfo ?? "NIL",
      },
    },
  });

  const submitArrDeparture = (data: Partial<IFlight>) => {
    setIsLoading(true);

    submit(data);
    printToFile({
      html: ArrDepTemplateRenderHTML(
        { ...existingFlightJSON, ...data },
        fileType || (existingFlightJSON?.handlingType as string)
      ),
      fileName: `${
        existingFlightJSON?.handlingType === "Arrival" || fileType === "Arrival"
          ? "Arr"
          : existingFlightJSON?.handlingType === "Departure" ||
            fileType === "Departure"
          ? "Dep"
          : "ArrDep"
      }_Information_${existingFlightJSON?.flightNumber}_${
        existingFlightJSON?.aircraftRegistration
      }`,
      width:
        existingFlightJSON?.handlingType === "FULL" &&
        !["Arrival", "Departure"].includes(fileType as string)
          ? 800
          : 400,
      height: 596,
    }).finally(() => setIsLoading(false));
  };

  const { errors } = formState;
  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        {(existingFlightJSON?.handlingType == "Arrival" ||
          (existingFlightJSON?.handlingType == ("FULL" as any) &&
            fileType != "Departure")) && (
          <>
            <SectionTitle>Arrival payload</SectionTitle>
            <Controller
              control={control}
              defaultValue={0}
              name="arrival.crewNumber"
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
                    label="Crew members count"
                    style={styles.input}
                    value={String(value)}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    onChangeText={(value) => onChange(onlyIntNumber(value))}
                    error={errors.arrival?.crewNumber && true}
                  />
                  <HelperText type="error">
                    {errors.arrival?.crewNumber?.message}
                  </HelperText>
                </>
              )}
            />
            <Controller
              control={control}
              defaultValue="NIL"
              name="arrival.cargoInfo"
              rules={{
                required: { value: true, message: ERROR_MESSAGES.REQUIRED },
                maxLength: 100,
              }}
              render={({ field: { onBlur, onChange, value } }) => (
                <>
                  <TextInput
                    label="Cargo information:"
                    style={styles.input}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    error={errors?.arrival?.cargoInfo && true}
                  />
                  <HelperText type="error">
                    {errors.arrival?.cargoInfo?.message}
                  </HelperText>
                </>
              )}
            />
            <Controller
              control={control}
              defaultValue="NIL"
              name="arrival.mailInfo"
              rules={{
                required: { value: true, message: ERROR_MESSAGES.REQUIRED },
                maxLength: 100,
              }}
              render={({ field: { onBlur, onChange, value } }) => (
                <>
                  <TextInput
                    label="Mail information:"
                    style={styles.input}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    error={errors?.arrival?.mailInfo && true}
                  />
                  <HelperText type="error">
                    {errors.arrival?.mailInfo?.message}
                  </HelperText>
                </>
              )}
            />
            <Controller
              control={control}
              defaultValue="NIL"
              name="arrival.specialInfo"
              rules={{
                required: { value: true, message: ERROR_MESSAGES.REQUIRED },
                maxLength: 100,
              }}
              render={({ field: { onBlur, onChange, value } }) => (
                <>
                  <TextInput
                    label="Special information:"
                    style={styles.input}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    error={errors?.arrival?.specialInfo && true}
                  />
                  <HelperText type="error">
                    {errors.arrival?.specialInfo?.message}
                  </HelperText>
                </>
              )}
            />
            <Controller
              control={control}
              defaultValue="NIL"
              name="arrival.remarksInfo"
              rules={{
                required: { value: true, message: ERROR_MESSAGES.REQUIRED },
                maxLength: 100,
              }}
              render={({ field: { onBlur, onChange, value } }) => (
                <>
                  <TextInput
                    label="Payload remarks:"
                    style={styles.input}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    error={errors?.arrival?.remarksInfo && true}
                  />
                  <HelperText type="error">
                    {errors.arrival?.remarksInfo?.message}
                  </HelperText>
                </>
              )}
            />
            {/* <Button
        mode="contained"
        onPress={handleSubmit(submitArrival)}
        disabled={!formState.isValid}
      >
        Generate Arrival information
      </Button> */}
          </>
        )}

        {(existingFlightJSON?.handlingType == "Departure" ||
          (existingFlightJSON?.handlingType == ("FULL" as any) &&
            fileType != "Arrival")) && (
          <>
            <SectionTitle>Departure payload</SectionTitle>
            <Controller
              control={control}
              defaultValue={0}
              name="departure.crewNumber"
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
                    label="Crew members count"
                    style={styles.input}
                    value={String(value)}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    onChangeText={(value) => onChange(onlyIntNumber(value))}
                    error={errors.departure?.crewNumber && true}
                  />
                  <HelperText type="error">
                    {errors.departure?.crewNumber?.message}
                  </HelperText>
                </>
              )}
            />
            <Controller
              control={control}
              defaultValue="NIL"
              name="departure.cargoInfo"
              rules={{
                required: { value: true, message: ERROR_MESSAGES.REQUIRED },
                maxLength: 100,
              }}
              render={({ field: { onBlur, onChange, value } }) => (
                <>
                  <TextInput
                    label="Cargo information:"
                    style={styles.input}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    error={errors?.departure?.cargoInfo && true}
                  />
                  <HelperText type="error">
                    {errors.departure?.cargoInfo?.message}
                  </HelperText>
                </>
              )}
            />
            <Controller
              control={control}
              defaultValue="NIL"
              name="departure.mailInfo"
              rules={{
                required: { value: true, message: ERROR_MESSAGES.REQUIRED },
                maxLength: 100,
              }}
              render={({ field: { onBlur, onChange, value } }) => (
                <>
                  <TextInput
                    label="Mail information:"
                    style={styles.input}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    error={errors?.departure?.mailInfo && true}
                  />
                  <HelperText type="error">
                    {errors.departure?.mailInfo?.message}
                  </HelperText>
                </>
              )}
            />
            <Controller
              control={control}
              defaultValue="NIL"
              name="departure.specialInfo"
              rules={{
                required: { value: true, message: ERROR_MESSAGES.REQUIRED },
                maxLength: 100,
              }}
              render={({ field: { onBlur, onChange, value } }) => (
                <>
                  <TextInput
                    label="Special information:"
                    style={styles.input}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    error={errors?.departure?.specialInfo && true}
                  />
                  <HelperText type="error">
                    {errors.departure?.specialInfo?.message}
                  </HelperText>
                </>
              )}
            />
            <Controller
              control={control}
              defaultValue="NIL"
              name="departure.remarksInfo"
              rules={{
                required: { value: true, message: ERROR_MESSAGES.REQUIRED },
                maxLength: 100,
              }}
              render={({ field: { onBlur, onChange, value } }) => (
                <>
                  <TextInput
                    label="Payload remarks:"
                    style={styles.input}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    error={errors?.departure?.remarksInfo && true}
                  />
                  <HelperText type="error">
                    {errors.departure?.remarksInfo?.message}
                  </HelperText>
                </>
              )}
            />
          </>
        )}
        <Button
          mode="contained"
          onPress={handleSubmit(submitArrDeparture)}
          disabled={!formState.isValid || loading}
          loading={loading}
        >
          Generate{" "}
          {existingFlightJSON?.handlingType === "Arrival"
            ? "Arrival"
            : existingFlightJSON?.handlingType === "Departure"
            ? "Departure"
            : "Arr/Dep"}{" "}
          information
        </Button>
      </ScrollView>
    </>
  );
}
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
