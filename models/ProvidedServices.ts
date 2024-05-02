import Realm, { ObjectSchema } from "realm";
import { ServiceCategorySchema } from "./Services";
import { IBasicHandling } from "./BasicHandling";
import { IDisbursementFees } from "./DisbursementFees";
import { IVIPLoungeService } from "./VIPLoungeService";
import { ISupportServices } from "./SupportServices";

export type IProvidedServices = {
  basicHandling: IBasicHandling;
  disbursementFees: IDisbursementFees;
  supportServices: ISupportServices;
  VIPLoungeServices: IVIPLoungeService;
  remarks?: string;
  otherServices?: ServiceCategorySchema[];
};
export class ProvidedServices extends Realm.Object<IProvidedServices> {
  basicHandling!: IBasicHandling;
  disbursementFees!: IDisbursementFees;
  supportServices!: ISupportServices;
  VIPLoungeServices!: IVIPLoungeService;
  remarks!: string;
  otherServices?: ServiceCategorySchema[];

  static schema: ObjectSchema = {
    name: "ProvidedServices",
    properties: {
      basicHandling: { type: "object", objectType: "BasicHandling" },
      disbursementFees: { type: "object", objectType: "DisbursementFees" },
      supportServices: { type: "object", objectType: "SupportServices" },
      VIPLoungeServices: { type: "object", objectType: "VIPLoungeService" },
      remarks: "string?",
      otherServices: { type: "list", objectType: "Services" },
    },
  };
}
