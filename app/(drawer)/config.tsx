import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TextComponent,
  SafeAreaView,
} from "react-native";
import {
  TextInput,
  Button,
  Switch,
  HelperText,
  List,
  Text,
  RadioButton,
} from "react-native-paper";
import { Flight, ProvidedServices } from "@/redux/types";
import { useForm, Controller } from "react-hook-form";
import { FlightSchedule } from "@/redux/types";
import { DatePickerInput, TimePickerModal } from "react-native-paper-dates";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import REGEX from "@/utils/regexp";
import { updateFlight } from "@/redux/slices/flightsSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { selectCurrentFlight } from "@/redux/slices/flightsSlice/selectors";
import ERROR_MESSAGES from "@/utils/formErrorMessages";
import _ from "lodash";
import SectionTitle from "@/components/FormUtils/SectionTitle";
import { useQuery, useRealm } from "@realm/react";
import General, { GeneralConfigState } from "@/models/Config";
import { FuelFeesState } from "@/models/Fuelfees";

type FormData = GeneralConfigState & FuelFeesState;
const Form: React.FC = () => {
  const realm = useRealm();
  const router = useRouter();
  const dispatch = useDispatch();

  let [configs] = useQuery<GeneralConfigState>("General");
  let [fuelFee] = useQuery<FuelFeesState>("FuelFees");

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
          fuelFee.priceUSDperKG = Number(data.priceUSDperKG);
        } else {
          realm.create("FuelFees", {
            priceUSDperKG: Number(data.priceUSDperKG),
          });
        }
      });
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
          <Text variant="headlineSmall">Departure {configs?.VAT}</Text>
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
