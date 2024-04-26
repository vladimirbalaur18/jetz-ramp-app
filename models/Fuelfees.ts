import Realm, { ObjectSchema } from "realm";

export type FuelFeesState = {
  priceUSDperKG: number;
};
export class FuelFees extends Realm.Object<FuelFeesState> {
  priceUSDperKG!: number;

  static schema: ObjectSchema = {
    name: "FuelFees",
    properties: {
      priceUSDperKG: { type: "float" },
    },
  };
}
