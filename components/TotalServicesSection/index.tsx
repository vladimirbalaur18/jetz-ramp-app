import { View, StyleSheet } from "react-native";
import React, { ReactNode, useMemo } from "react";
import SectionTitle from "../FormUtils/SectionTitle";
import { Divider, Text } from "react-native-paper";
import { getVIPLoungeFeePrice } from "@/services/feeCalculator";
import { getFuelFeeAmount } from "@/services/AirportFeesManager";
import formatMDLPriceToEuro from "@/utils/priceFormatter";
import { useQuery } from "@realm/react";
import { GeneralConfigState } from "@/models/Config";
import { IFlight } from "@/models/Flight";
import { IProvidedServices } from "@/models/ProvidedServices";
import { IProvidedService } from "@/models/ProvidedService";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeNumber } from "@/utils/SafeNumber";
import { getAllDisbursedItems } from "@/services/disburseCalculator";
import { calculateTotalAmount } from "@/services/totalsCalculator";

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
  } = providedServices;

  const consumedServicesPerCategoryParsed = useMemo<
    Record<string, Array<IProvidedService>>
  >(() => {
    let categoryServicesMap: Record<string, Array<IProvidedService>> = {};
    if (providedServices?.otherServices?.length) {
      for (const service of providedServices?.otherServices.filter(
        (s) => s?.service && s.isUsed
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
    getVIPLoungeFeePrice({ ...VIPLoungeServices });

  const totalFuelPrice = getFuelFeeAmount({
    fuelDensity: fuel.fuelDensity || 0,
    fuelLitersQuantity: fuel.fuelLitersQuantity || 0,
    flight: existingFlight,
  }).toFixed(2);

  const totalAmountOfServices = useMemo(() => {
    console.warn(
      "@totals",
      calculateTotalAmount({ ...existingFlight, providedServices }).total
    );
    return calculateTotalAmount({ ...existingFlight, providedServices }).total;
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
      {getAllDisbursedItems({ ...existingFlight, providedServices }).map(
        ({ feeName, percentage, total }) => {
          return (
            <Text>
              {feeName}: {Number(total).toFixed(2) || 0}
              &euro;
            </Text>
          );
        }
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
