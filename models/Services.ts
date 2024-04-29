import { Flight } from "@/redux/types";
import Realm, { BSON, ObjectSchema } from "realm";
import { Price } from "./LoungeFees";

export type ServiceSchema = {
  serviceId?: string;
  serviceName: string;
  hasVAT: boolean;
  isDisbursed: boolean;
  pricing: {
    amount: number;
    currency: string;
  };
};
export type ProvidedServicesSchema = {
  serviceCategoryName: string;
  services: ServiceSchema[];
};

export class Service extends Realm.Object<ServiceSchema> {
  serviceName!: string;
  hasVAT!: boolean;
  isDisbursed!: boolean;
  pricing!: Price;
  serviceId!: string;

  static schema: ObjectSchema = {
    name: "Service",
    primaryKey: "serviceId",
    properties: {
      serviceId: { type: "string", optional: false },
      serviceName: { type: "string" },
      hasVAT: { type: "bool" },
      isDisbursed: { type: "bool" },
      pricing: { type: "object", objectType: "Price" },
    },
  };
}

export class ProvidedServices extends Realm.Object<ProvidedServicesSchema> {
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
export default ProvidedServices;
