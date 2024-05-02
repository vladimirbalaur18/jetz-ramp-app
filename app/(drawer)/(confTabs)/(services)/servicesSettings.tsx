import React from "react";
import { StyleSheet, View, ScrollView, SafeAreaView } from "react-native";
import { Button, Text, Icon, useTheme } from "react-native-paper";
import { useForm } from "react-hook-form";
import { Link, useRouter } from "expo-router";
import SectionTitle from "@/components/FormUtils/SectionTitle";
import { useQuery, useRealm } from "@realm/react";
import { GeneralConfigState } from "@/models/Config";
import { FuelFeesState } from "@/models/Fuelfees";
import { ServiceCategorySchema, IService } from "@/models/Services";

type FormData = GeneralConfigState & FuelFeesState;
const Form: React.FC = () => {
  const realm = useRealm();
  const router = useRouter();

  let services = useQuery<ServiceCategorySchema>("Services");
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

function ServiceItem({ service }: { service: IService }) {
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
