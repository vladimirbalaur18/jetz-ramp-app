import React from "react";
import { StyleSheet, View, ScrollView, SafeAreaView } from "react-native";
import { Button, Text } from "react-native-paper";
import { useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import { useQuery, useRealm } from "@realm/react";
import { GeneralConfigState } from "@/models/Config";
import { FuelFeesState } from "@/models/Fuelfees";
import { BasicHandlingSchema } from "@/models/BasicHandling";

type FormData = GeneralConfigState & FuelFeesState;
const Form: React.FC = () => {
  const realm = useRealm();
  const router = useRouter();

  let basicHandlingFees = useQuery<BasicHandlingSchema>("BasicHandling");
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
          <Text variant="headlineSmall">Basic handling prices: </Text>
        </View>
        <Text>{JSON.stringify(basicHandlingFees)}</Text>

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
