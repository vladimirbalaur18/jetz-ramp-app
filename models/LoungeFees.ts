import Realm, { ObjectSchema } from "realm";

export type IPrice = {
  amount: number;
  currency: string;
}

export type IDepartureArrival  ={
  pricePerAdult: Price;
  pricePerMinor: Price;
}

export class DepartureArrival extends Realm.Object {
  pricePerAdult!: Price;
  pricePerMinor!: Price;
  static schema: ObjectSchema = {
    name: "DepartureArrival",
    properties: {
      pricePerAdult: { type: "object", objectType: "Price" },
      pricePerMinor: { type: "object", objectType: "Price" },
    },
  };
}

export type ILoungeFee = {
  departure: IDepartureArrival;
  arrival: IDepartureArrival;
}
export class LoungeFee extends Realm.Object {
  departure!: DepartureArrival;
  arrival!: DepartureArrival;

  static schema: ObjectSchema = {
    name: "LoungeFees",
    properties: {
      departure: { type: "object", objectType: "DepartureArrival" },
      arrival: { type: "object", objectType: "DepartureArrival" },
    },
  };
}
export class Price extends Realm.Object {
  amount!: number;
  currency!: string;

  static schema: ObjectSchema = {
    name: "Price",
    properties: {
      amount: { type: "int" },
      currency: { type: "string" },
    },
  };
}
