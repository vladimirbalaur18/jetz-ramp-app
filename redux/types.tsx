import { Dayjs } from "dayjs";

export type Ramp = {
  name: string;
  surname: string;
};

type PayloadData = {
  crewNumber: number;
  specialInfo?: string;
  cargoInfo?: string;
  mailInfo?: string;
  remarksInfo?: string;
};

export type Arrival = {
  from: string;
  isLocalFlight: boolean;
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
    agent: RampAgent;
  };
} & PayloadData;

export type Departure = {
  to: string;
  isLocalFlight: boolean;
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
} & PayloadData;

export type RampAgent = {
  fullname: string;
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
  orderingCompanyName?: string;
  aircraftType?: string;
  aircraftRegistration?: string;
  handlingType: HandlingTypes;
  arrival: Arrival;
  departure: Departure;
  mtow: number;
  parkingPosition?: string | number;
  providedServices: ProvidedServices;
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
      pricing: Pricing;
      hasVAT: boolean;
    } & ServiceManualPriceOverride
  >;
};

type Pricing = {
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
