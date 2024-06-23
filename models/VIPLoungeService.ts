import Realm, { ObjectSchema } from "realm";

export type IVIPLoungeService = {
  departureAdultPax: number;
  departureMinorPax: number;
  arrivalAdultPax: number;
  arrivalMinorPax: number;
};

export class VIPLoungeService extends Realm.Object<IVIPLoungeService> {
  departureAdultPax!: number;
  departureMinorPax!: number;
  arrivalAdultPax!: number;
  arrivalMinorPax!: number;

  static schema: ObjectSchema = {
    name: "VIPLoungeService",
    properties: {
      departureAdultPax: 'int',
      departureMinorPax: 'int',
      arrivalAdultPax: 'int',
      arrivalMinorPax: 'int',
    },
  };
}
