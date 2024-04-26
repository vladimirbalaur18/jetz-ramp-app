import { Flight } from "@/redux/types";
import Realm, { ObjectSchema } from "realm";
export type GeneralConfigState = {
  VAT: number;
  disbursementPercentage: number;
  conventionalUnit: string;
  defaultAirport: string;
};

class General extends Realm.Object<GeneralConfigState> {
  static schema: ObjectSchema = {
    name: "General",
    properties: {
      VAT: { type: "int", default: 20 },
      disbursementPercentage: { type: "int", default: 10 },
      conventionalUnit: { type: "string", default: "EUR" },
      defaultAirport: { type: "string" },
    },
  };
}

export default General;
