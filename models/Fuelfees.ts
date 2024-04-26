import Realm, { ObjectSchema } from "realm";

class FuelFees extends Realm.Object<{
  priceUSDperKG: number;
}> {
  static schema: ObjectSchema = {
    name: "fuelFees",
    properties: {
      priceUSDperKG: { type: "float" },
    },
  };
}
