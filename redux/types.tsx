import { IArrival, IDeparture, IPayloadData } from "@/models/DepartureArrival";
import { IProvidedServices } from "@/models/ProvidedServices";
import { IRampAgent } from "@/models/RampAgentName";
import { Dayjs } from "dayjs";

export type Ramp = {
  name: string;
  surname: string;
};

export enum FlightSchedule {
  NonScheduled = "NonScheduled",
  Other = "Other",
}
export type HandlingTypes = "Arrival" | "Departure" | "FULL";

export type IFlight = {
  flightId?: string;
  operatorName: string;
  flightNumber: string;
  scheduleType?: FlightSchedule;
  orderingCompanyName?: string;
  aircraftType?: string;
  aircraftRegistration?: string;
  handlingType: HandlingTypes;
  arrival: IArrival;
  departure: IDeparture;
  mtow: number;
  parkingPosition?: string | number;
  providedServices: IProvidedServices;
  //
  crew: { signature: string; name: string };
  ramp: { signature: string; name: string };
  isCommercialFlight?: boolean;
  status?:
    | "ArrivalCompleted"
    | "DepartureCompleted"
    | "ServicesCompleted"
    | "Completed";
  chargeNote: {
    date: Dayjs;
    billingTo: string;
    remarks: string;
    paymentType: string;
    currency: {
      //corresponding to the date
      date: Dayjs;
      euroToMDL: string;
      usdToMDL: string;
    };
  };

  // chargeNote: Charges;
};
