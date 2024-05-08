import Realm, { ObjectSchema } from "realm";
import { Service } from "./Services";

export type IServiceCategory = {
  categoryName: string;
  _id: Realm.BSON.ObjectId;
  services: Realm.List<Service>;
};
export class ServiceCategory extends Realm.Object<IServiceCategory> {
  categoryName!: string;
  _id!: Realm.BSON.ObjectId;
  services!: Realm.List<Service>;

  static schema: ObjectSchema = {
    name: "ServiceCategory",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      categoryName: "string",
      services: "Service[]",
    },
  };
}
