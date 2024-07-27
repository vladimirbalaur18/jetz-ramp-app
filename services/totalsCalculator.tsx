import { IFlight } from "@/models/Flight";
import { getVATMultiplier } from "./AirportFeesManager/utils";

export const getDisbursedServices = (
  providedServices: IFlight["providedServices"],
  flight: IFlight
) =>
  providedServices?.otherServices
    ?.filter(
      (providedService) =>
        providedService.service?.isDisbursed && providedService?.isUsed
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

export const getTotalDisbursementFees = (
  providedServices: IFlight["providedServices"],
  flight: IFlight
) =>
  Object.values(providedServices!.disbursementFees).reduce(
    (accumulator, current) => Number(accumulator) + Number(current || 0),
    0
  ) +
  getDisbursedServices(providedServices, flight).reduce(
    (sum, item) => sum + item.total,
    0
  );
