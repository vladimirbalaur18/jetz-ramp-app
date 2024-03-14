import { Arrival, Departure, FlightSchedule, Payment } from "@/redux/types";
import { Dayjs } from "dayjs";

export type Flight = {
  operatorName: string;
  flightNumber: string;
  scheduleType?: FlightSchedule;
  payment?: Payment;
  orderingCompanyName?: string;
  aircraftType?: string;
  aircraftRegistration?: string;
  arrival?: Arrival;
  departure?: Departure;
  invoiceDate?: Date;
  mtow?: number;
  parkingPosition?: string | number;
  providedServices: ProvidedServices;
  // chargeNote: Charges;
};

export type Service = {
  serviceName: string;
  quantity: number;
  notes: string;
};
export type ServiceType = {
  serviceTypeName: string;
  services: Service;
};
export type ProvidedServices = Array<ServiceType>;
