import Realm from "realm";
import { DepartureArrival, LoungeFee, Price } from "./models/LoungeFees";
import General from "./models/Config";
import { FuelFees } from "./models/Fuelfees";
import BasicHandlingRule from "./models/BasicHandlingRule";
import { Service } from "./models/Services";
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
import { PersonNameSignature } from "./models/PersonNameSignature";
import { CurrencyRates } from "./models/CurrencyRates";
import { ChargeNoteDetails } from "./models/ChargeNoteDetails";
import Flight from "./models/Flight";
import { BasicHandling } from "./models/BasicHandling";
import { ProvidedService } from "./models/ProvidedService";
import { ServiceCategory } from "./models/ServiceCategory";
import { AppData } from "./models/AppData";

export const realmConfig: Realm.Configuration = {
  schema: [
    General,
    DepartureArrival,
    LoungeFee,
    Price,
    FuelFees,
    BasicHandlingRule,
    Service,
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
    ProvidedService,
    PersonNameSignature,
    CurrencyRates,
    ChargeNoteDetails,
    Flight,
    BasicHandling,
    ServiceCategory,
    AppData,
  ],
};

export const realmWithoutSync = new Realm(realmConfig);
