import {
  getDifferenceBetweenArrivalDeparture,
  getFlightMTOWinTons,
  getPassengerCount,
  isLightAircraft,
} from "./utils";
import { isSummerNightTime, isWinterNightTime } from "@/utils/isNightTime";
import getParsedDateTime from "@/utils/getParsedDateTime";
import { store } from "@/redux/store";
import convertCurrency from "@/utils/convertCurrency";
import { realmWithoutSync } from "@/realm";
import { GeneralConfigState } from "@/models/Config";
import { FuelFeesState } from "@/models/Fuelfees";
import { IFlight } from "@/models/Flight";
import { Dayjs } from "dayjs";
import { IAirportFees } from "@/models/AirportFees";

const applyWinterSummerQuota = (
  fullArrivalDateTime: Dayjs,
  summerQuotaPercentage: number,
  winterPeriodQuotaPercentage: number
) => {
  return isSummerNightTime(fullArrivalDateTime)
    ? 1 + summerQuotaPercentage / 100
    : isWinterNightTime(fullArrivalDateTime)
    ? 1 + winterPeriodQuotaPercentage / 100
    : 1;
};
export const getFuelFeeAmount = ({
  fuelDensity,
  fuelLitersQuantity,
  flight,
}: {
  fuelDensity?: number;
  fuelLitersQuantity?: number;
  flight: IFlight;
}) => {
  const [general] = realmWithoutSync.objects<GeneralConfigState>("General");
  const [FuelFees] = realmWithoutSync.objects<FuelFeesState>("FuelFees");

  const VAT = general.VAT / 100 + 1;
  const VATRateMultiplier = flight?.departure?.isLocalFlight ? VAT : 1;

  const priceEURPerTon = convertCurrency(
    FuelFees.priceUSDperKG * Number(flight?.chargeNote?.currency?.usdToMDL),
    Number(flight?.chargeNote?.currency?.euroToMDL)
  );
  const fuelTons = ((fuelDensity || 0) * (fuelLitersQuantity || 0)) / 1000;
  const fuelEURAmount = priceEURPerTon * fuelTons;

  return VATRateMultiplier * fuelEURAmount;
};
export const getLandingFees = (flight: IFlight): number => {
  const [AirportFees] = realmWithoutSync
    .objects<IAirportFees>("AirportFees")
    .toJSON() as IAirportFees[];
  if (flight?.handlingType === "Departure") return 0;
  if (!AirportFees.commercial.landingFee.perTon)
    throw new Error("Undefined commercial landing fee per ton value");
  if (!AirportFees.nonCommercial.landingFee.perTon)
    throw new Error("Undefined noncommercial landing fee per ton value");
  if (!AirportFees.nonCommercial.landingFee.lightAircraft)
    throw new Error("Undefined noncommercial light aircraft landing fee");

  const { arrivalDate, arrivalTime } = flight?.arrival;
  const fullArrivalDateTime = getParsedDateTime(arrivalDate, arrivalTime);
  const mtowTons = getFlightMTOWinTons(flight);

  if (flight.isCommercialFlight) {
    return (
      mtowTons *
      AirportFees.commercial.landingFee.perTon *
      applyWinterSummerQuota(
        fullArrivalDateTime,
        AirportFees.commercial.landingFee.summerPeriodQuotaPercentage || 0,
        AirportFees.commercial.landingFee.winterPeriodQuotaPercentage || 0
      )
    );
  } else {
    return isLightAircraft(flight)
      ? mtowTons * AirportFees.nonCommercial.landingFee.lightAircraft
      : mtowTons *
          AirportFees.nonCommercial.landingFee.perTon *
          applyWinterSummerQuota(
            fullArrivalDateTime,
            AirportFees.nonCommercial.landingFee.summerPeriodQuotaPercentage ||
              0,
            AirportFees.nonCommercial.landingFee.winterPeriodQuotaPercentage ||
              0
          );
  }
};
export const getTakeOffFees = (flight: IFlight): number => {
  const [AirportFees] = realmWithoutSync
    .objects<IAirportFees>("AirportFees")
    .toJSON() as IAirportFees[];
  if (flight.handlingType === "Arrival") return 0;

  if (!AirportFees.commercial.takeoffFee.perTon)
    throw new Error("Commercial takeoff fee per ton is undefined");
  if (!AirportFees.nonCommercial.takeoffFee.lightAircraft)
    throw new Error("NonCommercial takeoff fee light aircraft");
  if (!AirportFees.nonCommercial.takeoffFee.perTon)
    throw new Error("NonCommercial takeoff fee per ton is undefined");

  const mtowTons = getFlightMTOWinTons(flight);
  const { departureDate, departureTime } = flight?.departure;
  const fullDepartureDateTime = getParsedDateTime(departureDate, departureTime);

  if (flight.isCommercialFlight) {
    return (
      mtowTons *
      AirportFees.commercial.takeoffFee.perTon *
      applyWinterSummerQuota(
        fullDepartureDateTime,
        AirportFees.commercial.takeoffFee.summerPeriodQuotaPercentage || 0,
        AirportFees.commercial.takeoffFee.winterPeriodQuotaPercentage || 0
      )
    );
  } else
    return isLightAircraft(flight)
      ? mtowTons * AirportFees.nonCommercial.takeoffFee.lightAircraft
      : mtowTons *
          AirportFees.nonCommercial.takeoffFee.perTon *
          applyWinterSummerQuota(
            fullDepartureDateTime,
            AirportFees.nonCommercial.takeoffFee.summerPeriodQuotaPercentage ||
              0,
            AirportFees.nonCommercial.takeoffFee.winterPeriodQuotaPercentage ||
              0
          );
};

