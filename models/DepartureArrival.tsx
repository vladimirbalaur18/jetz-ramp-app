import Realm, { ObjectSchema } from "realm";
import { IRampAgent, RampAgent } from "./RampAgentName";
import { IRampInspection } from "./RampInspection";
import { ITime } from "./Time";

export type IPayloadData = {
  crewNumber?: number;
  specialInfo?: string;
  cargoInfo?: string;
  mailInfo?: string;
  remarksInfo?: string;
};

export type IDeparture = {
  to: string;
  isLocalFlight: boolean;
  departureDate: Date;
  departureTime: ITime;
  adultCount: number;
  minorCount: number;
  rampInspectionBeforeDeparture: {
    status: boolean;
    FOD: boolean;
    agent: IRampAgent;
  };
} & IPayloadData;

class Departure extends Realm.Object<IDeparture> {
  to!: string;
  isLocalFlight!: boolean;
  departureDate!: Date;
  departureTime!: ITime;
  adultCount!: number;
  minorCount!: number;
  rampInspectionBeforeDeparture!: IRampInspection;
  crewNumber?: number;
  specialInfo?: string;
  cargoInfo?: string;
  mailInfo?: string;
  remarksInfo?: string;

  static schema: ObjectSchema = {
    name: "Departure",
    properties: {
      to: "string?",
      isLocalFlight: "bool?",
      departureDate: "date?",
      departureTime: {
        type: "object",
        objectType: "Time",
        optional: true,
      },
      adultCount: "int?",
      minorCount: "int?",
      rampInspectionBeforeDeparture: {
        objectType: "RampInspection",
        type: "object",
        optional: true,
      }, //TBD
      crewNumber: "int?",
      specialInfo: "string?",
      cargoInfo: "string?",
      mailInfo: "string?",
      remarksInfo: "string?",
    },
  };
}

export type IArrival = {
  from: string;
  isLocalFlight: boolean;
  arrivalDate: Date;
  arrivalTime: {
    hours: number;
    minutes: number;
  };
  adultCount: number;
  minorCount: number;

  rampInspectionBeforeArrival: IRampInspection;
} & IPayloadData;

class Arrival extends Realm.Object<IArrival> {
  from?: string;
  isLocalFlight?: boolean;
  arrivalDate!: Date;
  arrivalTime!: {
    hours: number;
    minutes: number;
  };
  adultCount?: number;
  minorCount?: number;
  rampInspectionBeforeDeparture?: IRampInspection;
  crewNumber?: number;
  specialInfo?: string;
  cargoInfo?: string;
  mailInfo?: string;
  remarksInfo?: string;

  static schema: ObjectSchema = {
    name: "Arrival",
    properties: {
      from: "string?",
      isLocalFlight: "bool?",
      arrivalDate: "date?",
      arrivalTime: {
        type: "object",
        objectType: "Time",
        optional: true,
      },
      adultCount: "int?",
      minorCount: "int?",
      rampInspectionBeforeArrival: {
        objectType: "RampInspection",
        type: "object",
        optional: true,
      },
      crewNumber: "int?",
      specialInfo: "string?",
      cargoInfo: "string?",
      mailInfo: "string?",
      remarksInfo: "string?",
    },
  };
}

export { Departure, Arrival };
