import Realm, { ObjectSchema } from "realm";
import { Object } from "realm/dist/public-types/Object";

export class FeeQuota extends Realm.Object<IFeeQuota> {
  perTon?: number;
  perPax?: number;
  lightAircraft?: number;
  winterPeriodQuotaPercentage?: number;
  summerPeriodQuotaPercentage?: number;

  static schema: ObjectSchema = {
    name: "FeeQuota",
    properties: {
      perTon: "float?",
      perPax: "float?",
      lightAircraft: "float?",
      winterPeriodQuotaPercentage: "float?",
      summerPeriodQuotaPercentage: "float?",
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
