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
  crewComposition: Array<Crew>;
  adultCount: number;
  minorCount: number;
  rampInspectionBeforeArrival: {
    status: boolean;
    FOD: boolean;
    agent: RampAgent;
  };
};

type Crew = {
  name: string;
  nationality?: string;
  idNumber?: string;
  idExpiry?: Date;
};

export type Departure = {
  to: string;
  crewNumber: number;
  crewComposition: Array<Crew>;
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
    agent: RampAgent;
  };
};

export type RampAgent = {
  fullname: string;
};
export type Payment = {
  payment: string;
  paymentPercentage?: number;
};

export enum FlightSchedule {
  NonScheduled = "NonScheduled",
  Other = "Other",
}

export type Flight = {
  flightId?: string;
  operatorName: string;
  flightNumber: string;
  scheduleType?: FlightSchedule;
  payment?: Payment;
  orderingCompanyName?: string;
  aircraftType?: string;
  aircraftRegistration?: string;
  arrival?: Arrival;
  departure?: Departure;
  invoiceDate?: Date;
  mtow: number;
  parkingPosition?: string | number;
  providedServices: ProvidedServices;
  isLocalFlight?: boolean;
  status?: "ArrivalCompleted" | "DepartureCompleted" | "ServicesCompleted";

  // chargeNote: Charges;
};

export type Service = {
  serviceName: string;
  quantity: number;
  notes: string;
  isUsed: boolean;
  pricePerQty: number;
};

export type ProvidedServices = {
  basicHandling: number | string;
  additionalServices?: Service[] | null;
};
