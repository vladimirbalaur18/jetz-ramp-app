import { Dayjs } from "dayjs";

export type Ramp = {
  name: string;
  surname: string;
};

export type Arrival = {
  from: string;
  arrivalDate: Date;
  arrivalTime: {
    hours: number;
    minutes: number;
  };
  adultCount: number;
  minorCount: number;
  rampInspectionBeforeArrival: {
    status: boolean;
    FOD: boolean;
  };
};

export type Departure = {
  to: string;
  departureDate: Date;
  departureTime: {
    hours: number;
    minutes: number;
  };
  adultCount: number;
  minorCount: number;
  rampInspectionBeforeDeparture: {
    status: boolean;
    FOD: boolean;
  };
};
export type Payment = {
  payment: string;
  paymentPercentage?: number;
};
export enum Company {}

export enum FlightSchedule {
  NonScheduled = "NonScheduler",
  Other = "Other",
}
