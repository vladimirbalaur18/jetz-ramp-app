import { Arrival, Departure, FlightSchedule, Payment } from "@/redux/types";
import { Dayjs } from "dayjs";

export type Flight = {
  operatorName: string;
  flightNumber: string;
  schedule: FlightSchedule;
  payment: Payment;
  orderingCompanyName: string;
  aircraftType: string;
  aircraftRegistration: string;
  arrival: Arrival;
  departure: Departure;
  invoiceDate: Dayjs;
  route: unknown;
  mtow: number;
  parkingPosition: string;
  // chargeNote: Charges;
  number;
};
