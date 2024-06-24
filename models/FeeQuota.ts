import Realm, { ObjectSchema } from "realm";

export class FeeQuota extends Realm.Object<IFeeQuota> {
  perTon?: number;
  perPax?: number;
  lightAircraft?: number;
  winterPeriodQuotaPercentage?: number;
  summerPeriodQuotaPercentage?: number;

  static schema: ObjectSchema = {
    name: "FeeQuota",
    properties: {
      perTon: {type:'float', optional: false, default: 0},
      perPax: {type:'float', optional: false, default: 0},
      lightAircraft: {type:'float', optional: false, default: 0},
      winterPeriodQuotaPercentage: {type:'float', optional: false, default: 0},
      summerPeriodQuotaPercentage: {type:'float', optional: false, default: 0},
    },
  };
}
export type IFeeQuota = {
  perTon?: number;
  perPax?: number;
  lightAircraft?: number;
  winterPeriodQuotaPercentage?: number;
  summerPeriodQuotaPercentage?: number;
};
