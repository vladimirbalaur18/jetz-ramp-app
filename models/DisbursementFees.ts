import Realm, { ObjectSchema } from "realm";

export type IDisbursementFees = {
  airportFee: number;
  fuelFee: number;
  cateringFee: number;
  HOTACFee: number;
  VIPLoungeFee: number;
};

export class DisbursementFees extends Realm.Object<IDisbursementFees> {
  airportFee!: number;
  fuelFee!: number;
  cateringFee!: number;
  HOTACFee!: number;
  VIPLoungeFee!: number;

  static schema: ObjectSchema = {
    name: "DisbursementFees",
    properties: {
      airportFee: "float",
      fuelFee: "float",
      cateringFee: "float",
      HOTACFee: "float",
      VIPLoungeFee: "float",
    },
  };
}
