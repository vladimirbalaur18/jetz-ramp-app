import Realm, { ObjectSchema } from "realm";

export type IVIPLoungeService = {
  adultPax: number;
  minorPax: number;
  typeOf: string;
};

export class VIPLoungeService extends Realm.Object<IVIPLoungeService> {
  adultPax?: number;
  minorPax?: number;
  typeOf?: string;

  static schema: ObjectSchema = {
    name: "VIPLoungeService",
    properties: {
      adultPax: "int?",
      minorPax: "int?",
      typeOf: "string?",
    },
  };
}
