import Realm from "realm";
import { DepartureArrival, LoungeFee, Price } from "./models/LoungeFees";
import General from "./models/Config";
import { FuelFees } from "./models/Fuelfees";
import BasicHandling from "./models/BasicHandling";
import ProvidedServices, { Service } from "./models/Services";

export const realmConfig: Realm.Configuration = {
  schema: [
    General,
    DepartureArrival,
    LoungeFee,
    Price,
    FuelFees,
    BasicHandling,
    Service,
    ProvidedServices,
  ],
};

export const realmWithoutSync = new Realm(realmConfig);
