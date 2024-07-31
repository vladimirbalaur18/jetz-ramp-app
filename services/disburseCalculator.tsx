import { IFlight } from "@/models/Flight";
import { getVATMultiplier } from "./AirportFeesManager/utils";
import { IProvidedService } from "@/models/ProvidedService";
import { IProvidedServices } from "@/models/ProvidedServices";
import { getFuelFeeAmount } from "./AirportFeesManager";
import formatMDLPriceToEuro from "@/utils/priceFormatter";
import { getVIPLoungeFeePrice } from "./feeCalculator";

export const getOtherServicesDisbursement = (
  providedServices: IFlight["providedServices"],
  flight: IFlight
) =>
  providedServices?.otherServices
    ?.filter(
      (providedService) =>
        providedService?.service &&
        providedService.service?.isDisbursed &&
        providedService?.isUsed
    )
    .map((disbursedService) => {
      const getDisbursement = (price: any) =>
        flight?.chargeNote?.disbursementPercentage === 0
          ? 0
          : price * (1 / flight?.chargeNote?.disbursementPercentage);
      const withVATIfExists = (total: number) =>
        disbursedService?.service?.hasVAT ? total * getVATMultiplier() : total;

      return {
        serviceName: disbursedService?.service?.serviceName,
        total: withVATIfExists(
          getDisbursement(
            disbursedService!.isPriceOverriden
              ? disbursedService!.totalPriceOverride
              : disbursedService!.service!.price *
                  (disbursedService!.quantity || 0)
          )
        ),
      };
    }) || [];

export const getAirportFeesDisbursement = (
  providedServicesObj: IFlight["providedServices"],
  existingFlight: IFlight
) => {
  const disbursementFeeMultplier =
    existingFlight?.chargeNote?.disbursementPercentage / 100;
  return {
    airportFee:
      (providedServicesObj?.supportServices.airportFee?.total || 0) *
      disbursementFeeMultplier,
    fuelFee:
      getFuelFeeAmount({
        ...(providedServicesObj?.supportServices.fuel || {
          fuelDensity: 0,
          fuelLitersQuantity: 0,
        }),
        flight: existingFlight,
      }) * disbursementFeeMultplier,
    cateringFee:
      (providedServicesObj?.supportServices.catering.total || 0) *
      disbursementFeeMultplier,
    HOTACFee:
      (providedServicesObj?.supportServices.HOTAC.total || 0) *
      disbursementFeeMultplier,
    VIPLoungeFee:
      formatMDLPriceToEuro({
        ...getVIPLoungeFeePrice({ ...providedServicesObj?.VIPLoungeServices }),
        euroToMDL: Number(existingFlight?.chargeNote.currency.euroToMDL),
      }).amountEuro * disbursementFeeMultplier,
  };
};

export const getTotalDisbursementAmount = (
  providedServices: IFlight["providedServices"],
  flight: IFlight
) => {
  const airportDisbursementFees = getAirportFeesDisbursement(
    providedServices,
    flight
  );

  return (
    Object.values(airportDisbursementFees).reduce(
      (accumulator, current) => Number(accumulator) + Number(current || 0),
      0
    ) +
    getOtherServicesDisbursement(providedServices, flight).reduce(
      (sum, item) => sum + item.total,
      0
    )
  );
};

export const getAllDisbursedItems = (
  flight: IFlight
): Array<{ feeName: string; total: number; percentage: number }> => {
  const airportDisbursementFees = getAirportFeesDisbursement(
    flight?.providedServices,
    flight
  );
  const disbursementPercentage = flight.chargeNote.disbursementPercentage;

  const mapKeyByName: Record<string, string> = {
    airportFee: "Airport fees",
    fuelFee: "Fuel",
    cateringFee: "Catering",
    HOTACFee: "HOTAC",
    VIPLoungeFee: "Express/VIP Terminal",
  };

  return [
    ...Object.entries(airportDisbursementFees).map(([key, value]) => ({
      feeName: mapKeyByName[key],
      total: value,
      percentage: disbursementPercentage,
    })),
    ...getOtherServicesDisbursement(flight?.providedServices, flight).map(
      (s) => ({
        feeName: s?.serviceName,
        total: s?.total,
        percentage: disbursementPercentage,
      })
    ),
  ];
};
