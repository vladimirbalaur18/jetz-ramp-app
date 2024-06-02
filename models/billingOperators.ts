import Realm, { BSON, ObjectSchema } from "realm";

export type IBillingOperator = {
  _id: BSON.ObjectId;
  operatorName: string;
  billingInfo: string;
};

export class BillingOperator extends Realm.Object<IBillingOperator> {
  _id!: Realm.BSON.ObjectId;
  operatorName!: string;
  billingInfo!: string;

  static schema: ObjectSchema = {
    name: "BillingOperator",
    primaryKey: "_id",
    properties: {
      operatorName: "string",
      billingInfo: "string",
      _id: "objectId",
    },
  };
}
