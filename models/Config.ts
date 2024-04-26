import { Flight } from "@/redux/types";
import Realm, { ObjectSchema } from "realm";

class General extends Realm.Object<{
  VAT: number;
  disbursementPercentage: number;
  conventionalUnit: string;
}> {
  static schema: ObjectSchema = {
    name: "general",
    properties: {
      VAT: { type: "int", default: 20 },
      disbursementPercentage: { type: "int", default: 10 },
      conventionalUnit: { type: "string", default: "EUR" },
    },
  };
}

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

class LoungeFee extends Realm.Object<{
  priceUSDperKG: number;
}> {
  static schema: ObjectSchema = {
    name: "fuelFees",
    properties: {
      priceUSDperKG: { type: "float" },
    },
  };
}

class ConfigModel extends Realm.Object<{ VAT: number }> {
  static schema: ObjectSchema = {
    name: "config",
    properties: {
      VAT: { type: "int" },
      disbursementPercentage: { type: "int" },
    },
  };
}

export default ConfigModel;
