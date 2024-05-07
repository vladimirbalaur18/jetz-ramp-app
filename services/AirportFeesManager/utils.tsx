import { GeneralConfigState } from "@/models/Config";
import { IArrival, IDeparture } from "@/models/DepartureArrival";
import { IFlight } from "@/models/Flight";
import { realmWithoutSync } from "@/realm";
import getParsedDateTime from "@/utils/getParsedDateTime";

export const getPassengerCount = (data: IArrival | IDeparture): number =>
  Number(data?.adultCount || 0) + Number(data?.minorCount || 0);
export const isLightAircraft = (flight: IFlight) => flight.mtow < 2000;
export const getFlightMTOWinTons = (flight: IFlight) =>
  flight.mtow ? Number(flight.mtow) / 1000 : 0;
export const getDifferenceBetweenArrivalDeparture = (
  flight: IFlight
): { hours: number; days: number } => {
  const isArrivalOnly = flight.handlingType === "Arrival";

  if (isArrivalOnly) return { hours: 0, days: 0 };

  if (!isArrivalOnly && (!flight?.arrival || !flight?.departure)) {
    console.log(flight);

    throw new Error(
      `Invalid arrival or departure date/time for ${flight?.handlingType} handling`
    );
  }

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

export const getVATMultiplier = (): number => {
  const [config] = realmWithoutSync.objects<GeneralConfigState>("General");
  return config.VAT / 100 + 1;
};

export const applyVAT = (price: number) => {
  return price * getVATMultiplier();
};
