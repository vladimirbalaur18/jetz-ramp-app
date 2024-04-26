import Realm from "realm";
import { DepartureArrival, LoungeFee, Price } from "./models/LoungeFees";
import General from "./models/Config";
import { FuelFees } from "./models/Fuelfees";

export const realmConfig: Realm.Configuration = {
  schema: [General, DepartureArrival, LoungeFee, Price, FuelFees],
};

export const realmWithoutSync = new Realm(realmConfig);
