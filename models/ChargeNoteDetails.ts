import Realm, { ObjectSchema } from "realm";
import { ICurrencyRates } from "./CurrencyRates";

export type IChargeNoteDetails = {
  date: Date;
  billingTo: string;
  remarks: string;
  paymentType: string;
  currency: ICurrencyRates;
  disbursementPercentage:number;
};

export class ChargeNoteDetails extends Realm.Object<IChargeNoteDetails> {
  date!: Date;
  billingTo!: string;
  remarks!: string;
  paymentType!: string;
  currency!: ICurrencyRates;
  disursedPercentage!:number;

  static schema: ObjectSchema = {
    name: "ChargeNoteDetails",
    properties: {
      date: "date?",
      billingTo: "string?",
      remarks: "string?",
      paymentType: "string?",
      disbursementPercentage:"int",
      currency: {
        type: "object",
        objectType: "CurrencyRates",
      },
    },
  };
}
