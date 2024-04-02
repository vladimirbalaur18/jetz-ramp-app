import { View, StyleSheet } from "react-native";
import React, { ReactNode, useMemo } from "react";
import SectionTitle from "../FormUtils/SectionTitle";
import { Text } from "react-native-paper";
import { Flight, ProvidedServices } from "@/redux/types";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getLoungeFeePrice } from "@/services/servicesCalculator";
import { getFuelFeeData } from "@/services/AirportFeesManager";

const TotalServicesSection: React.FC<{
  providedServices: ProvidedServices;
  existingFlight: Flight;
}> = ({ providedServices, existingFlight }) => {
  const {
    otherServices,
    basicHandling,
    supportServices: { HOTAC, airportFee, catering, fuel },
    VIPLoungeServices,
  } = providedServices;
  const generalConfig = useSelector((state: RootState) => state.general);

  const { amount: loungeFeeAmount, currency: loungeFeeCurrency } =
    getLoungeFeePrice(existingFlight, VIPLoungeServices?.typeOf);
  const { pricePerKg, density } = getFuelFeeData();
  const totalFuelPrice = Number(
    (
      (fuel?.fuelDensity * fuel?.fuelLitersQuantity * pricePerKg) /
      density
    ).toFixed(2)
  );
  const totalAmountOfServices = useMemo(() => {
    const rateMDLtoEUR = generalConfig.euroToMDL || 20;
    const calculateOtherServicesTotal = () => {
      let total = 0;

      otherServices?.forEach(({ serviceCategoryName, services }) => {
        services?.forEach((s) => {
          if (s.isUsed) {
            for (const rule of s?.pricingRules) {
              if (rule?.ruleName === "pricePerQty") {
                total += s?.quantity * rule?.amount;
              }
            }
          }
        });
      });

      return Number(total);
    };
    alert(
      Number(
        Number(totalFuelPrice) +
          (loungeFeeCurrency === "MDL"
            ? Number(loungeFeeAmount / rateMDLtoEUR)
            : Number(loungeFeeAmount)) +
          Number(catering.total) +
          Number(HOTAC.total) +
          Number(airportFee.total) +
          Number(basicHandling) +
          calculateOtherServicesTotal()
      )
    );
    return Number(
      Number(totalFuelPrice) +
        (loungeFeeCurrency === "MDL"
          ? Number(loungeFeeAmount / rateMDLtoEUR)
          : Number(loungeFeeAmount)) +
        Number(catering.total) +
        Number(HOTAC.total) +
        Number(airportFee.total) +
        Number(basicHandling) +
        calculateOtherServicesTotal()
    );
  }, [JSON.stringify(providedServices)]);

  return (
    <View>
      <SectionTitle>Services list:</SectionTitle>
      <Text style={styles.serviceListItem} variant="titleMedium">
        Basic handling (MTOW: {existingFlight?.mtow}kg): {basicHandling}
        &euro;
      </Text>
      <Text style={styles.serviceListItem} variant="titleMedium">
        VIP Lounge ({VIPLoungeServices?.typeOf}): {loungeFeeAmount}{" "}
        {loungeFeeCurrency}
      </Text>
      {otherServices?.map(({ serviceCategoryName, services }) => {
        return (
          <>
            <Text style={styles.serviceListItem} variant="titleMedium">
              {serviceCategoryName}:
            </Text>
            {!services.some((service) => service.isUsed) ? (
              <Text>None</Text>
            ) : (
              services?.map((s) => {
                return s.isUsed ? (
                  <Text>
                    {" "}
                    {s?.serviceName} (x{s?.quantity}):{" "}
                    {((): ReactNode => {
                      let total: any;

                      for (const rule of s?.pricingRules) {
                        if (rule?.ruleName === "pricePerQty") {
                          total =
                            s?.quantity * rule?.amount + " " + rule?.currency;
                        }
                      }

                      return <>{Number(total).toFixed(2)}</>;
                    })()}
                  </Text>
                ) : null;
              })
            )}
          </>
        );
      })}
      <Text style={styles.serviceListItem} variant="titleMedium">
        Airport fees: {airportFee?.total || 0}&euro;
      </Text>
      <Text style={styles.serviceListItem} variant="titleMedium">
        HOTAC fees: {HOTAC?.total || 0}&euro;
      </Text>
      <Text style={styles.serviceListItem} variant="titleMedium">
        Catering fees: {catering?.total || 0}&euro;
      </Text>
      <Text style={styles.serviceListItem} variant="titleMedium">
        Fuel fee: {totalFuelPrice || 0}&euro;
      </Text>
      <Text style={styles.serviceListItem} variant="titleLarge">
        Total: {totalAmountOfServices}&euro;
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  serviceListItem: {
    marginVertical: 10,
    fontWeight: "600",
  },
});

export default TotalServicesSection;
