import { IFlight } from "@/redux/types";
import Realm, { BSON, ObjectSchema } from "realm";
import { Price } from "./LoungeFees";

export type IService = {
  serviceId?: string;
  serviceName: string;
  hasVAT: boolean;
  isDisbursed?: boolean;
  pricing: {
    amount: number;
    currency: string;
  };
  isPriceOverriden: boolean;
  totalPriceOverride?: number;
  quantity?: number;
  notes?: string;
  isUsed?: boolean;
};
export type ServiceCategorySchema = {
  serviceCategoryName: string;
  services: IService[];
};

export class Service extends Realm.Object<IService> {
  serviceName!: string;
  hasVAT!: boolean;
  isDisbursed?: boolean;
  pricing!: Price;
  serviceId!: string;
  isPriceOverriden!: boolean;

  static schema: ObjectSchema = {
    name: "Service",
    primaryKey: "serviceId",
    properties: {
      serviceId: { type: "string", optional: false },
      serviceName: { type: "string" },
      hasVAT: { type: "bool" },
      isDisbursed: "bool?",
      pricing: { type: "object", objectType: "Price" },
      isPriceOverriden: { type: "bool", default: false },
      totalPriceOverride: { type: "float", optional: true },
      quantity: "int?",
      notes: "string?",
      isUsed: "bool?",
    },
  };
}

export class Services extends Realm.Object<ServiceCategorySchema> {
  serviceCategoryName!: string;
  services!: Service[];

  static schema: ObjectSchema = {
    name: "Services",
    properties: {
      serviceCategoryName: { type: "string" },
      services: { type: "list", objectType: "Service" },
    },
  };
}
export default Services;
