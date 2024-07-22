import {
  applyVAT,
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
import { AirportSubFeeTotal } from "./types";

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
export const getLandingFees = (flight: IFlight): AirportSubFeeTotal => {
  const [AirportFees] = realmWithoutSync
    .objects<IAirportFees>("AirportFees")
    .toJSON() as IAirportFees[];
  if (flight?.handlingType === "Departure") return { total: 0, VAT: false };
  if (!AirportFees.commercial.landingFee.perTon)
    throw new Error("Undefined commercial landing fee per ton value");
  if (!AirportFees.nonCommercial.landingFee.perTon)
    throw new Error("Undefined noncommercial landing fee per ton value");
  if (!AirportFees.nonCommercial.landingFee.lightAircraft)
    throw new Error("Undefined noncommercial light aircraft landing fee");

  const { arrivalDate, arrivalTime } = flight?.arrival;
  const fullArrivalDateTime = getParsedDateTime(arrivalDate, arrivalTime);
  const mtowTons = getFlightMTOWinTons(flight);

  const total = flight.isCommercialFlight
    ? mtowTons *
      AirportFees.commercial.landingFee.perTon *
      applyWinterSummerQuota(
        fullArrivalDateTime,
        AirportFees.commercial.landingFee.summerPeriodQuotaPercentage || 0,
        AirportFees.commercial.landingFee.winterPeriodQuotaPercentage || 0
      )
    : isLightAircraft(flight)
    ? mtowTons * AirportFees.nonCommercial.landingFee.lightAircraft
    : mtowTons *
      AirportFees.nonCommercial.landingFee.perTon *
      applyWinterSummerQuota(
        fullArrivalDateTime,
        AirportFees.nonCommercial.landingFee.summerPeriodQuotaPercentage || 0,
        AirportFees.nonCommercial.landingFee.winterPeriodQuotaPercentage || 0
      );

  const isLandingLegInternal = flight?.arrival?.isLocalFlight;

  if (isLandingLegInternal) {
    console.warn("Applying VAT on landing fee", {
      withVAT: applyVAT(total),
      withoutVAT: total,
    });
  }
  return {
    total: isLandingLegInternal ? applyVAT(total) : total,
    VAT: isLandingLegInternal,
  };
};
export const getTakeOffFees = (flight: IFlight): AirportSubFeeTotal => {
  const [AirportFees] = realmWithoutSync
    .objects<IAirportFees>("AirportFees")
    .toJSON() as IAirportFees[];
  if (flight.handlingType === "Arrival") return { total: 0, VAT: false };

  if (!AirportFees.commercial.takeoffFee.perTon)
    throw new Error("Commercial takeoff fee per ton is undefined");
  if (!AirportFees.nonCommercial.takeoffFee.lightAircraft)
    throw new Error("NonCommercial takeoff fee light aircraft");
  if (!AirportFees.nonCommercial.takeoffFee.perTon)
    throw new Error("NonCommercial takeoff fee per ton is undefined");

  const mtowTons = getFlightMTOWinTons(flight);
  const { departureDate, departureTime } = flight?.departure;
  const fullDepartureDateTime = getParsedDateTime(departureDate, departureTime);
  const total = flight?.isCommercialFlight
    ? mtowTons *
      AirportFees.commercial.takeoffFee.perTon *
      applyWinterSummerQuota(
        fullDepartureDateTime,
        AirportFees.commercial.takeoffFee.summerPeriodQuotaPercentage || 0,
        AirportFees.commercial.takeoffFee.winterPeriodQuotaPercentage || 0
      )
    : isLightAircraft(flight)
    ? mtowTons * AirportFees.nonCommercial.takeoffFee.lightAircraft
    : mtowTons *
      AirportFees.nonCommercial.takeoffFee.perTon *
      applyWinterSummerQuota(
        fullDepartureDateTime,
        AirportFees.nonCommercial.takeoffFee.summerPeriodQuotaPercentage || 0,
        AirportFees.nonCommercial.takeoffFee.winterPeriodQuotaPercentage || 0
      );

  const isDepartureLegInternal = flight?.departure?.isLocalFlight;

  if (isDepartureLegInternal) {
    console.warn("Applying VAT on takeoff fee", {
      withVAT: applyVAT(total),
      withoutVAT: total,
    });
  }
  return {
    total: isDepartureLegInternal ? applyVAT(total) : total,
    VAT: isDepartureLegInternal,
  };
};

// Daca e light isLightAircraft, se returneaza mtowTons*feeLightAicraft
// Altfel, se ia takeoff fee per ton, si se aplica winterSummerQuota (la voi matinca e de 20 procente)

export const getPassengersFee = (flight: IFlight): AirportSubFeeTotal => {
  const [AirportFees] = realmWithoutSync
    .objects<IAirportFees>("AirportFees")
    .toJSON() as IAirportFees[];
  const feePerPax = flight.isCommercialFlight
    ? AirportFees.commercial.passengerFee.perPax
    : AirportFees.nonCommercial.passengerFee.perPax;

  if (!feePerPax) throw new Error("Fee per pax is undefined");

  const paxCount =
    getPassengerCount(flight?.arrival) + getPassengerCount(flight?.departure);
  const total = feePerPax * paxCount;

  const isAnyOfLegsInternal =
    flight?.departure?.isLocalFlight || flight?.arrival?.isLocalFlight;

  if (isAnyOfLegsInternal) {
    console.warn("Applying VAT on passenger fee", {
      withVAT: applyVAT(total),
      withoutVAT: total,
    });
  }
  return {
    total: isAnyOfLegsInternal ? applyVAT(total) : total,
    VAT: isAnyOfLegsInternal,
  };
};
export const getSecurityFee = (flight: IFlight) => {
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

  const total =
    departingPax > 0
      ? securityFeePerPax * departingPax
      : securityFeePerTon * mtowTons;

  const isDepartureLegInternal = flight?.departure?.isLocalFlight;

  if (isDepartureLegInternal) {
    console.warn("Applying VAT on security fee", {
      withVAT: applyVAT(total),
      withoutVAT: total,
    });
  }
  return {
    total: isDepartureLegInternal ? applyVAT(total) : total,
    VAT: isDepartureLegInternal,
  };
};
export const getParkingFee = (flight: IFlight): AirportSubFeeTotal => {
  const FREE_PARKING_HOURS = 3;
  const [AirportFees] = realmWithoutSync
    .objects<IAirportFees>("AirportFees")
    .toJSON() as IAirportFees[];
  if (flight.handlingType === "Arrival") return { total: 0, VAT: false };
  const { hours, days } = getDifferenceBetweenArrivalDeparture(flight);
  const mtowTons = getFlightMTOWinTons(flight);

  const feePerTon = flight.isCommercialFlight
    ? AirportFees.commercial.parkingDay.perTon
    : AirportFees.nonCommercial.parkingDay.perTon;

  if (!feePerTon) throw new Error("Parking fee per ton is undefined");
  const total =
    hours <= FREE_PARKING_HOURS //first 3 hours of parking are free
      ? 0
      : days * mtowTons * feePerTon;

  const applyVATCondition = false; //TODO: check with client
  return {
    total: applyVATCondition ? applyVAT(total) : total,
    VAT: applyVATCondition,
  };
};
// daca e mai mic sau egal cu 4 ore - 0
//alfel, se ia days (differenta in zile dintre arrival - departure) * mtowTons * feePerTon
