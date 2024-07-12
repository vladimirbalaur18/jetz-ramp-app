import {
  Alert,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import React from "react";
import formStyles from "@/styles/formStyles";

import { Button, Text, TextInput, HelperText } from "react-native-paper";
import { useRouter } from "expo-router";
import Svg, { G, Path } from "react-native-svg";
import { Controller, useForm } from "react-hook-form";
import ERROR_MESSAGES from "@/utils/formErrorMessages";
import REGEX from "@/utils/regexp";
import { useRealm } from "@realm/react";
import { IAppData } from "@/models/AppData";
import { JetzSvg } from "@/components/JetzSVG";
import { useTheme } from "@react-navigation/native";

type FormData = {
  password: string;
  confirmPassword: string;
};
const Page = () => {
  const router = useRouter();
  const realm = useRealm();
  const { control, formState, handleSubmit, getValues, watch, setError } =
    useForm<FormData>({
      mode: "onBlur",
    });
  const { errors } = formState;
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const iconColor = useTheme().colors.text;
  const submit = (data: FormData) => {
    try {
      realm.write(() => {
        realm.create<IAppData>("AppData", {
          masterPassword: data.password,
          schemaCreationDate: new Date(),
        });
      });
      router.navigate("/(drawer)/config");
    } catch (e) {
      Alert.alert("Error saving master password", JSON.stringify(e, null, 5));
    }
  };
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
          <View style={{ marginBottom: 50, marginTop: 50 }}>
            <Text
              style={{ marginBottom: 10, alignSelf: "center" }}
              variant="displayLarge"
            >
              Welcome to
            </Text>
            <View style={{ alignSelf: "center" }}>
              <JetzSvg color={iconColor} />
            </View>
          </View>
          <View style={{ alignSelf: "center" }}>
            <Text variant="bodyLarge">
              Since is the first run of the app, please create a master
              password.
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
            <Controller
              control={control}
              defaultValue={""}
              name="confirmPassword"
              rules={{
                required: { value: true, message: ERROR_MESSAGES.REQUIRED },
                validate: (value) =>
                  value === password || "Passwords do not match",
              }}
              render={({ field: { onBlur, onChange, value } }) => (
                <>
                  <TextInput
                    label="Confirm master password"
                    style={{ ...formStyles.input, width: "100%" }}
                    value={String(value)}
                    inputMode="numeric"
                    onBlur={onBlur}
                    onChangeText={(value) => {
                      onChange(value);
                      if (value !== password) {
                      }
                    }}
                    error={errors?.confirmPassword && true}
                  />
                  <HelperText type="error">
                    {errors?.confirmPassword?.message}
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

export default Page;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    marginHorizontal: 30,
    paddingVertical: 30,
    height: "100%",
  },
});
