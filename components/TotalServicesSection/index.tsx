import { View, StyleSheet } from "react-native";
import React, { ReactNode, useMemo } from "react";
import SectionTitle from "../FormUtils/SectionTitle";
import { Text } from "react-native-paper";
import { Flight, ProvidedServices } from "@/redux/types";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getLoungeFeePrice } from "@/services/servicesCalculator";
import { getFuelFeeAmount } from "@/services/AirportFeesManager";
import convertCurrency from "@/utils/convertCurrency";
import formatMDLPriceToEuro from "@/utils/priceFormatter";
import { getVATMultiplier } from "@/services/AirportFeesManager/utils";

const TotalServicesSection: React.FC<{
  providedServices: ProvidedServices;
  existingFlight: Flight;
}> = ({ providedServices, existingFlight }) => {
  const {
    otherServices,
    basicHandling,
    supportServices: { HOTAC, airportFee, catering, fuel },
    VIPLoungeServices,
    disbursementFees,
  } = providedServices;

  const generalConfig = useSelector((state: RootState) => state.general);
  console.log("genCOnfig", generalConfig);

  const { amount: loungeFeeAmount, currency: loungeFeeCurrency } =
    getLoungeFeePrice({ ...VIPLoungeServices });

  const totalFuelPrice = getFuelFeeAmount({
    fuelDensity: fuel?.fuelDensity,
    fuelLitersQuantity: fuel?.fuelLitersQuantity,
    flight: existingFlight,
  }).toFixed(2);

  const totalAmountOfServices = useMemo(() => {
    //GENERAL CONFIG FOR SOME REASON DOESNT INITIALIZE
    const rateMDLtoEUR = generalConfig.euroToMDL || 20;
    const calculateOtherServicesTotal = () => {
      let total = 0;

      otherServices?.forEach(({ serviceCategoryName, services }) => {
        services?.forEach((s) => {
          if (s.isUsed) {
            if (s.isPriceOverriden && s?.totalPriceOverride) {
              total += s?.hasVAT
                ? Number(s?.totalPriceOverride) * getVATMultiplier()
                : Number(s?.totalPriceOverride);
            } else {
              const servicePriceTotal = s?.quantity * s.pricing?.amount;
              total += s?.hasVAT
                ? servicePriceTotal * getVATMultiplier()
                : servicePriceTotal;
            }
          }
        });
      });

      return Number(total);
    };
    const calculateDisbursementsTotal = () => {
      return Object.values(disbursementFees).reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      );
    };
    alert(
      Number(
        Number(totalFuelPrice) +
          (loungeFeeCurrency === "MDL"
            ? convertCurrency(loungeFeeAmount, rateMDLtoEUR)
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
          ? convertCurrency(loungeFeeAmount, rateMDLtoEUR)
          : Number(loungeFeeAmount)) +
        Number(catering.total) +
        Number(HOTAC.total) +
        Number(airportFee.total) +
        Number(basicHandling) +
        calculateOtherServicesTotal() +
        calculateDisbursementsTotal()
    );
  }, [JSON.stringify(providedServices)]);

  const renderBasicHandlingVAT = basicHandling;
  return (
    <View>
      <SectionTitle>Services list:</SectionTitle>
      <Text style={styles.serviceListItem} variant="titleMedium">
        Basic handling (MTOW: {existingFlight?.mtow}kg):{" "}
        {renderBasicHandlingVAT}
        &euro;
      </Text>
      <Text style={styles.serviceListItem} variant="titleMedium">
        VIP Lounge ({VIPLoungeServices?.typeOf}):{" "}
        {
          formatMDLPriceToEuro({
            amount: loungeFeeAmount,
            currency: loungeFeeCurrency,
          }).displayedString
        }
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
                    {s?.isPriceOverriden &&
                      s?.totalPriceOverride &&
                      " **manual price "}
                    {s?.serviceName} (x{s?.quantity}) :{" "}
                    {((): ReactNode => {
                      let total: any;
                      let totalWithVAT: number;

                      if (s?.isPriceOverriden && s?.totalPriceOverride) {
                        total = s.totalPriceOverride;
                      } else total = s?.quantity * s.pricing?.amount;

                      if (s?.hasVAT) {
                        totalWithVAT = total * (generalConfig?.VAT / 100 + 1);

                        return (
                          <>
                            {Number(total).toFixed(2)} x {generalConfig?.VAT}%
                            VAT = {totalWithVAT.toFixed(2)}
                          </>
                        );
                      } else return <>{Number(total).toFixed(2)}</>;
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
      <Text style={styles.serviceListItem} variant="titleMedium">
        Disbursement fees:
      </Text>
      <Text>
        Airport fees: {disbursementFees.airportFee.toFixed(2) || 0}
        &euro;
      </Text>
      <Text>HOTAC fees: {disbursementFees.HOTACFee.toFixed(2) || 0}&euro;</Text>
      <Text>
        Catering fees: {disbursementFees.cateringFee.toFixed(2) || 0}
        &euro;
      </Text>
      <Text>Fuel fee: {disbursementFees.fuelFee.toFixed(2) || 0}&euro;</Text>
      <Text>
        Express/VIP Lounge fee: {disbursementFees.VIPLoungeFee.toFixed(2)}&euro;
      </Text>
      <Text variant="titleLarge">
        Total: {totalAmountOfServices.toFixed(2)}&euro;
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
