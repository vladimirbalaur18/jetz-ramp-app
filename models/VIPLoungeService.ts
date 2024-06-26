import Realm, { ObjectSchema } from "realm";

export type IVIPLoungeService = {
  departureAdultPax: number;
  departureMinorPax: number;
  arrivalAdultPax: number;
  arrivalMinorPax: number;
    remarks?:string;

};

export class VIPLoungeService extends Realm.Object<IVIPLoungeService> {
  departureAdultPax!: number;
  departureMinorPax!: number;
  arrivalAdultPax!: number;
  arrivalMinorPax!: number;
  remarks?:string;

  static schema: ObjectSchema = {
    name: "VIPLoungeService",
    properties: {
      departureAdultPax: 'int',
      departureMinorPax: 'int',
      arrivalAdultPax: 'int',
      arrivalMinorPax: 'int',
      remarks:{type:'string', optional:true, default:''}
    },
  };
}
