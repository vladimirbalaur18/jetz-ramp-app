import { View, StyleSheet } from "react-native";
import React, { ReactNode, useMemo } from "react";
import SectionTitle from "../FormUtils/SectionTitle";
import { Divider, Text } from "react-native-paper";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getLoungeFeePrice } from "@/services/servicesCalculator";
import { getFuelFeeAmount } from "@/services/AirportFeesManager";
import convertCurrency from "@/utils/convertCurrency";
import formatMDLPriceToEuro from "@/utils/priceFormatter";
import { getVATMultiplier } from "@/services/AirportFeesManager/utils";
import { useQuery } from "@realm/react";
import { GeneralConfigState } from "@/models/Config";
import { IFlight } from "@/models/Flight";
import { IProvidedServices } from "@/models/ProvidedServices";
import { IService } from "@/models/Services";
import { IProvidedService } from "@/models/ProvidedService";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeNumber } from "@/utils/SafeNumber";
import {
  getDisbursedServices,
  getTotalDisbursementFees,
} from "@/services/totalsCalculator";

function getCircularReplacer() {
  const ancestors: any[] = []; //@ts-expect-error

  return function (key, value) {
    if (typeof value !== "object" || value === null) {
      return value;
    }
    // `this` is the object that value is contained in,
    // i.e., its direct parent.
    //@ts-expect-error
    while (ancestors.length > 0 && ancestors.at(-1) !== (this as any)) {
      ancestors.pop();
    }
    if (ancestors.includes(value)) {
      return "[Circular]";
    }
    ancestors.push(value);
    return value;
  };
}
const TotalServicesSection: React.FC<{
  providedServices?: IProvidedServices;
  existingFlight: IFlight;
}> = ({ providedServices, existingFlight }) => {
  if (!providedServices) return;

  const {
    otherServices,
    basicHandling,
    supportServices: { HOTAC, airportFee, catering, fuel },
    VIPLoungeServices,
    disbursementFees,
  } = providedServices;

  const consumedServicesPerCategoryParsed = useMemo<
    Record<string, Array<IProvidedService>>
  >(() => {
    let categoryServicesMap: Record<string, Array<IProvidedService>> = {};
    if (providedServices?.otherServices?.length) {
      for (const service of providedServices?.otherServices.filter(
        (s) => s.isUsed
      )) {
        const category = service.service.categoryName;
        if (!categoryServicesMap[category]) {
          categoryServicesMap[category] = [service];
        } else categoryServicesMap[category].push(service);
      }
    }

    return categoryServicesMap;
  }, [JSON.stringify(providedServices, null, 5)]);

  const [generalConfig] = useQuery<GeneralConfigState>("General");

  const { amount: loungeFeeAmount, currency: loungeFeeCurrency } =
    getLoungeFeePrice({ ...VIPLoungeServices });

  const totalFuelPrice = getFuelFeeAmount({
    fuelDensity: fuel.fuelDensity || 0,
    fuelLitersQuantity: fuel.fuelLitersQuantity || 0,
    flight: existingFlight,
  }).toFixed(2);

  const totalAmountOfServices = useMemo(() => {
    //GENERAL CONFIG FOR SOME REASON DOESNT INITIALIZE
    const rateMDLtoEUR = Number(
      existingFlight?.chargeNote?.currency?.euroToMDL
    );
    const calculateOtherServicesTotal = () => {
      let total = 0;

      otherServices?.forEach(
        ({
          isUsed,
          isPriceOverriden,
          totalPriceOverride,
          quantity,
          service: { price, hasVAT },
        }) => {
          if (isUsed) {
            if (isPriceOverriden && totalPriceOverride) {
              total += hasVAT
                ? Number(totalPriceOverride) * getVATMultiplier()
                : Number(totalPriceOverride);
            } else {
              const servicePriceTotal = (quantity || 0) * price;
              total += hasVAT
                ? servicePriceTotal * getVATMultiplier()
                : servicePriceTotal;
            }
          }
        }
      );

      return Number(total);
    };

    return Number(
      Number(totalFuelPrice) +
        (loungeFeeCurrency === "MDL"
          ? convertCurrency(loungeFeeAmount, rateMDLtoEUR)
          : Number(loungeFeeAmount)) +
        Number(catering.total) +
        Number(HOTAC.total) +
        Number(airportFee?.total) +
        Number(basicHandling?.total) +
        calculateOtherServicesTotal() +
        getTotalDisbursementFees(providedServices, existingFlight)
    );
  }, [JSON.stringify(providedServices, getCircularReplacer())]);

  const renderBasicHandlingVAT = basicHandling?.total;
  return (
    <View>
      <SectionTitle>Total services provided:</SectionTitle>
      <Text style={styles.serviceListItem} variant="titleMedium">
        Basic handling (MTOW: {existingFlight?.mtow}kg):{" "}
        {SafeNumber(renderBasicHandlingVAT)}
        &euro;
      </Text>
      <Divider />
      <Text style={styles.serviceListItem} variant="titleMedium">
        VIP Lounge:{" "}
        {
          formatMDLPriceToEuro({
            amount: loungeFeeAmount,
            currency: loungeFeeCurrency,
            euroToMDL: Number(existingFlight?.chargeNote?.currency?.euroToMDL),
          }).displayedString
        }
      </Text>
      <Divider />
      {/* OLD RENDERING OF SERVICES WITHOUT CATEGORIES */}
      {/* {!providedServices?.otherServices?.some((service) => service.isUsed) ? (
        <Text>None</Text>
      ) : (
        providedServices?.otherServices?.map((s) => {
          return s.isUsed ? (
            <Text>
              {" "}
              {s?.isPriceOverriden && s?.totalPriceOverride && (
                <MaterialCommunityIcons name="pencil" size={14} />
              )}{" "}
              {s?.service.serviceName} (x{s?.quantity}) :{" "}
              {((): ReactNode => {
                let total: any;
                let totalWithVAT: number;

                if (s?.isPriceOverriden && s?.totalPriceOverride) {
                  total = s.totalPriceOverride;
                } else total = (s?.quantity || 0) * s.service.price;

                if (s?.service.hasVAT) {
                  totalWithVAT = total * (generalConfig?.VAT / 100 + 1);

                  return (
                    <>
                      {Number(total).toFixed(2)} x {generalConfig?.VAT}% VAT ={" "}
                      {totalWithVAT.toFixed(2)}
                    </>
                  );
                } else return <>{Number(total).toFixed(2)}</>;
              })()}
            </Text>
          ) : null;
        })
      )} */}
      {Object.entries(consumedServicesPerCategoryParsed).map(
        ([category, services]) => {
          return (
            <View style={{ marginVertical: 10 }}>
              <Text variant="bodyLarge">{category}</Text>
              {services?.map((s) => {
                return s.isUsed ? (
                  <Text style={{ marginVertical: 5 }}>
                    {" "}
                    {s?.isPriceOverriden && s?.totalPriceOverride && (
                      <MaterialCommunityIcons name="pencil" size={14} />
                    )}{" "}
                    {s?.service.serviceName} (x{s?.quantity}) :{" "}
                    {((): ReactNode => {
                      let total: any;
                      let totalWithVAT: number;

                      if (s?.isPriceOverriden && s?.totalPriceOverride) {
                        total = s.totalPriceOverride;
                      } else total = (s?.quantity || 0) * s.service.price;

                      if (s?.service.hasVAT) {
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
              })}
            </View>
          );
        }
      )}
      <Divider />
      <Text style={styles.serviceListItem} variant="titleMedium">
        Airport fees: {Number(airportFee?.total)?.toFixed(2) || 0}&euro;
      </Text>
      <Text style={styles.serviceListItem} variant="titleMedium">
        HOTAC fees: {Number(HOTAC?.total)?.toFixed(2) || 0}&euro;
      </Text>
      <Text style={styles.serviceListItem} variant="titleMedium">
        Catering fees: {Number(catering?.total)?.toFixed(2) || 0}&euro;
      </Text>
      <Text style={styles.serviceListItem} variant="titleMedium">
        Fuel fee: {Number(totalFuelPrice)?.toFixed(2) || 0}&euro;
      </Text>
      <Divider />
      <Text style={styles.serviceListItem} variant="titleMedium">
        Disbursement fees:
      </Text>
      <Text>
        Airport fees: {Number(disbursementFees?.airportFee).toFixed(2) || 0}
        &euro;
      </Text>
      <Text>
        HOTAC fees: {Number(disbursementFees?.HOTACFee).toFixed(2) || 0}&euro;
      </Text>
      <Text>
        Catering fees: {Number(disbursementFees?.cateringFee).toFixed(2) || 0}
        &euro;
      </Text>
      <Text>
        Fuel fee: {Number(disbursementFees?.fuelFee).toFixed(2) || 0}&euro;
      </Text>
      <Text>
        Express/VIP Lounge fee:{" "}
        {Number(disbursementFees?.VIPLoungeFee).toFixed(2)}&euro;
      </Text>
      {getDisbursedServices(providedServices, existingFlight).map(
        ({ serviceName, total }) => (
          <Text>
            {serviceName}: {Number(total).toFixed(2) || 0}&euro;
          </Text>
        )
      )}
      <Divider style={{ marginVertical: 10 }} />
      <Text variant="titleLarge">
        Total: {Number(totalAmountOfServices).toFixed(2)}&euro;{" "}
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
