import { View, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import formStyles from "@/styles/formStyles";
import { Controller, useForm } from "react-hook-form";
import ERROR_MESSAGES from "@/utils/formErrorMessages";
import { useAuthContext } from "@/context/authContext";
import { router } from "expo-router";
import { JetzSvg } from "@/components/JetzSVG";
import { useTheme } from "@react-navigation/native";

type FormData = {
  password: string;
};
const Page = () => {
  const { control, formState, handleSubmit, getValues, watch, setError } =
    useForm<FormData>({
      mode: "onBlur",
    });
  const { login } = useAuthContext();
  const iconColor = useTheme().colors.text;

  const submit = (data: FormData) => {
    login(data.password)
      .then(() => {
        router.replace("/(drawer)/(confTabs)/config");
      })
      .catch(() => {
        setError("password", { message: "Invalid master password" });
      });
  };
  const { errors } = formState;
  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={styles.container}
        alwaysBounceVertical={false}
      >
        <View
          style={{
            flex: 1, // This makes the container take up the full available space
            flexDirection: "column", // Align children in a column
            justifyContent: "center", // Center children vertically
            alignItems: "center",
          }}
        >
          <View>
            <View style={{ alignSelf: "center" }}>
              <JetzSvg color={iconColor} />
            </View>
            <Text variant="headlineSmall">
              Insert master password to access configurations
            </Text>
          </View>
          <View style={{ flex: 1, width: "100%", paddingTop: 30 }}>
            <Controller
              control={control}
              defaultValue={""}
              name="password"
              rules={{
                required: { value: true, message: ERROR_MESSAGES.REQUIRED },
              }}
              render={({ field: { onBlur, onChange, value } }) => (
                <>
                  <TextInput
                    label="Insert master password:"
                    style={{ ...formStyles.input, width: "100%" }}
                    value={String(value)}
                    inputMode="numeric"
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    error={errors?.password && true}
                  />
                  <HelperText type="error">
                    {errors?.password?.message}
                  </HelperText>
                </>
              )}
            />

            <Button
              mode="contained"
              disabled={!formState.isValid}
              onPress={handleSubmit(submit)}
            >
              Continue
            </Button>
          </View>
        </View>
        {/* <Image
          source={require("@/assets/images/icon.png")}
          width={50}
          height={50}
          style={{ width: 150, height: 150, }}
        /> */}
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    marginHorizontal: 30,
    paddingVertical: 30,
    height: "100%",
  },
});

export default Page;
