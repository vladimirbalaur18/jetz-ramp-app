import Realm, { ObjectSchema } from "realm";
import { Service } from "./Services";

export type IProvidedService = {
  isPriceOverriden: boolean;
  totalPriceOverride?: number;
  quantity?: number;
  isUsed?: boolean;
  notes?: string;
  service: Service;
};

export class ProvidedService extends Realm.Object<IProvidedService> {
  isPriceOverriden!: boolean;
  totalPriceOverride?: number;
  quantity!: number;
  isUsed!: boolean;
  notes?: string;
  service!: Service;

  static schema: ObjectSchema = {
    name: "ProvidedService",
    properties: {
      isPriceOverriden: {
        type: "bool",
        default: false,
      },
      totalPriceOverride: "float?",
      quantity: "int",
      isUsed: {
        type: "bool",
        default: false,
      },
      notes: "string?",
      service: "Service",
    },
  };
}
