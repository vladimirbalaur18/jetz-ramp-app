// Import the createSlice API from Redux Toolkit
import { createSlice } from "@reduxjs/toolkit";

type Service = {
  name?: string; //if null, name becomes the type of service
  type: string;
  isDisbursed?: boolean; //disbursed services appear in disbursed section and are amounted + some percentage
  price: number | null;
};

type ComplexService = Omit<Service, "price"> & {
  subtypes: Array<{ key: string; price: number; hasVAT?: boolean }>;
};

interface Configs {
  serviceTypes: string[];
  services: Array<Service | ComplexService>;
  airportFees: any;
  general: {
    VAT: number;
    disbursmentAmountPercentage: number;
    euroToMDL: number;
  };
}

const initialState: Configs = {
  serviceTypes: [
    "Additional services",
    "Basic Handling",
    "Third Party Service Providers",
  ],
  services: [
    // BASIC HANDLING
    {
      name: "Basic Handling",
      type: "Basic Handling",
      isDisbursed: false,
      subtypes: [
        {
          key: "MTOW < 1000",
          price: 24,
          hasVAT: false,
        },
        {
          key: "1000 < MTOW < 1999",
          price: 28,
          hasVAT: false,
        },
        {
          key: "2000 < MTOW < 2999",
          price: 38,
          hasVAT: false,
        },
        {
          key: "3000 < MTOW < 4999",
          price: 80,
          hasVAT: false,
        },
        {
          key: "5000 < MTOW < 14999",
          price: 345,
          hasVAT: false,
        },
        {
          key: "15000 < MTOW < 29999",
          price: 530,
          hasVAT: false,
        },
        {
          key: "30000 < MTOW < 49999",
          price: 720,
          hasVAT: false,
        },
      ],
    },
    // EXPRESS TERMINAL
    {
      name: "Express/VIP Terminal",
      type: "Additional services",
      isDisbursed: true,
      subtypes: [
        {
          key: "Departure",
          price: 1650,
          hasVAT: true,
        },
        {
          key: "Arrival",
          price: 1100,
          hasVAT: true,
        },
        {
          key: "Departure + Arrival",
          price: 2420,
          hasVAT: true,
        },
      ],
    },
    {
      name: "Documents printing and delivery",
      price: 10,
      type: "Additional services",
    },
    {
      name: "Crew transportation on the apron",
      price: 25,
      type: "Additional services",
    },
    {
      name: "Passenger transportation on the apron",
      price: 25,
      type: "Additional services",
    },
    {
      name: "Landing permit",
      price: 30,
      type: "Additional services",
    },
    {
      name: "GPU (up to 30min)",
      price: 75,
      type: "Additional services",
    },
    {
      name: "Toilet service",
      price: 50,
      type: "Additional services",
    },
    {
      name: "Water service",
      price: 50,
      type: "Additional services",
    },
    {
      name: "Dishwashing",
      price: 50,
      type: "Additional services",
    },
    {
      name: "Laundry",
      price: 50,
      type: "Additional services",
    },
    {
      name: "Meet and assist",
      price: 20,
      type: "Additional services",
    },
    {
      name: "Hotel transportation",
      price: 45,
      type: "Additional services",
    },
    {
      name: "Airport fees",
      price: null,
      type: "Third Party Service Providers",
      isDisbursed: true,
    },
    {
      name: "Catering",

      price: 0,
      type: "Third Party Service Providers",
      isDisbursed: true,
    },
    {
      name: "Fuel",

      price: 0,
      type: "Third Party Service Providers",
      isDisbursed: true,
    },
    {
      name: "HOTAC",

      price: 28,
      type: "Third Party Service Providers",
      isDisbursed: true,
    },
  ],
  airportFees: {
    commercial: {
      landingFee: {
        perTon: 3.5,
      },
      takeoffFee: {
        perTon: 3.5,
      },
      passengerFee: {
        perPax: 8.7,
      },
      securityFee: {
        perPax: 2.5,
        perTon: 0.3,
      },
      parkingDay: {
        perTon: 1.71, //depends on diff between arr-dep and MTOW
      },
    },
    nonCommercial: {
      landingFee: {
        perTon: 3.5,
        lightAircraft: 1,
        winterPeriodQuotaPercentage: 20, //winter, between 18:00 - 07:00
        summerPeriodQuotaPercentage: 20, //summer between 20:00 - 06:00
      },
      takeoffFee: {
        perTon: 3.5,
        lightAircraft: 1,

        winterPeriodQuotaPercentage: 20,
        summerPeriodQuotaPercentage: 20,
      },
      passengerFee: {
        perPax: 8.7,
      },
      securityFee: {
        perPax: 2.5,
        perTon: 7.5, //if no pax
      },
      parkingDay: {
        perTon: 1.71, //depends on diff between arr-dep and MTOW
      },
    },
  },
  general: {
    VAT: 20,
    disbursmentAmountPercentage: 10,
    euroToMDL: 19.145,
  },
};

export const configSlice = createSlice({
  name: "configs",
  initialState: initialState,
  reducers: {},
});

export const {} = configSlice.actions;

export default configSlice.reducer;
