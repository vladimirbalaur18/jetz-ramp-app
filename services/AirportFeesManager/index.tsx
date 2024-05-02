import AirportFees from "@/configs/airportFees.json";
import {
  getDifferenceBetweenArrivalDeparture,
  getFlightMTOWinTons,
  getPassengerCount,
  isLightAircraft,
} from "./utils";
import isNightTime from "@/utils/isNightTime";
import getParsedDateTime from "@/utils/getParsedDateTime";
import { store } from "@/redux/store";
import convertCurrency from "@/utils/convertCurrency";
import { realmWithoutSync } from "@/realm";
import { GeneralConfigState } from "@/models/Config";
import { FuelFeesState } from "@/models/Fuelfees";
import { IFlight } from "@/models/Flight";

export const getFuelFeeAmount = ({
  fuelDensity,
  fuelLitersQuantity,
  flight,
}: {
  fuelDensity: number;
  fuelLitersQuantity: number;
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
  const fuelTons = (fuelDensity * fuelLitersQuantity) / 1000;
  const fuelEURAmount = priceEURPerTon * fuelTons;
  return VATRateMultiplier * fuelEURAmount;
};
export const getLandingFees = (flight: IFlight): number => {
  if (flight?.handlingType === "Departure") return 0;

  const { arrivalDate, arrivalTime } = flight?.arrival;
  const fullArrivalDateTime = getParsedDateTime(arrivalDate, arrivalTime);
  const mtowTons = getFlightMTOWinTons(flight);

  if (flight.isCommercialFlight) {
    return mtowTons * AirportFees.commercial.landingFee.perTon;
  } else {
    return isLightAircraft(flight)
      ? mtowTons * AirportFees.nonCommercial.landingFee.lightAircraft
      : mtowTons *
          AirportFees.nonCommercial.landingFee.perTon *
          (isNightTime(fullArrivalDateTime) ? 1.2 : 1);
  }
};
export const getTakeOffFees = (flight: IFlight): number => {
  if (flight.handlingType === "Arrival") return 0;

  const mtowTons = getFlightMTOWinTons(flight);
  const { departureDate, departureTime } = flight?.departure;
  const fullDepartureDateTime = getParsedDateTime(departureDate, departureTime);

  if (flight.isCommercialFlight)
    return mtowTons * AirportFees.commercial.takeoffFee.perTon;
  else
    return isLightAircraft(flight)
      ? mtowTons * AirportFees.nonCommercial.takeoffFee.lightAircraft
      : mtowTons *
          AirportFees.nonCommercial.takeoffFee.perTon *
          (isNightTime(fullDepartureDateTime) ? 1.2 : 1);
};

export const getPassengersFee = (flight: IFlight): number => {
  const feePerPax = flight.isCommercialFlight
    ? AirportFees.commercial.passengerFee.perPax
    : AirportFees.nonCommercial.passengerFee.perPax;

  const paxCount =
    getPassengerCount(flight?.arrival) + getPassengerCount(flight?.departure);

  return feePerPax * paxCount;
};
export const getSecurityFee = (flight: IFlight): number => {
  const departingPax = getPassengerCount(flight?.departure);
  const mtowTons = getFlightMTOWinTons(flight);

  const securityFeePerPax = flight.isCommercialFlight
    ? AirportFees.commercial.securityFee.perPax
    : AirportFees.nonCommercial.securityFee.perPax;
  const securityFeePerTon = flight.isCommercialFlight
    ? AirportFees.commercial.securityFee.perTon
    : AirportFees.nonCommercial.securityFee.perTon;

  return departingPax > 0
    ? securityFeePerPax * departingPax
    : securityFeePerTon * mtowTons;
};
export const getParkingFee = (flight: IFlight): number => {
  if (flight.handlingType === "Arrival") return 0;
  const { hours, days } = getDifferenceBetweenArrivalDeparture(flight);
  const mtowTons = getFlightMTOWinTons(flight);

  const feePerTon = flight.isCommercialFlight
    ? AirportFees.commercial.parkingDay.perTon
    : AirportFees.nonCommercial.parkingDay.perTon;

  return hours <= 4 //first 4 hours of parking are free
    ? 0
    : days * mtowTons * feePerTon;
};
