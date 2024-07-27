import DrawSignatureScreen from "@/components/DrawSignatureScreen";
import SectionTitle from "@/components/FormUtils/SectionTitle";
import { JetzSvg } from "@/components/JetzSVG";
import { IFlight } from "@/models/Flight";
import { PersonNameSignature } from "@/models/PersonNameSignature";
import { RampAgent } from "@/models/RampAgentName";
import { updateFlight } from "@/redux/slices/flightsSlice";
import { selectCurrentFlight } from "@/redux/slices/flightsSlice/selectors";
import { RootState, useAppDispatch } from "@/redux/store";
import formStyles from "@/styles/formStyles";
import ERROR_MESSAGES from "@/utils/formErrorMessages";
import _selectCurrentFlight from "@/utils/selectCurrentFlight";
import { useTheme } from "@react-navigation/native";
import { useRealm } from "@realm/react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Button, HelperText, IconButton, TextInput } from "react-native-paper";
import { useSelector } from "react-redux";

const SignaturePage = () => {
  const router = useRouter();
  const realm = useRealm();
  const currentFlightId = useSelector(
    (state: RootState) => state.flights.currentFlightId
  );
  if (!currentFlightId) throw new Error("No current flight ID");

  const realmExistingFlight = _selectCurrentFlight(currentFlightId || "");
  const iconColor = useTheme().colors.text;

  const existingFlightJSON = realmExistingFlight?.toJSON() as IFlight;
  const { control, formState, handleSubmit, getValues, watch } =
    useForm<IFlight>({
      mode: "onBlur",
      defaultValues: {
        crew: existingFlightJSON.crew || { name: "", signature: "" },
        ramp: existingFlightJSON.ramp || { name: "", signature: "" },
      },
    });
  const { errors, isValid } = formState;
  const params = useLocalSearchParams();

  const submit = (data: Partial<IFlight>) => {
    try {
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

      if (params.fileType === "Arrival" || params.fileType === "Departure")
        return router.push({
          pathname: "/(createFlight)/(tabs)/depArr",
          params: {
            fileType: params.fileType,
          },
        });
      router.navigate("(tabs)/chargeNote");
    } catch (e) {
      Alert.alert(
        "Error saving signature ",
        //@ts-expect-error
        e?.message || JSON.stringify(e, null)
      );
    }
  };

  const _GenerateInvoiceButton: React.FC = () => (
    <View>
      <Button
        disabled={!isValid}
        icon={"clipboard-list"}
        onPress={handleSubmit(submit)}
      >
        Generate files
      </Button>
    </View>
  );
  return (
    <ScrollView contentContainerStyle={{ ...formStyles.container }}>
      <Stack.Screen
        options={{
          headerRight: () => <_GenerateInvoiceButton />,
          headerLeft: () => (
            <IconButton
              onLongPress={() => router.replace("/(drawer)")}
              onPress={() => router.back()}
              icon={"arrow-left"}
              style={{ marginLeft: -5 }}
            />
          ),
        }}
      />
      <View style={{ alignSelf: "center" }}>
        <JetzSvg width={110} height={100} color={iconColor} />
      </View>
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
                autoCapitalize="characters"
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
                autoCapitalize="characters"
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
