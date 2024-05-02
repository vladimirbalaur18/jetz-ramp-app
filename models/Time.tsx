import Realm, { ObjectSchema } from "realm";

class Time extends Realm.Object<{ hours: number; minutes: number }> {
  static schema: ObjectSchema = {
    name: "Time",
    properties: {
      hours: { type: "int" },
      minutes: { type: "int" },
    },
  };
}
export { Time };
