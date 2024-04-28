import { Flight } from "@/redux/types";
import Realm, { ObjectSchema } from "realm";
import { Price } from "./LoungeFees";

export type ServiceSchema = {
  serviceName: string;
  hasVAT: boolean;
  isDisbursed: boolean;
  pricing: {
    amount: number;
    currency: string;
  };
};
export type ServicesSchema = {
  serviceCategoryName: string;
  services: ServiceSchema[];
};

export class Service extends Realm.Object<ServiceSchema> {
  serviceName!: string;
  hasVAT!: boolean;
  isDisbursed!: boolean;
  pricing!: Price;

  static schema: ObjectSchema = {
    name: "Service",
    properties: {
      serviceName: { type: "string" },
      hasVAT: { type: "bool" },
      isDisbursed: { type: "bool" },
      pricing: { type: "object", objectType: "Price" },
    },
  };
}

export class Services extends Realm.Object<ServicesSchema> {
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
