import { GeneralConfigState } from "@/models/Config";
import { IArrival, IDeparture } from "@/models/DepartureArrival";
import { IFlight } from "@/models/Flight";
import { realmWithoutSync } from "@/realm";
import getParsedDateTime from "@/utils/getParsedDateTime";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const getPassengerCount = (data: IArrival | IDeparture): number =>
  Number(data?.adultCount || 0) + Number(data?.minorCount || 0);
export const isLightAircraft = (flight: IFlight) => flight.mtow < 2000;
export const getFlightMTOWinTons = (flight: IFlight) =>
  flight.mtow ? Number(flight.mtow) / 1000 : 0;

export const getDifferenceBetweenArrivalDeparture = (
  flight: IFlight
): { hours: number; days: number } => {
  const FREE_PARKING_HOURS = 3;
  const isArrivalOnly = flight.handlingType === "Arrival";

  if (isArrivalOnly) return { hours: 0, days: 0 };

  if (!isArrivalOnly && (!flight?.arrival || !flight?.departure)) {
    throw new Error(
      `Invalid arrival or departure date/time for ${flight?.handlingType} handling`
    );
  }

  const arrivalTime = getParsedDateTime(
    flight.arrival.arrivalDate,
    flight.arrival.arrivalTime
  ).add(FREE_PARKING_HOURS, "hours");

  const departureTime = getParsedDateTime(
    flight.departure.departureDate,
    flight.departure.departureTime
  );

  return {
    hours: departureTime?.diff(arrivalTime, "hours"),
    days: Math.ceil(departureTime?.diff(arrivalTime, "days", true)) || 1,
  };
};

export const getVATMultiplier = (): number => {
  const [config] = realmWithoutSync.objects<GeneralConfigState>("General");
  return config.VAT / 100 + 1;
};

export const applyVAT = (price: number) => {
  return price * getVATMultiplier();
};
