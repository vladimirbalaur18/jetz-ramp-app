import React from "react";
import { StyleSheet, View, ScrollView, SafeAreaView } from "react-native";
import { Button, Text, Icon, useTheme } from "react-native-paper";
import { useForm } from "react-hook-form";
import { Link, useRouter } from "expo-router";
import SectionTitle from "@/components/FormUtils/SectionTitle";
import { useQuery, useRealm } from "@realm/react";
import { GeneralConfigState } from "@/models/Config";
import { FuelFeesState } from "@/models/Fuelfees";
import { IServiceCategory } from "@/models/ServiceCategory";
import { IService, Service } from "@/models/Services";
import _ from "lodash";

type FormData = GeneralConfigState & FuelFeesState;
const Form: React.FC = () => {
  const realm = useRealm();
  const router = useRouter();

  let serviceCategories = useQuery<IServiceCategory>("ServiceCategory");
  let services = useQuery<IService>("Service");
  let [fuelFee] = useQuery<FuelFeesState>("FuelFees");

  const { control, formState, handleSubmit, getValues } = useForm<FormData>({
    mode: "onBlur",
    defaultValues: {},
  });
  const { errors } = formState;

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={styles.container}
        alwaysBounceVertical={false}
      >
        {serviceCategories.map((s, i) => {
          return (
            <View key={i}>
              <SectionTitle>{s.categoryName}</SectionTitle>
              {s.services.map((service) => {
                return (
                  <ServiceItem
                    key={service._id as unknown as string}
                    service={service}
                  />
                );
              })}
              <View></View>
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

function ServiceItem({ service }: { service: Service }) {
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
          params: {
            serviceId: service._id.toString(),
          },
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
