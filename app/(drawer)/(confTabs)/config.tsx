import { useSnackbar } from "@/context/snackbarContext";
import { GeneralConfigState } from "@/models/Config";
import { FuelFeesState } from "@/models/Fuelfees";
import ERROR_MESSAGES from "@/utils/formErrorMessages";
import REGEX from "@/utils/regexp";
import { useQuery, useRealm } from "@realm/react";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";

type FormData = GeneralConfigState & FuelFeesState;
const Form: React.FC = () => {
  const realm = useRealm();
  const router = useRouter();

  let [configs] = useQuery<GeneralConfigState>("General");
  let [fuelFee] = useQuery<FuelFeesState>("FuelFees");
  const { showSnackbar } = useSnackbar();
  const { control, formState, handleSubmit, getValues } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      VAT: configs?.VAT,
      defaultAirport: configs?.defaultAirport,
      priceUSDperKG: fuelFee?.priceUSDperKG,
    },
  });
  const { errors } = formState;

  const submit = (data: FormData) => {
    try {
      realm.write(() => {
        if (configs) {
          configs.VAT = Number(data.VAT);
          configs.disbursementPercentage = Number(data.disbursementPercentage);
          configs.defaultAirport = String(data.defaultAirport);
        } else {
          realm.create("General", {
            VAT: Number(data.VAT),
            disbursementPercentage: Number(data.disbursementPercentage),
            defaultAirport: String(data.defaultAirport),
          });
        }

        if (fuelFee) {
          const isPriceDifferent =
            Number(data?.priceUSDperKG) !== Number(fuelFee?.priceUSDperKG);
          fuelFee.priceUSDperKG = Number(data.priceUSDperKG);
          fuelFee.lastUpdated = isPriceDifferent
            ? new Date()
            : fuelFee.lastUpdated;
        } else {
          realm.create("FuelFees", {
            priceUSDperKG: Number(data.priceUSDperKG),
            lastUpdated: new Date(),
          });
        }
      });
      showSnackbar("General settings saved successfully");
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={styles.container}
        alwaysBounceVertical={false}
      >
        <View style={styles.row}>
          <Text variant="headlineSmall">General settings</Text>
        </View>
        <Controller
          control={control}
          defaultValue={20}
          name="VAT"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="VAT percentage:"
                style={styles.input}
                value={String(value)}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={errors?.VAT && true}
              />
              <HelperText type="error">{errors?.VAT?.message}</HelperText>
            </>
          )}
        />
        <Controller
          control={control}
          defaultValue={0}
          name="disbursementPercentage"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Disbursement percentage:"
                style={styles.input}
                value={String(value)}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={errors?.disbursementPercentage && true}
              />
              <HelperText type="error">
                {errors?.disbursementPercentage?.message}
              </HelperText>
            </>
          )}
        />
        <Controller
          control={control}
          defaultValue=""
          name="defaultAirport"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            pattern: {
              message: "Not a valid ICAO",
              value: REGEX.airfield,
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Default airfield"
                style={styles.input}
                value={value}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={errors?.defaultAirport && true}
              />
              <HelperText type="error">
                {errors.defaultAirport?.message}
              </HelperText>
            </>
          )}
        />
        <View style={styles.row}>
          <Text variant="headlineSmall">Fuel fees:</Text>
        </View>
        <Controller
          control={control}
          defaultValue={0}
          name="priceUSDperKG"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Fuel price USD per KG"
                style={styles.input}
                value={String(value)}
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={errors?.priceUSDperKG && true}
              />
              <Text variant="labelSmall">
                {fuelFee &&
                  "Last update: " +
                    dayjs(fuelFee?.lastUpdated).format(
                      "YYYY-MM-DDTHH:mm:ssZ[Z]"
                    )}
              </Text>
              <HelperText type="error">
                {errors?.priceUSDperKG?.message}
              </HelperText>
            </>
          )}
        />

        <Button
          mode="contained"
          onPress={handleSubmit(submit)}
          disabled={!formState.isValid}
        >
          Submit
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Form;

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
