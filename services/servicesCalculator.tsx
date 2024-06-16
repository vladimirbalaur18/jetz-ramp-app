import serviceDefinitions from "@/configs/serviceDefinitions.json";
import { IBasicHandlingRule } from "@/models/BasicHandlingRule";
import { GeneralConfigState } from "@/models/Config";
import { IFlight } from "@/models/Flight";
import { realmWithoutSync } from "@/realm";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";
import {
  getFuelFeeAmount,
  getLandingFees,
  getParkingFee,
  getPassengersFee,
  getSecurityFee,
  getTakeOffFees,
} from "./AirportFeesManager";
import { applyVAT, getVATMultiplier } from "./AirportFeesManager/utils";
import { ILoungeFee } from "@/models/LoungeFees";

dayjs.extend(isBetween);
dayjs.extend(utc);

export const getBasicHandlingPrice = (flight: IFlight) => {
  const basicHandlingFees =
    realmWithoutSync.objects<IBasicHandlingRule>("BasicHandlingRule");

  let basePricePerLeg = 0;

  if (flight?.mtow > basicHandlingFees[basicHandlingFees.length - 1].maxMTOW)
    basePricePerLeg +=
      basicHandlingFees[basicHandlingFees.length - 1].pricePerLeg;
  else if (flight?.mtow < basicHandlingFees[0].minMTOW)
    basePricePerLeg += basicHandlingFees[0].pricePerLeg;
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

export const getTotalAirportFeesPrice = (flight: IFlight) => {
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
  const [loungeFees] = realmWithoutSync.objects<ILoungeFee>("LoungeFees");
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
  }

  console.log("type: ", typeOf);
  return {
    amount: result * getVATMultiplier(),
    currency: "MDL",
  };
};

export const getAllServices = () => serviceDefinitions;
