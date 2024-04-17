import SectionTitle from "@/components/FormUtils/SectionTitle";
import { selectCurrentFlight } from "@/redux/slices/flightsSlice/selectors";
import { RootState } from "@/redux/store";
import { Flight } from "@/redux/types";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { TextInput, HelperText, Button } from "react-native-paper";
import REGEX from "@/utils/regexp";
import ERROR_MESSAGES from "@/utils/formErrorMessages";
import { StyleSheet } from "react-native";
import { updateFlight } from "@/redux/slices/flightsSlice";
import printToFile from "@/utils/printToFile";
import ArrDepTemplateRenderHTML from "@/utils/arrDepTemplate";
export default function Page() {
  const router = useRouter();
  const dispatch = useDispatch();
  const submit = (data: any) => {
    dispatch(
      updateFlight({
        ...existingFlight,
        ...data,
      })
    );
  };

  const state = useSelector((state: RootState) => state);
  const existingFlight = selectCurrentFlight(state);
  const { control, formState, handleSubmit, getValues } = useForm<Flight>({
    mode: "onChange",
    defaultValues: { ...existingFlight },
  });

  const submitArrDeparture = (data: any) => {
    submit(data);
    printToFile({
      html: ArrDepTemplateRenderHTML(existingFlight),
      fileName: `ArrDep_Information_${existingFlight?.flightNumber}_${existingFlight?.aircraftRegistration}`,
      width: 800,
      height: 595,
    });
  };

  const submitArrival = (data: any) => {
    submit(data);
    // printToFile(
    //   "<h1>Arrival</h1>",
    //   `Arrival_Information_${existingFlight?.flightNumber}_${existingFlight?.aircraftRegistration}`
    // );
  };
  const { errors } = formState;
  return (
    <ScrollView contentContainerStyle={styles.container}>
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
              onChangeText={(text) => onChange(text)}
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
              onChangeText={(text) => onChange(text)}
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
      <Button
        mode="contained"
        onPress={handleSubmit(submitArrDeparture)}
        disabled={!formState.isValid}
      >
        Generate Arr/Dep information
      </Button>
    </ScrollView>
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
