import Realm from "realm";
import { DepartureArrival, LoungeFee, Price } from "./models/LoungeFees";
import General from "./models/Config";
import { FuelFees } from "./models/Fuelfees";
import BasicHandling from "./models/BasicHandling";
import Services, { Service } from "./models/Services";

export const realmConfig: Realm.Configuration = {
  schema: [
    General,
    DepartureArrival,
    LoungeFee,
    Price,
    FuelFees,
    BasicHandling,
    Service,
    Services,
  ],
};

export const realmWithoutSync = new Realm(realmConfig);
