import Realm, { ObjectSchema } from "realm";

export type IFeeTotal = {
  total: number;
};
export class FeeTotal extends Realm.Object<IFeeTotal> {
  total!: number;

  static schema: ObjectSchema = {
    name: "FeeTotal",
    properties: {
      total: "float",
    },
  };
}
