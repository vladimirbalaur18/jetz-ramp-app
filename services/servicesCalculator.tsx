import { Flight } from "@/redux/types";
import basicHandlingFees from "@/configs/basicHandlingFees.json";
import serviceDefinitions from "@/configs/serviceDefinitions.json";

export const getBasicHandlingPrice = (flight: Flight) => {
  for (let { minMTOW, maxMTOW, pricePerQty } of basicHandlingFees) {
    if (flight?.mtow >= minMTOW && flight?.mtow <= maxMTOW) {
      return pricePerQty;
    }
  }
};

export const getAllServices = () => serviceDefinitions;
