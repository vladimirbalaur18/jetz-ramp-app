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
import { ServicesSchema } from "@/models/Services";

type FormData = GeneralConfigState & FuelFeesState;
const Form: React.FC = () => {
  const realm = useRealm();
  const router = useRouter();

  let services = useQuery<ServicesSchema>("Services");
  let [fuelFee] = useQuery<FuelFeesState>("FuelFees");

  const { control, formState, handleSubmit, getValues } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {},
  });
  const { errors } = formState;

  const submit = (data: FormData) => {
    // try {
    //   realm.write(() => {
    //     if (configs) {
    //       configs.VAT = Number(data.VAT);
    //       configs.disbursementPercentage = Number(data.disbursementPercentage);
    //       configs.defaultAirport = String(data.defaultAirport);
    //     } else {
    //       realm.create("General", {
    //         VAT: Number(data.VAT),
    //         disbursementPercentage: Number(data.disbursementPercentage),
    //         defaultAirport: String(data.defaultAirport),
    //       });
    //     }
    //     if (fuelFee) {
    //       const isPriceDifferent =
    //         Number(data?.priceUSDperKG) !== Number(fuelFee?.priceUSDperKG);
    //       fuelFee.priceUSDperKG = Number(data.priceUSDperKG);
    //       fuelFee.lastUpdated = isPriceDifferent
    //         ? new Date()
    //         : fuelFee.lastUpdated;
    //     } else {
    //       realm.create("FuelFees", {
    //         priceUSDperKG: Number(data.priceUSDperKG),
    //         lastUpdated: new Date(),
    //       });
    //     }
    //   });
    // } catch (err) {
    //   console.warn(err);
    // }
  };

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={styles.container}
        alwaysBounceVertical={false}
      >
        <View style={styles.row}>
          <Text variant="headlineSmall">Services settings:</Text>
        </View>
        {services.map((s) => (
          <Text> {s.serviceCategoryName}</Text>
        ))}

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
