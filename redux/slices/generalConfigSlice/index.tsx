// Import the createSlice API from Redux Toolkit
import { Flight } from "@/redux/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import uuid from "react-native-uuid";
import { createAsyncThunk } from "@reduxjs/toolkit";
import GeneralConfigs from "@/configs/general.json";
export const initializeConfigsAsync = createAsyncThunk(
  "/general/fetchConfigs",
  async () => {
    //get configs
    return { ...GeneralConfigs };
  }
);
type GeneralConfigState = {
  VAT: number;
  disbursementPercentage: number;
  euroToMDL: number | null;
  conventionalUnit: string;
  fuelPricePerTon: string | number;
  defaultAirport: string;
};

const initialState: GeneralConfigState = {
  VAT: 20,
  disbursementPercentage: 10,
  euroToMDL: null,
  conventionalUnit: "euro",
  fuelPricePerTon: 0,
  defaultAirport: "LUKK",
};

export const generalConfigSlice = createSlice({
  name: "generalConfig",
  initialState: initialState,
  reducers: {
    // initializeConfig: (state, { payload }) => {
    //   return payload;
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(initializeConfigsAsync.fulfilled, (state, { payload }) => {
      state = { ...payload };
      console.log("payload", payload);
    });
  },
});

// We export the reducer function so that it can be added to the store
export default generalConfigSlice.reducer;
