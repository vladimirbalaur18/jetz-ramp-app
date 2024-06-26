import Realm, { ObjectSchema } from "realm";
export type GeneralConfigState = {
  VAT: number;
  conventionalUnit: string;
  defaultAirport: string;
};

class General extends Realm.Object<GeneralConfigState> {
  static schema: ObjectSchema = {
    name: "General",
    properties: {
      VAT: { type: "int", default: 20 },
      conventionalUnit: { type: "string", default: "EUR" },
      defaultAirport: { type: "string" },
    },
  };
}

export default General;
