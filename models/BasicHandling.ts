import { Flight } from "@/redux/types";
import Realm, { ObjectSchema } from "realm";
export type BasicHandlingSchema = {
  minMTOW: number;
  maxMTOW: number;
  pricePerLeg: number;
};

class BasicHandling extends Realm.Object<BasicHandlingSchema> {
  minMTOW!: number;
  maxMTOW!: number;
  pricePerLeg!: number;

  static schema: ObjectSchema = {
    name: "BasicHandling",
    properties: {
      minMTOW: { type: "int", default: 0 },
      maxMTOW: { type: "int", default: 0 },
      pricePerLeg: { type: "float", default: 0 },
    },
  };
}

export default BasicHandling;
