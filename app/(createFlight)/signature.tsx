import DrawSignatureScreen from "@/components/DrawSignatureScreen";
import SectionTitle from "@/components/FormUtils/SectionTitle";
import { IFlight } from "@/models/Flight";
import { PersonNameSignature } from "@/models/PersonNameSignature";
import { RampAgent } from "@/models/RampAgentName";
import { updateFlight } from "@/redux/slices/flightsSlice";
import { selectCurrentFlight } from "@/redux/slices/flightsSlice/selectors";
import { RootState, useAppDispatch } from "@/redux/store";
import formStyles from "@/styles/formStyles";
import ERROR_MESSAGES from "@/utils/formErrorMessages";
import _selectCurrentFlight from "@/utils/selectCurrentFlight";
import { useRealm } from "@realm/react";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import { useSelector } from "react-redux";

const SignaturePage = () => {
  const router = useRouter();
  const realm = useRealm();
  const state = useSelector((state: RootState) => state);
  if (!state.flights.currentFlightId) throw new Error("No current flight ID");

  const realmExistingFlight = _selectCurrentFlight(
    state.flights.currentFlightId || ""
  );
  const existingFlightJSON = realmExistingFlight?.toJSON() as IFlight;
  const { control, formState, handleSubmit, getValues, watch } =
    useForm<IFlight>({
      mode: "onChange",
      defaultValues: {
        crew: existingFlightJSON.crew || { name: "", signature: "" },
        ramp: existingFlightJSON.ramp || { name: "", signature: "" },
      },
    });
  const { errors, isValid } = formState;

  const submit = (data: Partial<IFlight>) => {
    if (realmExistingFlight)
      realm.write(() => {
        const ramp = new PersonNameSignature(realm, {
          name: data.ramp?.name,
          signature: data.ramp?.signature,
        });

        const crew = new PersonNameSignature(realm, {
          name: data.crew?.name,
          signature: data.crew?.signature,
        });

        realmExistingFlight.ramp = ramp;
        realmExistingFlight.crew = crew;
      });
    router.navigate("(tabs)/chargeNote");
  };

  const _GenerateInvoiceButton: React.FC = () => (
    <View>
      <Button
        disabled={!isValid}
        icon={"clipboard-list"}
        onPress={handleSubmit(submit)}
      >
        Generate invoice
      </Button>
    </View>
  );
  return (
    <ScrollView contentContainerStyle={{ ...formStyles.container, flex: 1 }}>
      <Stack.Screen
        options={{ headerRight: () => <_GenerateInvoiceButton /> }}
      />

      <View style={{ ...styles.signatureContainer }}>
        <SectionTitle>Ramp agent signature:</SectionTitle>
        <Controller
          control={control}
          defaultValue={""}
          name="ramp.name"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Ramp agent name"
                style={formStyles.input}
                value={String(value)}
                onBlur={onBlur}
                keyboardType="default"
                onChangeText={(text) => onChange(text)}
                error={errors.ramp?.name && true}
              />
              <HelperText type="error">{errors.ramp?.name?.message}</HelperText>
            </>
          )}
        />

        <Controller
          control={control}
          defaultValue={""}
          name="ramp.signature"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <DrawSignatureScreen
                signatureBase64={value}
                handleSignatureSave={onChange}
                handleSignatureReset={() => onChange("")}
              />

              {/* <HelperText type="error">{errors.ramp?.name?.message}</HelperText> */}
            </>
          )}
        />
      </View>
      <View style={{ ...styles.signatureContainer }}>
        <SectionTitle>Pilot in command signature:</SectionTitle>
        <Controller
          control={control}
          defaultValue={""}
          name="crew.name"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="PIC name"
                style={formStyles.input}
                value={String(value)}
                onBlur={onBlur}
                keyboardType="default"
                onChangeText={(text) => onChange(text)}
                error={errors.crew?.name && true}
              />
              <HelperText type="error">{errors.crew?.name?.message}</HelperText>
            </>
          )}
        />
        <Controller
          control={control}
          defaultValue={""}
          name="crew.signature"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <DrawSignatureScreen
                signatureBase64={String(value)}
                handleSignatureSave={onChange}
                handleSignatureReset={() => onChange("")}
              />

              {/* <HelperText type="error">{errors.ramp?.name?.message}</HelperText> */}
            </>
          )}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  signatureContainer: {
    flex: 1,
  },
});
export default SignaturePage;
