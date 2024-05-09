import Realm, { ObjectSchema } from "realm";
import { ServiceCategory } from "./ServiceCategory";

export type IService = {
  serviceName: string;
  hasVAT: boolean;
  categoryName: string;
  isDisbursed?: boolean;
  price: number;
  _id: Realm.BSON.ObjectId;
};

export class Service extends Realm.Object<IService> {
  serviceName!: string;
  hasVAT!: boolean;
  categoryName!: string;
  isDisbursed?: boolean;
  price!: number;
  _id!: Realm.BSON.ObjectId;

  static schema: ObjectSchema = {
    name: "Service",
    primaryKey: "_id",
    properties: {
      serviceName: "string",
      hasVAT: { type: "bool", default: false },
      categoryName: "string",
      isDisbursed: { type: "bool", default: false },
      price: { type: "float", default: 0 },
      _id: "objectId",
    },
  };
}
