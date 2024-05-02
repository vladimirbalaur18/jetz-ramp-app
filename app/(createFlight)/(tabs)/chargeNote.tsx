import * as React from "react";
import {
  View,
  StyleSheet,
  Platform,
  Text,
  Linking,
  ScrollView,
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import chargeNoteTemplateHTML from "@/utils/chargeNoteTemplate";
import { useSelector } from "react-redux";
import { selectCurrentFlight } from "@/redux/slices/flightsSlice/selectors";
import { RootState, useAppDispatch } from "@/redux/store";
import formStyles from "@/styles/formStyles";
import SectionTitle from "@/components/FormUtils/SectionTitle";
import { Controller, useForm } from "react-hook-form";
import { IFlight } from "@/redux/types";
import { HelperText, TextInput, Button } from "react-native-paper";
import ERROR_MESSAGES from "@/utils/formErrorMessages";
import { updateFlight } from "@/redux/slices/flightsSlice";
import printToFile from "@/utils/printToFile";
type FormData = IFlight;

export default function App() {
  const state = useSelector((state: RootState) => state);
  const existingFlight = selectCurrentFlight(state);
  const dispatch = useAppDispatch();
  const submit = (data: any) => {
    // alert(JSON.stringify(data));
    //nullyfy services if we update new data
    dispatch(updateFlight({ ...existingFlight, ...data }));
    const pdfName = `${existingFlight?.flightNumber}_${existingFlight.aircraftRegistration}`;
    printToFile({
      html: chargeNoteTemplateHTML({ ...existingFlight, ...data }),
      fileName: pdfName,
    });
  };

  const { control, formState, handleSubmit, getValues } = useForm<FormData>({
    mode: "onChange",
    defaultValues: { ...existingFlight },
  });

  const { errors } = formState;

  return (
    <ScrollView contentContainerStyle={{ ...styles.container }}>
      <SectionTitle>Charge note details</SectionTitle>
      <Controller
        control={control}
        defaultValue=""
        name="chargeNote.paymentType"
        rules={{
          required: { value: true, message: ERROR_MESSAGES.REQUIRED },
        }}
        render={({ field: { onBlur, onChange, value } }) => (
          <>
            <TextInput
              label="Payment type:"
              style={formStyles.input}
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
        defaultValue=""
        name="chargeNote.billingTo"
        rules={{
          required: { value: true, message: ERROR_MESSAGES.REQUIRED },
        }}
        render={({ field: { onBlur, onChange, value } }) => (
          <>
            <TextInput
              label="Billing to:"
              style={{ ...formStyles.input }}
              value={value}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              error={errors?.chargeNote?.billingTo && true}
              multiline={true}
              maxLength={250}
              numberOfLines={5} // Optional: Set the number of lines to display
            />
            <HelperText type="error">
              {errors?.chargeNote?.billingTo?.message}
            </HelperText>
          </>
        )}
      />
      <Controller
        control={control}
        defaultValue=""
        name="chargeNote.remarks"
        render={({ field: { onBlur, onChange, value } }) => (
          <>
            <TextInput
              label="Remarks:"
              style={formStyles.input}
              value={value}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              error={errors?.chargeNote?.remarks && true}
              maxLength={100}
            />
            <HelperText type="error">
              {errors?.chargeNote?.remarks?.message}
            </HelperText>
          </>
        )}
      />
      <Button
        mode="contained"
        disabled={!formState.isValid}
        onPress={handleSubmit(submit)}
      >
        Generate charge note
      </Button>

      {/* {Platform.OS === "ios" && (<>
          
          <View>
            <View style={styles.spacer} />
            <Button title="Select printer" onPress={selectPrinter} />
            <View style={styles.spacer} />
            {selectedPrinter ? (
              <Text
                style={styles.printer}
              >{`Selected printer: ${selectedPrinter.name}`}</Text>
            ) : undefined}
          </>
        )} */}
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
  spacer: {
    height: 8,
  },
  printer: {
    textAlign: "center",
  },
});
