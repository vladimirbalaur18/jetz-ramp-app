import { Flight } from "@/redux/types";
import basicHandlingFees from "@/configs/basicHandlingFees.json";
import serviceDefinitions from "@/configs/serviceDefinitions.json";
import loungeFees from "@/configs/loungeFees.json";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";
import { store } from "@/redux/store";
import {
  getLandingFees,
  getParkingFee,
  getPassengersFee,
  getSecurityFee,
  getTakeOffFees,
} from "./AirportFeesManager";
import { getVATMultiplier } from "./AirportFeesManager/utils";

dayjs.extend(isBetween);
dayjs.extend(utc);

export const getBasicHandlingPrice = (flight: Flight) => {
  let total = 0;
  if (flight?.mtow > basicHandlingFees[basicHandlingFees.length - 1].maxMTOW)
    total += basicHandlingFees[basicHandlingFees.length - 1].pricePerQty;
  else
    for (let { minMTOW, maxMTOW, pricePerQty } of basicHandlingFees) {
      if (flight.mtow >= minMTOW && flight.mtow <= maxMTOW) {
        total += pricePerQty;
      }
    }
  let baseTotal = total;

  if (flight?.handlingType !== "FULL") {
    total = baseTotal / 2;
    return flight?.departure?.isLocalFlight || flight?.arrival?.isLocalFlight
      ? total * getVATMultiplier()
      : total;
  } else {
    if (flight?.arrival?.isLocalFlight) {
      total += (baseTotal / 2) * getVATMultiplier();
    }
    if (flight?.departure?.isLocalFlight) {
      total += (baseTotal / 2) * getVATMultiplier();
    }

    return total;
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

export const getLoungeFeePrice = ({
  minorPax = 0,
  adultPax = 0,
  typeOf = "",
}) => {
  const VATMultiplier = store.getState().general.VAT / 100 + 1;
  let result = 0;
  switch (typeOf) {
    case "Departure": {
      result =
        adultPax * loungeFees.departure.pricePerAdult.amount +
        minorPax * loungeFees.departure.pricePerMinor.amount;
      break;
    }
    case "Arrival": {
      result =
        adultPax * loungeFees.arrival.pricePerAdult.amount +
        minorPax * loungeFees.arrival.pricePerMinor.amount;
      break;
    }
    case "Departure & Arrival": {
      result =
        adultPax * loungeFees.departureAndArrival.pricePerAdult.amount +
        minorPax * loungeFees.departureAndArrival.pricePerMinor.amount;
      break;
    }
  }

  console.log("type: ", typeOf);
  return {
    amount: result * getVATMultiplier(),
    currency: "MDL",
  };
};

export const getAllServices = () => serviceDefinitions;