export const getPassengersFee = (flight: IFlight): number => {
  const [AirportFees] = realmWithoutSync
    .objects<IAirportFees>("AirportFees")
    .toJSON() as IAirportFees[];
  const feePerPax = flight.isCommercialFlight
    ? AirportFees.commercial.passengerFee.perPax
    : AirportFees.nonCommercial.passengerFee.perPax;

  if (!feePerPax) throw new Error("Fee per pax is undefined");

  const paxCount =
    getPassengerCount(flight?.arrival) + getPassengerCount(flight?.departure);

  return feePerPax * paxCount;
};
export const getSecurityFee = (flight: IFlight): number => {
  const [AirportFees] = realmWithoutSync
    .objects<IAirportFees>("AirportFees")
    .toJSON() as IAirportFees[];
  const departingPax = getPassengerCount(flight?.departure);
  const mtowTons = getFlightMTOWinTons(flight);

  const securityFeePerPax = flight.isCommercialFlight
    ? AirportFees.commercial.securityFee.perPax
    : AirportFees.nonCommercial.securityFee.perPax;
  const securityFeePerTon = flight.isCommercialFlight
    ? AirportFees.commercial.securityFee.perTon
    : AirportFees.nonCommercial.securityFee.perTon;

  if (!securityFeePerPax) throw new Error("Security fee per pax is undefined");
  if (!securityFeePerTon) throw new Error("Security fee per ton is undefined");

  return departingPax > 0
    ? securityFeePerPax * departingPax
    : securityFeePerTon * mtowTons;
};
export const getParkingFee = (flight: IFlight): number => {
  const FREE_PARKING_HOURS = 3;
  const [AirportFees] = realmWithoutSync
    .objects<IAirportFees>("AirportFees")
    .toJSON() as IAirportFees[];
  if (flight.handlingType === "Arrival") return 0;
  const { hours, days } = getDifferenceBetweenArrivalDeparture(flight);
  const mtowTons = getFlightMTOWinTons(flight);

  const feePerTon = flight.isCommercialFlight
    ? AirportFees.commercial.parkingDay.perTon
    : AirportFees.nonCommercial.parkingDay.perTon;

  if (!feePerTon) throw new Error("Parking fee per ton is undefined");

  return hours <= FREE_PARKING_HOURS //first 3 hours of parking are free
    ? 0
    : days * mtowTons * feePerTon;
};
