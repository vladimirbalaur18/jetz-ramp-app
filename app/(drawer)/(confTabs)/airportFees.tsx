import { useSnackbar } from "@/context/snackbarContext";
import { IAirportFees } from "@/models/AirportFees";
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

type FormData = IAirportFees;
const Form: React.FC = () => {
  const realm = useRealm();
  const router = useRouter();

  let [AirportFees] = useQuery<IAirportFees>("AirportFees");

  const { showSnackbar } = useSnackbar();
  const { control, formState, handleSubmit, getValues } = useForm<FormData>({
    mode: "onChange",
    defaultValues: { ...AirportFees.toJSON() },
  });
  const { errors } = formState;

  const submit = (data: FormData) => {
    try {
      realm.write(() => {
        if (AirportFees) {
          AirportFees.commercial.landingFee.perTon = Number(
            data.commercial.landingFee.perTon
          );
          AirportFees.commercial.landingFee.winterPeriodQuotaPercentage =
            Number(data.commercial.landingFee.winterPeriodQuotaPercentage);
          AirportFees.commercial.landingFee.summerPeriodQuotaPercentage =
            Number(data.commercial.landingFee.summerPeriodQuotaPercentage);

          AirportFees.commercial.takeoffFee.lightAircraft = Number(
            data.commercial.takeoffFee.lightAircraft
          );

          AirportFees.commercial.takeoffFee.perTon = Number(
            data.commercial.takeoffFee.perTon
          );
          AirportFees.commercial.takeoffFee.winterPeriodQuotaPercentage =
            Number(data.commercial.takeoffFee.winterPeriodQuotaPercentage);
          AirportFees.commercial.takeoffFee.summerPeriodQuotaPercentage =
            Number(data.commercial.takeoffFee.summerPeriodQuotaPercentage);

          AirportFees.commercial.passengerFee.perPax = Number(
            data.commercial.passengerFee.perPax
          );

          AirportFees.commercial.securityFee.perPax = Number(
            data.commercial.securityFee.perPax
          );
          AirportFees.commercial.securityFee.perTon = Number(
            data.commercial.securityFee.perTon
          );

          AirportFees.commercial.parkingDay.perTon = Number(
            data.commercial.parkingDay.perTon
          );

          AirportFees.nonCommercial.landingFee.lightAircraft = Number(
            data.nonCommercial.landingFee.lightAircraft
          );

          AirportFees.nonCommercial.landingFee.perTon = Number(
            data.nonCommercial.landingFee.perTon
          );
          AirportFees.nonCommercial.landingFee.winterPeriodQuotaPercentage =
            Number(data.nonCommercial.landingFee.winterPeriodQuotaPercentage);
          AirportFees.nonCommercial.landingFee.summerPeriodQuotaPercentage =
            Number(data.nonCommercial.landingFee.summerPeriodQuotaPercentage);

          AirportFees.nonCommercial.takeoffFee.lightAircraft = Number(
            data.nonCommercial.takeoffFee.lightAircraft
          );

          AirportFees.nonCommercial.takeoffFee.perTon = Number(
            data.nonCommercial.takeoffFee.perTon
          );
          AirportFees.nonCommercial.takeoffFee.winterPeriodQuotaPercentage =
            Number(data.nonCommercial.takeoffFee.winterPeriodQuotaPercentage);
          AirportFees.nonCommercial.takeoffFee.summerPeriodQuotaPercentage =
            Number(data.nonCommercial.takeoffFee.summerPeriodQuotaPercentage);

          AirportFees.nonCommercial.passengerFee.perPax = Number(
            data.nonCommercial.passengerFee.perPax
          );

          AirportFees.nonCommercial.securityFee.perPax = Number(
            data.nonCommercial.securityFee.perPax
          );
          AirportFees.nonCommercial.securityFee.perTon = Number(
            data.nonCommercial.securityFee.perTon
          );
          AirportFees.nonCommercial.parkingDay.perTon = Number(
            data.nonCommercial.parkingDay.perTon
          );
        }
      });
      showSnackbar("Airport fees saved successfully");
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
          <Text variant="headlineSmall">Commercial</Text>
        </View>
        <View style={styles.row}>
          <Text variant="bodyMedium">Landing fee:</Text>
        </View>
        <Controller
          control={control}
          defaultValue={0}
          name="commercial.landingFee.perTon"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            pattern: {
              value: REGEX.number,
              message: "Invalid number format",
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Price per ton:"
                style={styles.input}
                value={String(value)}
                inputMode="numeric"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={errors?.commercial?.landingFee?.perTon && true}
              />
              <HelperText type="error">
                {errors?.commercial?.landingFee?.perTon?.message}
              </HelperText>
            </>
          )}
        />

        <Controller
          control={control}
          defaultValue={0}
          name="commercial.landingFee.winterPeriodQuotaPercentage"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            pattern: {
              value: REGEX.number,
              message: "Invalid number format",
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Winter night period quota percentage:"
                style={styles.input}
                value={String(value)}
                inputMode="numeric"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={
                  errors?.commercial?.landingFee?.winterPeriodQuotaPercentage &&
                  true
                }
              />
              <HelperText type="error">
                {
                  errors?.commercial?.landingFee?.winterPeriodQuotaPercentage
                    ?.message
                }
              </HelperText>
            </>
          )}
        />
        <Controller
          control={control}
          defaultValue={0}
          name="commercial.landingFee.summerPeriodQuotaPercentage"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            pattern: {
              value: REGEX.number,
              message: "Invalid number format",
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Summer night period quota percentage:"
                style={styles.input}
                value={String(value)}
                inputMode="numeric"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={
                  errors?.commercial?.landingFee?.summerPeriodQuotaPercentage &&
                  true
                }
              />
              <HelperText type="error">
                {
                  errors?.commercial?.landingFee?.summerPeriodQuotaPercentage
                    ?.message
                }
              </HelperText>
            </>
          )}
        />
        <View style={styles.row}>
          <Text variant="bodyMedium">Take-off fee:</Text>
        </View>
        <Controller
          control={control}
          defaultValue={0}
          name="commercial.takeoffFee.perTon"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            pattern: {
              value: REGEX.number,
              message: "Invalid number format",
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Price per ton:"
                style={styles.input}
                value={String(value)}
                inputMode="numeric"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={errors?.commercial?.takeoffFee?.perTon && true}
              />
              <HelperText type="error">
                {errors?.commercial?.takeoffFee?.perTon?.message}
              </HelperText>
            </>
          )}
        />

        <Controller
          control={control}
          defaultValue={0}
          name="commercial.takeoffFee.lightAircraft"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            pattern: {
              value: REGEX.number,
              message: "Invalid number format",
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Price for light aicraft:"
                style={styles.input}
                value={String(value)}
                inputMode="numeric"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={errors?.commercial?.takeoffFee?.lightAircraft && true}
              />
              <HelperText type="error">
                {errors?.commercial?.takeoffFee?.lightAircraft?.message}
              </HelperText>
            </>
          )}
        />
        <Controller
          control={control}
          defaultValue={0}
          name="commercial.takeoffFee.winterPeriodQuotaPercentage"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            pattern: {
              value: REGEX.number,
              message: "Invalid number format",
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Winter night period quota percentage:"
                style={styles.input}
                value={String(value)}
                inputMode="numeric"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={
                  errors?.commercial?.takeoffFee?.winterPeriodQuotaPercentage &&
                  true
                }
              />
              <HelperText type="error">
                {
                  errors?.commercial?.takeoffFee?.winterPeriodQuotaPercentage
                    ?.message
                }
              </HelperText>
            </>
          )}
        />
        <Controller
          control={control}
          defaultValue={0}
          name="commercial.takeoffFee.summerPeriodQuotaPercentage"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            pattern: {
              value: REGEX.number,
              message: "Invalid number format",
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Summer night period quota percentage:"
                style={styles.input}
                value={String(value)}
                inputMode="numeric"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={
                  errors?.commercial?.takeoffFee?.summerPeriodQuotaPercentage &&
                  true
                }
              />
              <HelperText type="error">
                {
                  errors?.commercial?.takeoffFee?.summerPeriodQuotaPercentage
                    ?.message
                }
              </HelperText>
            </>
          )}
        />
        <View style={styles.row}>
          <Text variant="bodyMedium">Passenger fee:</Text>
        </View>

        <Controller
          control={control}
          defaultValue={0}
          name="commercial.passengerFee.perPax"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            pattern: {
              value: REGEX.number,
              message: "Invalid number format",
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Price per pax:"
                style={styles.input}
                value={String(value)}
                inputMode="numeric"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={errors?.commercial?.passengerFee?.perPax && true}
              />
              <HelperText type="error">
                {errors?.commercial?.passengerFee?.perPax?.message}
              </HelperText>
            </>
          )}
        />
        <View style={styles.row}>
          <Text variant="bodyMedium">Security fee:</Text>
        </View>
        <Controller
          control={control}
          defaultValue={0}
          name="commercial.securityFee.perTon"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            pattern: {
              value: REGEX.number,
              message: "Invalid number format",
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Price per ton:"
                style={styles.input}
                value={String(value)}
                inputMode="numeric"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={errors?.commercial?.securityFee?.perTon && true}
              />
              <HelperText type="error">
                {errors?.commercial?.securityFee?.perTon?.message}
              </HelperText>
            </>
          )}
        />
        <Controller
          control={control}
          defaultValue={0}
          name="commercial.securityFee.perPax"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            pattern: {
              value: REGEX.number,
              message: "Invalid number format",
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Price per pax:"
                style={styles.input}
                value={String(value)}
                inputMode="numeric"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={errors?.commercial?.securityFee?.perPax && true}
              />
              <HelperText type="error">
                {errors?.commercial?.securityFee?.perPax?.message}
              </HelperText>
            </>
          )}
        />
        <View style={styles.row}>
          <Text variant="bodyMedium">Parking fee:</Text>
        </View>
        <Controller
          control={control}
          defaultValue={0}
          name="commercial.parkingDay.perTon"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            pattern: {
              value: REGEX.number,
              message: "Invalid number format",
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Price per ton:"
                style={styles.input}
                value={String(value)}
                inputMode="numeric"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={errors?.commercial?.parkingDay?.perTon && true}
              />
              <HelperText type="error">
                {errors?.commercial?.parkingDay?.perTon?.message}
              </HelperText>
            </>
          )}
        />

        <View style={styles.row}>
          <Text variant="headlineSmall">Non-commercial fees</Text>
        </View>
        <View style={styles.row}>
          <Text variant="bodyMedium">Landing fee:</Text>
        </View>
        <Controller
          control={control}
          defaultValue={0}
          name="nonCommercial.landingFee.perTon"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            pattern: {
              value: REGEX.number,
              message: "Invalid number format",
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Price per ton:"
                style={styles.input}
                value={String(value)}
                inputMode="numeric"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={errors?.nonCommercial?.landingFee?.perTon && true}
              />
              <HelperText type="error">
                {errors?.nonCommercial?.landingFee?.perTon?.message}
              </HelperText>
            </>
          )}
        />

        <Controller
          control={control}
          defaultValue={0}
          name="nonCommercial.landingFee.lightAircraft"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            pattern: {
              value: REGEX.number,
              message: "Invalid number format",
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Price for light aicraft:"
                style={styles.input}
                value={String(value)}
                inputMode="numeric"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={errors?.nonCommercial?.landingFee?.lightAircraft && true}
              />
              <HelperText type="error">
                {errors?.nonCommercial?.landingFee?.lightAircraft?.message}
              </HelperText>
            </>
          )}
        />
        <Controller
          control={control}
          defaultValue={0}
          name="nonCommercial.landingFee.winterPeriodQuotaPercentage"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            pattern: {
              value: REGEX.number,
              message: "Invalid number format",
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Winter night period quota percentage:"
                style={styles.input}
                value={String(value)}
                inputMode="numeric"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={
                  errors?.nonCommercial?.landingFee
                    ?.winterPeriodQuotaPercentage && true
                }
              />
              <HelperText type="error">
                {
                  errors?.nonCommercial?.landingFee?.winterPeriodQuotaPercentage
                    ?.message
                }
              </HelperText>
            </>
          )}
        />
        <Controller
          control={control}
          defaultValue={0}
          name="nonCommercial.landingFee.summerPeriodQuotaPercentage"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            pattern: {
              value: REGEX.number,
              message: "Invalid number format",
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Summer night period quota percentage:"
                style={styles.input}
                value={String(value)}
                inputMode="numeric"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={
                  errors?.nonCommercial?.landingFee
                    ?.summerPeriodQuotaPercentage && true
                }
              />
              <HelperText type="error">
                {
                  errors?.nonCommercial?.landingFee?.summerPeriodQuotaPercentage
                    ?.message
                }
              </HelperText>
            </>
          )}
        />
        <View style={styles.row}>
          <Text variant="bodyMedium">Take-off fee:</Text>
        </View>
        <Controller
          control={control}
          defaultValue={0}
          name="nonCommercial.takeoffFee.perTon"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            pattern: {
              value: REGEX.number,
              message: "Invalid number format",
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Price per ton:"
                style={styles.input}
                value={String(value)}
                inputMode="numeric"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={errors?.nonCommercial?.takeoffFee?.perTon && true}
              />
              <HelperText type="error">
                {errors?.nonCommercial?.takeoffFee?.perTon?.message}
              </HelperText>
            </>
          )}
        />

        <Controller
          control={control}
          defaultValue={0}
          name="nonCommercial.takeoffFee.lightAircraft"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            pattern: {
              value: REGEX.number,
              message: "Invalid number format",
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Price for light aicraft:"
                style={styles.input}
                value={String(value)}
                inputMode="numeric"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={errors?.nonCommercial?.takeoffFee?.lightAircraft && true}
              />
              <HelperText type="error">
                {errors?.nonCommercial?.takeoffFee?.lightAircraft?.message}
              </HelperText>
            </>
          )}
        />
        <Controller
          control={control}
          defaultValue={0}
          name="nonCommercial.takeoffFee.winterPeriodQuotaPercentage"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            pattern: {
              value: REGEX.number,
              message: "Invalid number format",
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Winter night period quota percentage:"
                style={styles.input}
                value={String(value)}
                inputMode="numeric"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={
                  errors?.nonCommercial?.takeoffFee
                    ?.winterPeriodQuotaPercentage && true
                }
              />
              <HelperText type="error">
                {
                  errors?.nonCommercial?.takeoffFee?.winterPeriodQuotaPercentage
                    ?.message
                }
              </HelperText>
            </>
          )}
        />
        <Controller
          control={control}
          defaultValue={0}
          name="nonCommercial.takeoffFee.summerPeriodQuotaPercentage"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            pattern: {
              value: REGEX.number,
              message: "Invalid number format",
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Summer period quota percentage:"
                style={styles.input}
                value={String(value)}
                inputMode="numeric"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={
                  errors?.nonCommercial?.takeoffFee
                    ?.summerPeriodQuotaPercentage && true
                }
              />
              <HelperText type="error">
                {
                  errors?.nonCommercial?.takeoffFee?.summerPeriodQuotaPercentage
                    ?.message
                }
              </HelperText>
            </>
          )}
        />
        <View style={styles.row}>
          <Text variant="bodyMedium">Passenger fee:</Text>
        </View>

        <Controller
          control={control}
          defaultValue={0}
          name="nonCommercial.passengerFee.perPax"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            pattern: {
              value: REGEX.number,
              message: "Invalid number format",
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Price per pax:"
                style={styles.input}
                value={String(value)}
                inputMode="numeric"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={errors?.nonCommercial?.passengerFee?.perPax && true}
              />
              <HelperText type="error">
                {errors?.nonCommercial?.passengerFee?.perPax?.message}
              </HelperText>
            </>
          )}
        />
        <View style={styles.row}>
          <Text variant="bodyMedium">Security fee:</Text>
        </View>
        <Controller
          control={control}
          defaultValue={0}
          name="nonCommercial.securityFee.perTon"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            pattern: {
              value: REGEX.number,
              message: "Invalid number format",
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Price per ton:"
                style={styles.input}
                value={String(value)}
                inputMode="numeric"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={errors?.nonCommercial?.securityFee?.perTon && true}
              />
              <HelperText type="error">
                {errors?.nonCommercial?.securityFee?.perTon?.message}
              </HelperText>
            </>
          )}
        />
        <Controller
          control={control}
          defaultValue={0}
          name="nonCommercial.securityFee.perPax"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            pattern: {
              value: REGEX.number,
              message: "Invalid number format",
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Price per pax:"
                style={styles.input}
                value={String(value)}
                inputMode="numeric"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={errors?.nonCommercial?.securityFee?.perPax && true}
              />
              <HelperText type="error">
                {errors?.nonCommercial?.securityFee?.perPax?.message}
              </HelperText>
            </>
          )}
        />
        <View style={styles.row}>
          <Text variant="bodyMedium">Parking fee:</Text>
        </View>
        <Controller
          control={control}
          defaultValue={0}
          name="nonCommercial.parkingDay.perTon"
          rules={{
            required: { value: true, message: ERROR_MESSAGES.REQUIRED },
            pattern: {
              value: REGEX.number,
              message: "Invalid number format",
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <>
              <TextInput
                label="Price per ton:"
                style={styles.input}
                value={String(value)}
                inputMode="numeric"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                error={errors?.nonCommercial?.parkingDay?.perTon && true}
              />
              <HelperText type="error">
                {errors?.nonCommercial?.parkingDay?.perTon?.message}
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
