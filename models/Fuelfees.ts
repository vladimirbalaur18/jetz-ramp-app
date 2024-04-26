import Realm, { ObjectSchema } from "realm";

export type FuelFeesState = {
  priceUSDperKG: number;
  lastUpdated: Date;
};
export class FuelFees extends Realm.Object<FuelFeesState> {
  priceUSDperKG!: number;
  lastUpdated!: Date;

  static schema: ObjectSchema = {
    name: "FuelFees",
    properties: {
      priceUSDperKG: { type: "float" },
      lastUpdated: { type: "date" },
    },
  };
}
