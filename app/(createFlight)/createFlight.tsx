import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { TextInput, Button, Switch, HelperText } from "react-native-paper";

import { useForm, Controller } from "react-hook-form";

type FormData = {
  name: string;
  surname: string;
  email: string;
  password: string;
  termsAccepted: boolean;
};

const PASSWORD_MIN_LENGTH = 6;

const REGEX = {
  personalName: /^[a-z ,.'-]+$/i,
  email:
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
};

const ERROR_MESSAGES = {
  REQUIRED: "This Field Is Required",
  NAME_INVALID: "Not a Valid Name",
  TERMS: "Terms Must Be Accepted To Continue",
  EMAIL_INVALID: "Not a Valid Email",
};

const Form: React.FC = () => {
  const { control, formState, handleSubmit } = useForm<FormData>({
    mode: "onChange",
  });

  const { errors } = formState;

  const submit = (data: any) => console.log(data);

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        defaultValue=""
        name="name"
        rules={{
          required: { value: true, message: ERROR_MESSAGES.REQUIRED },
          pattern: { message: "Not a Valid Name", value: REGEX.personalName },
        }}
        render={({ field: { onBlur, onChange, value } }) => (
          <>
            <TextInput
              label="Name"
              style={styles.input}
              value={value}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
              error={errors.name && true}
            />
            <HelperText type="error">{errors.name?.message}</HelperText>
          </>
        )}
      />
      <Controller
        control={control}
        name="surname"
        defaultValue=""
        rules={{
          required: { value: true, message: ERROR_MESSAGES.REQUIRED },
          pattern: { message: "Not a Valid Name", value: REGEX.personalName },
        }}
        render={({ field: { onBlur, onChange, value } }) => (
          <>
            <TextInput
              label="Last Name"
              style={styles.input}
              onBlur={onBlur}
              value={value}
              onChangeText={(value) => onChange(value)}
              error={errors.surname && true}
            />
            <HelperText type="error">{errors.surname?.message}</HelperText>
          </>
        )}
      />
      <Controller
        control={control}
        name="email"
        defaultValue=""
        rules={{
          required: { message: ERROR_MESSAGES.REQUIRED, value: true },
          pattern: {
            value: REGEX.email,
            message: ERROR_MESSAGES.EMAIL_INVALID,
          },
        }}
        render={({ field: { onBlur, onChange, value } }) => (
          <>
            <TextInput
              value={value}
              label="Email"
              style={styles.input}
              onBlur={onBlur}
              textContentType="emailAddress"
              autoCapitalize="none"
              onChangeText={(value) => onChange(value)}
              error={errors.email && true}
            />
            <HelperText type="error">{errors.email?.message}</HelperText>
          </>
        )}
      />
      <Controller
        control={control}
        name="password"
        defaultValue=""
        rules={{
          required: { message: ERROR_MESSAGES.REQUIRED, value: true },
          minLength: {
            value: PASSWORD_MIN_LENGTH,
            message: "Password must have at least 6 characters",
          },
        }}
        render={({ field: { onBlur, onChange, value } }) => (
          <>
            <TextInput
              value={value}
              label="Password"
              style={styles.input}
              onBlur={onBlur}
              secureTextEntry
              textContentType="password"
              onChangeText={(value) => onChange(value)}
              error={errors.password && true}
            />
          </>
        )}
      />
      <HelperText type="error">{errors.password?.message}</HelperText>
      <View style={styles.row}>
        <Text>Terms Accept</Text>
        <Controller
          control={control}
          defaultValue={false}
          name="termsAccepted"
          rules={{ required: { value: true, message: ERROR_MESSAGES.TERMS } }}
          render={({ field: { value, onChange } }) => (
            <>
              <Switch
                value={value}
                onValueChange={(value) => onChange(value)}
              />
            </>
          )}
        />
      </View>
      <HelperText type="error">{errors.termsAccepted?.message}</HelperText>
      <Button
        mode="contained"
        onPress={handleSubmit(submit)}
        disabled={!formState.isValid}
      >
        Submit
      </Button>
    </View>
  );
};

export default Form;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", marginHorizontal: 30 },
  input: { marginVertical: 5 },
  row: {
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 20,
    justifyContent: "space-between",
  },
});
