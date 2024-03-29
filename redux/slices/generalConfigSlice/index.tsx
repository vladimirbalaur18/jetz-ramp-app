// Import the createSlice API from Redux Toolkit
import { Flight } from "@/redux/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import uuid from "react-native-uuid";
import { createAsyncThunk } from "@reduxjs/toolkit";
import GeneralConfigs from "@/configs/general.json";
export const initializeConfigsAsync = createAsyncThunk(
  "/general/fetchConfigs",
  () => {
    //get configs
    return GeneralConfigs;
  }
);
type GeneralConfigState = {
  VAT: number;
  disbursementPercentage: number;
  euroToMDL: number | null;
  conventionalUnit: "euro" | "MDL";
  fuelPricePerTon: number;
  defaultAirport: string;
};

const initialState: GeneralConfigState = {
  VAT: 0,
  disbursementPercentage: 0,
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
      state = payload as any;
    });
  },
});

// We export the reducer function so that it can be added to the store
export default generalConfigSlice.reducer;
