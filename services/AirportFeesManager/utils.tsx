import { store } from "@/redux/store";
import { Arrival, Departure, Flight } from "@/redux/types";
import getParsedDateTime from "@/utils/getParsedDateTime";
import dayjs from "dayjs";

export const getPassengerCount = (data: Arrival | Departure): number =>
  Number(data?.adultCount || 0) + Number(data?.minorCount || 0);
export const isLightAircraft = (flight: Flight) => flight.mtow < 2000;
export const getFlightMTOWinTons = (flight: Flight) =>
  flight.mtow ? Number(flight.mtow) / 1000 : 0;
export const getDifferenceBetweenArrivalDeparture = (
  flight: Flight
): { hours: number; days: number } => {
  const isArrivalOnly = flight.handlingType === "Arrival";

  if (isArrivalOnly) return { hours: 0, days: 0 };

  if (!isArrivalOnly && (!flight?.arrival || !flight?.departure))
    throw new Error(
      `Invalid arrival or departure date/time for ${flight?.handlingType} handling`
    );

  const arrivalTime = getParsedDateTime(
    flight.arrival.arrivalDate,
    flight.arrival.arrivalTime
  );

  const departureTime = getParsedDateTime(
    flight.departure.departureDate,
    flight.departure.departureTime
  );

  return {
    hours: departureTime?.diff(arrivalTime, "hours"),
    days: departureTime?.diff(arrivalTime, "days") || 1,
  };
};

export const getVATMultiplier = (): number =>
  store.getState().general.VAT / 100 + 1;
