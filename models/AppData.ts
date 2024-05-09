import Realm, { ObjectSchema } from "realm";

export class AppData extends Realm.Object<IAppData> {
  schemaCreationDate!: Date;
  masterPassword!: string;

  static schema: ObjectSchema = {
    name: "AppData",
    properties: {
      schemaCreationDate: "date",
      masterPassword: "string",
    },
  };
}
export type IAppData = {
  schemaCreationDate: Date;
  masterPassword: string;
};
