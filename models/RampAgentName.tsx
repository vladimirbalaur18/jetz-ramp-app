import Realm, { ObjectSchema } from "realm";

export type IRampAgent = {
  fullname: string;
};
export class RampAgent extends Realm.Object<IRampAgent> {
  fullname!: string;

  static schema: ObjectSchema = {
    name: "RampAgent",
    properties: {
      fullname: { type: "string" },
    },
  };
}
