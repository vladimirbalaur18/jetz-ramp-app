import { Flight } from "@/redux/types";
import basicHandlingFees from "@/configs/basicHandlingFees.json";
import serviceDefinitions from "@/configs/serviceDefinitions.json";
import loungeFees from "@/configs/loungeFees.json";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";
import { store } from "@/redux/store";
import {
  getFuelFeeAmount,
  getLandingFees,
  getParkingFee,
  getPassengersFee,
  getSecurityFee,
  getTakeOffFees,
} from "./AirportFeesManager";
import { applyVAT, getVATMultiplier } from "./AirportFeesManager/utils";
import { realmWithoutSync } from "@/realm";
import { GeneralConfigState } from "@/models/Config";

dayjs.extend(isBetween);
dayjs.extend(utc);

export const getBasicHandlingPrice = (flight: Flight) => {
  let basePricePerLeg = 0;

  if (flight?.mtow > basicHandlingFees[basicHandlingFees.length - 1].maxMTOW)
    basePricePerLeg +=
      basicHandlingFees[basicHandlingFees.length - 1].pricePerLeg;
  else
    for (let { minMTOW, maxMTOW, pricePerLeg } of basicHandlingFees) {
      if (flight.mtow >= minMTOW && flight.mtow <= maxMTOW) {
        basePricePerLeg += pricePerLeg;
      }
    }

  switch (flight?.handlingType) {
    case "FULL": {
      let result = {
        departure: 0,
        arrival: 0,
        vat: {
          departure: false,
          arrival: false,
        },
      };

      if (flight?.departure?.isLocalFlight) {
        result.departure += applyVAT(basePricePerLeg);
        result.vat.departure = true;
      } else result.departure += basePricePerLeg;

      if (flight?.arrival?.isLocalFlight) {
        result.arrival += applyVAT(basePricePerLeg);
        result.vat.arrival = true;
      } else result.arrival += basePricePerLeg;

      return result;
    }
    case "Arrival": {
      if (flight?.arrival?.isLocalFlight) {
        return {
          arrival: applyVAT(basePricePerLeg),
          departure: 0,
          vat: { departure: false, arrival: true },
        };
      }

      return {
        arrival: basePricePerLeg,
        departure: 0,
        vat: { departure: false, arrival: false },
      };
    }
    case "Departure": {
      if (flight?.departure?.isLocalFlight) {
        return {
          departure: applyVAT(basePricePerLeg),
          arrival: 0,
          vat: { departure: true, arrival: false },
        };
      }

      return {
        departure: basePricePerLeg,
        arrival: 0,
        vat: { departure: false, arrival: false },
      };
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

export const getLoungeFeePrice = ({
  minorPax = 0,
  adultPax = 0,
  typeOf = "",
}) => {
  const [general] = realmWithoutSync.objects<GeneralConfigState>("General");
  const VATMultiplier = general.VAT / 100 + 1;
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
