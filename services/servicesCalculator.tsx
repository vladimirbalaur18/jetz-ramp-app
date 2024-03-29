import { Flight } from "@/redux/types";
import basicHandlingFees from "@/configs/basicHandlingFees.json";
import serviceDefinitions from "@/configs/serviceDefinitions.json";
import loungeFees from "@/configs/loungeFees.json";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";
import {
  getLandingFees,
  getParkingFee,
  getPassengersFee,
  getSecurityFee,
  getTakeOffFees,
} from "./AirportFeesManager";

dayjs.extend(isBetween);
dayjs.extend(utc);

export const getBasicHandlingPrice = (flight: Flight) => {
  if (flight?.mtow > basicHandlingFees[basicHandlingFees.length - 1].maxMTOW)
    return basicHandlingFees[basicHandlingFees.length - 1].pricePerQty;
  for (let { minMTOW, maxMTOW, pricePerQty } of basicHandlingFees) {
    if (flight.mtow >= minMTOW && flight.mtow <= maxMTOW) {
      return pricePerQty;
    }
  }
};

export const getTotalAirportFeesPrice = (flight: Flight) => {
  const result = {
    landing: getLandingFees(flight),
    takeOff: getTakeOffFees(flight),
    passengers: getPassengersFee(flight),
    security: getSecurityFee(flight),
    parking: getParkingFee(flight),
  };

  return {
    total: Object.values(result).reduce((sum, value) => sum + value, 0),
    fees: { ...result },
  };
};

export const getLoungeFeePrice = (flight: Flight, type: string) => {
  let result = 0;
  switch (type) {
    case "Departure": {
      result =
        flight?.departure?.adultCount *
          loungeFees.departure.pricePerAdult.amount +
        flight?.departure?.minorCount *
          loungeFees.departure.pricePerMinor.amount;
      break;
    }
    case "Arrival": {
      result =
        flight?.arrival?.adultCount * loungeFees.arrival.pricePerAdult.amount +
        flight?.arrival?.minorCount * loungeFees.arrival.pricePerMinor.amount;
      break;
    }
    case "Departure & Arrival": {
      result =
        flight?.arrival?.adultCount *
          loungeFees.departureAndArrival.pricePerAdult.amount +
        flight?.arrival?.minorCount *
          loungeFees.departureAndArrival.pricePerMinor.amount;
      break;
    }
  }

  return {
    amount: result * 1.2,
    currency: "MDL",
  };
};

export const getAllServices = () => serviceDefinitions;
