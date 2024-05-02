import Realm, { ObjectSchema } from "realm";
import { IFeeTotal } from "./FeeTotal";
import { IFuel } from "./Fuel";

export type ISupportServices = {
  airportFee: IFeeTotal;
  fuel: IFuel;
  catering: IFeeTotal;
  HOTAC: IFeeTotal;
};
export class SupportServices extends Realm.Object<SupportServices> {
  airportFee!: IFeeTotal;
  fuel!: IFuel;
  catering!: IFeeTotal;
  HOTAC!: IFeeTotal;

  static schema: ObjectSchema = {
    name: "SupportServices",
    properties: {
      airportFee: { type: "object", objectType: "FeeTotal" },
      fuel: { type: "object", objectType: "FeeTotal" },
      catering: { type: "object", objectType: "FeeTotal" },
      HOTAC: { type: "object", objectType: "FeeTotal" },
    },
  };
}
