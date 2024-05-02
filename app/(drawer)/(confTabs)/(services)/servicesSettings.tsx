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
  Icon,
  useTheme,
} from "react-native-paper";
import { Flight, ProvidedServices } from "@/redux/types";
import { useForm, Controller } from "react-hook-form";
import { FlightSchedule } from "@/redux/types";
import { DatePickerInput, TimePickerModal } from "react-native-paper-dates";
import dayjs from "dayjs";
import { Link, useNavigation, useRouter } from "expo-router";
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
import { ProvidedServicesSchema, ServiceSchema } from "@/models/Services";

type FormData = GeneralConfigState & FuelFeesState;
const Form: React.FC = () => {
  const realm = useRealm();
  const router = useRouter();

  let services = useQuery<ProvidedServicesSchema>("Services");
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
        {services.map((s) => {
          return (
            <View>
              <SectionTitle>{s.serviceCategoryName}</SectionTitle>
              <View>
                {s.services.map((service) => (
                  <ServiceItem key={service.serviceId} service={service} />
                ))}
              </View>
            </View>
          );
        })}

        <Button
          mode="contained"
          style={{ marginVertical: 20 }}
          onPress={() =>
            router.navigate("/(drawer)/(confTabs)/(services)/newService")
          }
          icon={"archive-plus-outline"}
          disabled={!formState.isValid}
        >
          Add new service
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

function ServiceItem({ service }: { service: ServiceSchema }) {
  const theme = useTheme();
  return (
    <View
      style={{
        marginVertical: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text>{service?.serviceName}</Text>

      <Link
        href={{
          pathname: "/(drawer)/(confTabs)/(services)/[serviceId]",
          params: { serviceId: service.serviceId || "" },
        }}
      >
        <Icon source={"eye"} size={18} color={theme.colors.secondary} />
      </Link>
    </View>
  );
}
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
