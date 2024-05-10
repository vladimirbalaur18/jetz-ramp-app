import Realm, { ObjectSchema } from "realm";
import { IFeeQuota } from "./FeeQuota";

export class AirportFeeDefinition extends Realm.Object<IAirportFeeDefinition> {
  landingFee!: IFeeQuota;
  takeoffFee!: IFeeQuota;
  passengerFee!: IFeeQuota;
  securityFee!: IFeeQuota;
  parkingDay!: IFeeQuota;

  static schema: ObjectSchema = {
    name: "AirportFeeDefinition",
    properties: {
      landingFee: "FeeQuota",
      takeoffFee: "FeeQuota",
      passengerFee: "FeeQuota",
      securityFee: "FeeQuota",
      parkingDay: "FeeQuota",
    },
  };
}
export type IAirportFeeDefinition = {
  landingFee: IFeeQuota;
  takeoffFee: IFeeQuota;
  passengerFee: IFeeQuota;
  securityFee: IFeeQuota;
  parkingDay: IFeeQuota;
};
