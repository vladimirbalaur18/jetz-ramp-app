import Realm from "realm";
import { DepartureArrival, LoungeFee, Price } from "./models/LoungeFees";
import General from "./models/Config";
import { FuelFees } from "./models/Fuelfees";
import BasicHandlingRule from "./models/BasicHandlingRule";
import Services, { Service } from "./models/Services";
import { Arrival, Departure } from "./models/DepartureArrival";
import { Time } from "./models/Time";
import { RampAgent } from "./models/RampAgentName";
import { RampInspection } from "./models/RampInspection";
import { DisbursementFees } from "./models/DisbursementFees";
import { Fuel } from "./models/Fuel";
import { FeeTotal } from "./models/FeeTotal";
import { SupportServices } from "./models/SupportServices";
import { VIPLoungeService } from "./models/VIPLoungeService";
import { ProvidedServices } from "./models/ProvidedServices";

export const realmConfig: Realm.Configuration = {
  schema: [
    General,
    DepartureArrival,
    LoungeFee,
    Price,
    FuelFees,
    BasicHandlingRule,
    Service,
    Services,
    Departure,
    Arrival,
    Time,
    RampAgent,
    RampInspection,
    DisbursementFees,
    Fuel,
    FeeTotal,
    SupportServices,
    VIPLoungeService,
    ProvidedServices,
  ],
};

export const realmWithoutSync = new Realm(realmConfig);
