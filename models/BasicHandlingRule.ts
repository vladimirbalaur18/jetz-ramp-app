import { IFlight } from "@/redux/types";
import Realm, { ObjectSchema } from "realm";
export type IBasicHandlingRule = {
  minMTOW: number;
  maxMTOW: number;
  pricePerLeg: number;
};

class BasicHandlingRule extends Realm.Object<IBasicHandlingRule> {
  minMTOW!: number;
  maxMTOW!: number;
  pricePerLeg!: number;

  static schema: ObjectSchema = {
    name: "BasicHandlingRule",
    properties: {
      minMTOW: { type: "int", default: 0 },
      maxMTOW: { type: "int", default: 0 },
      pricePerLeg: { type: "float", default: 0 },
    },
  };
}

export default BasicHandlingRule;
