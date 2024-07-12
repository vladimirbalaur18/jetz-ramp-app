import SectionTitle from "@/components/FormUtils/SectionTitle";
import { JetzSvg } from "@/components/JetzSVG";
import { IFlight } from "@/models/Flight";
import { updateFlight } from "@/redux/slices/flightsSlice";
import { selectCurrentFlight } from "@/redux/slices/flightsSlice/selectors";
import { RootState, useAppDispatch } from "@/redux/store";
import formStyles from "@/styles/formStyles";
import chargeNoteTemplateHTML from "@/utils/chargeNoteTemplate";
import ERROR_MESSAGES from "@/utils/formErrorMessages";
import printToFile from "@/utils/printToFile";
import _selectCurrentFlight from "@/utils/selectCurrentFlight";
import { useTheme } from "@react-navigation/native";
import { useRealm } from "@realm/react";
import _ from "lodash";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import { useSelector } from "react-redux";
type FormData = IFlight;

export default function App() {
  const realm = useRealm();
  const currentFlightId = useSelector(
    (state: RootState) => state.flights.currentFlightId
  );
  const realmExistingFlight = _selectCurrentFlight(currentFlightId || "");

  const existingFlightJSON = realmExistingFlight?.toJSON() as IFlight;
  const submit = (data: Partial<IFlight>) => {
    try {
      if (realmExistingFlight)
        realm.write(() => {
          realmExistingFlight.chargeNote.billingTo =
            data.chargeNote?.billingTo || "";
          realmExistingFlight.chargeNote.date = new Date();
          realmExistingFlight.chargeNote.paymentType =
            data.chargeNote?.paymentType || "";
          realmExistingFlight.chargeNote.remarks =
            data.chargeNote?.remarks || "";
        });
      const pdfName = `${existingFlightJSON?.flightNumber}_${existingFlightJSON.aircraftRegistration}`;

      printToFile({
        html: chargeNoteTemplateHTML({ ...existingFlightJSON, ...data }),
        fileName: pdfName,
        width: 485,
        height: 742,
      });
    } catch (e) {
      Alert.alert("Error saving charge note", JSON.stringify(e, null, 5));
    }
  };

  const { control, formState, handleSubmit, getValues } = useForm<FormData>({
    mode: "onBlur",
    defaultValues: { ...existingFlightJSON },
  });
  const iconColor = useTheme().colors.text;
  const isFlightNotConsistent = _.isNull(existingFlightJSON?.providedServices);

  const { errors } = formState;

  return (
    <>
      <ScrollView contentContainerStyle={{ ...styles.container }}>
        <View style={{ alignSelf: "center" }}>
          <JetzSvg width={110} height={100} color={iconColor} />
        </View>
        <SectionTitle>Charge note details:</SectionTitle>
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
          disabled={!formState.isValid || isFlightNotConsistent}
          onPress={handleSubmit(submit)}
        >
          Generate charge note
        </Button>
        {isFlightNotConsistent && (
          <HelperText type="info">
            *Please submit the service page first
          </HelperText>
        )}

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
  spacer: {
    height: 8,
  },
  printer: {
    textAlign: "center",
  },
});
