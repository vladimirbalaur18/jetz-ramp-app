import Realm, { ObjectSchema } from "realm";
import { IBasicHandling } from "./BasicHandling";
import { IVIPLoungeService } from "./VIPLoungeService";
import { ISupportServices } from "./SupportServices";
import { IProvidedService, ProvidedService } from "./ProvidedService";

export type IProvidedServices = {
  basicHandling?: IBasicHandling;
  supportServices: ISupportServices;
  VIPLoungeServices: IVIPLoungeService;
  remarks?: string;
  otherServices?: IProvidedService[];
};
export class ProvidedServices extends Realm.Object<IProvidedServices> {
  basicHandling!: IBasicHandling;
  supportServices!: ISupportServices;
  VIPLoungeServices!: IVIPLoungeService;
  remarks!: string;
  otherServices?: Realm.List<ProvidedService>;

  static schema: ObjectSchema = {
    name: "ProvidedServices",
    properties: {
      basicHandling: { type: "object", objectType: "BasicHandling" },
      supportServices: { type: "object", objectType: "SupportServices" },
      VIPLoungeServices: { type: "object", objectType: "VIPLoungeService" },
      remarks: "string?",
      otherServices: { type: "list", objectType: "ProvidedService" },
    },
  };
}
