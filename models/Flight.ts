import Realm, { ObjectSchema } from "realm";
import { IArrival, IDeparture } from "./DepartureArrival";
import { IProvidedServices } from "./ProvidedServices";
import { IPersonNameSignature } from "./PersonNameSignature";
import { IChargeNoteDetails } from "./ChargeNoteDetails";

export type HandlingTypes = "Arrival" | "Departure" | "FULL";
export enum FlightSchedule {
  NonScheduled = "NonScheduled",
  Other = "Other",
}

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
  parkingPosition?: string;
  providedServices: IProvidedServices;
  crew: IPersonNameSignature;
  ramp: IPersonNameSignature;
  isCommercialFlight?: boolean;
  status?: string;
  chargeNote: IChargeNoteDetails;
};

class Flight extends Realm.Object<IFlight> {
  flightId!: string;
  operatorName!: string;
  flightNumber!: string;
  scheduleType!: FlightSchedule;
  orderingCompanyName!: string;
  aircraftType!: string;
  aircraftRegistration!: string;
  handlingType!: HandlingTypes;
  arrival!: IArrival;
  departure!: IDeparture;
  mtow!: number;
  parkingPosition!: string;
  providedServices?: IProvidedServices;
  crew?: IPersonNameSignature;
  ramp?: IPersonNameSignature;
  isCommercialFlight?: boolean;
  status?: string;
  chargeNote?: IChargeNoteDetails;
  static schema: ObjectSchema = {
    name: "Flight",
    primaryKey: "flightId",
    properties: {
      flightId: { type: "string" },
      operatorName: "string",
      flightNumber: "string",
      scheduleType: "string",
      orderingCompanyName: "string",
      aircraftType: "string",
      aircraftRegistration: "string",
      handlingType: "string",
      arrival: {
        type: "object",
        objectType: "Arrival",
        optional: true,
      },
      departure: {
        type: "object",
        objectType: "Departure",
        optional: true,
      },
      mtow: "float",
      parkingPosition: "string",
      providedServices: {
        type: "object",
        objectType: "ProvidedServices",
        optional: true,
      },
      crew: {
        type: "object",
        objectType: "PersonNameSignature",
        optional: true,
      },
      ramp: {
        type: "object",
        objectType: "PersonNameSignature",
        optional: true,
      },
      isCommercialFlight: "bool?",
      status: "string?",
      chargeNote: {
        type: "object",
        objectType: "ChargeNoteDetails",
        optional: true,
      },
    },
  };
}

export default Flight;
