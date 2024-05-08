import Realm, { ObjectSchema } from "realm";
import { IBasicHandling } from "./BasicHandling";
import { IDisbursementFees } from "./DisbursementFees";
import { IVIPLoungeService } from "./VIPLoungeService";
import { ISupportServices } from "./SupportServices";
import { IProvidedService, ProvidedService } from "./ProvidedService";

export type IProvidedServices = {
  basicHandling: IBasicHandling;
  disbursementFees: IDisbursementFees;
  supportServices: ISupportServices;
  VIPLoungeServices: IVIPLoungeService;
  remarks?: string;
  otherServices?: IProvidedService[];
};
export class ProvidedServices extends Realm.Object<IProvidedServices> {
  basicHandling!: IBasicHandling;
  disbursementFees!: IDisbursementFees;
  supportServices!: ISupportServices;
  VIPLoungeServices!: IVIPLoungeService;
  remarks!: string;
  otherServices?: Realm.List<ProvidedService>;

  static schema: ObjectSchema = {
    name: "ProvidedServices",
    properties: {
      basicHandling: { type: "object", objectType: "BasicHandling" },
      disbursementFees: { type: "object", objectType: "DisbursementFees" },
      supportServices: { type: "object", objectType: "SupportServices" },
      VIPLoungeServices: { type: "object", objectType: "VIPLoungeService" },
      remarks: "string?",
      otherServices: { type: "list", objectType: "ProvidedService" },
    },
  };
}
