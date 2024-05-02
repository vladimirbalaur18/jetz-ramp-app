import Realm, { ObjectSchema } from "realm";

export type IFuel = {
  fuelLitersQuantity: number;
  fuelDensity: number;
};

export class Fuel extends Realm.Object<IFuel> {
  fuelLitersQuantity!: number;
  fuelDensity!: number;

  static schema: ObjectSchema = {
    name: "Fuel",
    properties: {
      fuelLitersQuantity: "float",
      fuelDensity: "float",
    },
  };
}
