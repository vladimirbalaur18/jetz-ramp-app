import Realm, { ObjectSchema } from "realm";
import { ICurrencyRates } from "./CurrencyRates";

export type IChargeNoteDetails = {
  date: Date;
  billingTo: string;
  remarks: string;
  paymentType: string;
  currency: ICurrencyRates;
};

export class ChargeNoteDetails extends Realm.Object<IChargeNoteDetails> {
  date!: Date;
  billingTo!: string;
  remarks!: string;
  paymentType!: string;
  currency!: ICurrencyRates;

  static schema: ObjectSchema = {
    name: "ChargeNoteDetails",
    properties: {
      date: "date?",
      billingTo: "string?",
      remarks: "string?",
      paymentType: "string?",
      currency: {
        type: "object",
        objectType: "CurrencyRates",
      },
    },
  };
}
