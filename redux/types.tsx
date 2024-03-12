import { Dayjs } from "dayjs";

export type Ramp = {
  name: string;
  surname: string;
};

export type Arrival = {
  from: string;
  datetime: Dayjs;
  adultPassengerCount: number;
  minorPassengerCount: number;
  rampInspectionBeforeArrival: {
    status: InspectionStatus;
    FOD: FOD;
  };
};

enum FOD {
  Found = "Found",
  NotFound = "Not Found",
}

export enum InspectionStatus {
  Completed = "COMPLETED",
  NotCompleted = "NOT COMPLETED",
}
export type Departure = {
  to: string;
  datetime: Dayjs;
  adultPassengerCount: number;
  minorPassengerCount: number;
  rampInspectionAfterDeparture: {
    status: InspectionStatus;
    FOD: FOD;
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
