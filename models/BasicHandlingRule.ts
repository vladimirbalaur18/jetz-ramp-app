import Realm, { ObjectSchema } from "realm";
export type IBasicHandlingRule = {
  minMTOW: number;
  maxMTOW: number;
  pricePerLeg: number;
  notes: string;
};

class BasicHandlingRule extends Realm.Object<IBasicHandlingRule> {
  minMTOW!: number;
  maxMTOW!: number;
  pricePerLeg!: number;
  notes!: string;

  static schema: ObjectSchema = {
    name: "BasicHandlingRule",
    properties: {
      minMTOW: { type: "int", default: 0 },
      maxMTOW: { type: "int", default: 0 },
      pricePerLeg: { type: "float", default: 0 },
      notes: {
        type: "string",
        optional: true,
        default: "",
      },
    },
  };
}

export default BasicHandlingRule;
