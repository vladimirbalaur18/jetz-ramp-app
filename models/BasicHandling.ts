import Realm, { ObjectSchema } from "realm";

export type IBasicHandling = {
  total: number | string;
  isPriceOverriden?: boolean;
};

export class BasicHandling extends Realm.Object<IBasicHandling> {
  total!: number;
  isPriceOverriden?: boolean;

  static schema: ObjectSchema = {
    name: "BasicHandling",
    properties: {
      total: "float",
      isPriceOverriden: "bool?",
    },
  };
}
