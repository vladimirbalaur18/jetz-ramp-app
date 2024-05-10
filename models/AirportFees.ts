import Realm, { ObjectSchema } from "realm";
import { IAirportFeeDefinition } from "./AirportFeeDefinition";

export class AirportFees extends Realm.Object<IAirportFees> {
  commercial!: IAirportFeeDefinition;
  nonCommercial!: IAirportFeeDefinition;

  static schema: ObjectSchema = {
    name: "AirportFees",
    properties: {
      commercial: "AirportFeeDefinition",
      nonCommercial: "AirportFeeDefinition",
    },
  };
}
export type IAirportFees = {
  commercial: IAirportFeeDefinition;
  nonCommercial: IAirportFeeDefinition;
};
