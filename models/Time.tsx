import Realm, { ObjectSchema } from "realm";

export type ITime = { hours: number; minutes: number };
class Time extends Realm.Object<ITime> {
  static schema: ObjectSchema = {
    name: "Time",
    properties: {
      hours: { type: "int" },
      minutes: { type: "int" },
    },
  };
}
export { Time };
