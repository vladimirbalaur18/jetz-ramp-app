import { Dayjs } from "dayjs";

export type Ramp = {
  name: string;
  surname: string;
};

export type Arrival = {
  from: string;
  isLocalFlight: boolean;
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
  isLocalFlight: boolean;
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
export type HandlingTypes = "Arrival" | "Departure" | "FULL";

export type Flight = {
  flightId?: string;
  operatorName: string;
  flightNumber: string;
  scheduleType?: FlightSchedule;
  payment?: Payment;
  orderingCompanyName?: string;
  aircraftType?: string;
  aircraftRegistration?: string;
  handlingType: HandlingTypes;
  arrival: Arrival;
  departure: Departure;
  invoiceDate?: Date;
  mtow: number;
  parkingPosition?: string | number;
  providedServices: ProvidedServices;
  crew: { signature: string; name: string };
  ramp: { signature: string; name: string };
  isCommercialFlight?: boolean;
  status?: "ArrivalCompleted" | "DepartureCompleted" | "ServicesCompleted";

  // chargeNote: Charges;
};

type ServiceManualPriceOverride = {
  isPriceOverriden: boolean;
} & (
  | {
      isPriceOverriden: true;
      totalPriceOverride?: number;
    }
  | {
      isPriceOverriden: false;
    }
);

type Service = {
  serviceCategoryName: string;
  services: Array<
    {
      serviceName: string;
      quantity: number;
      notes: string;
      isUsed: boolean;
      pricingRules: PricingRule[];
      hasVAT: boolean;
    } & ServiceManualPriceOverride
  >;
};

type PricingRule = {
  ruleName: string;
  currency: string;
  amount: number;
};

export type ProvidedServices = {
  basicHandling: number | string;
  disbursementFees: {
    airportFee: number;
    fuelFee: number;
    cateringFee: number;
    HOTACFee: number;
    VIPLoungeFee: number;
  };
  supportServices: {
    airportFee: {
      total: number;
    };
    fuel: {
      fuelLitersQuantity: number;
      fuelDensity: number;
    };
    catering: {
      total: number;
    };
    HOTAC: {
      total: number;
    };
  };
  VIPLoungeServices: { adultPax: number; minorPax: number; typeOf: string };
  remarks: string;
  otherServices?: Service[];
};
