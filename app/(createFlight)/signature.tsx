import formStyles from "@/styles/formStyles";
import SectionTitle from "@/components/FormUtils/SectionTitle";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { TextInput, HelperText, Button } from "react-native-paper";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Flight } from "@/redux/types";
import ERROR_MESSAGES from "@/utils/formErrorMessages";
import DrawSignatureScreen from "@/components/DrawSignatureScreen";
import { Stack, useRouter } from "expo-router";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";

const html = `
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
  </head>
  <body style="text-align: center;">
    <h1 style="font-size: 50px; font-family: Helvetica Neue; font-weight: normal;">
      Hello Expo!
    </h1>
    <img
      src="https://d30j33t1r58ioz.cloudfront.net/static/guides/sdk.png"
      style="width: 90vw;" />
  </body>
</html>
`;
const SignaturePage = () => {
  const router = useRouter();
  const { control, formState, handleSubmit, getValues, watch } =
    useForm<Flight>({
      mode: "onChange",
    });
  const { errors, isValid } = formState;

  const submit = (data: Partial<Flight>) => {
    console.log("submitted data", data);
    router.navigate("/preview");
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
                signatureBase64={value}
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
