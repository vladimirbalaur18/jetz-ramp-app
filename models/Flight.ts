import { IFlight } from "@/redux/types";
import Realm, { ObjectSchema } from "realm";
class Flight extends Realm.Object<IFlight> {
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
      },
      departure: {
        type: "object",
        objectType: "Departure",
      },
      mtow: "float",
      parkingPosition: "string",
      providedServices: {
        type: "object",
        objectType: "ProvidedServices",
      },
    },
  };
}

export default Flight;
