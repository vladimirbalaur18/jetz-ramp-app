import Realm, { ObjectSchema } from "realm";

export type ICurrencyRates = {
  //corresponding to the date
  date: Date;
  euroToMDL: string;
  usdToMDL: string;
};
export class CurrencyRates extends Realm.Object<ICurrencyRates> {
  date?: Date;
  euroToMDL?: string;
  usdToMDL?: string;

  static schema: ObjectSchema = {
    name: "CurrencyRates",
    properties: {
      date: "date?",
      euroToMDL: "string?",
      usdToMDL: "string?",
    },
  };
}
