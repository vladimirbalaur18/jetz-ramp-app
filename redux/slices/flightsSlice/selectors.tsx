import { RootState } from "@/redux/store";
import { createSelector } from "@reduxjs/toolkit";

const selectCurrentFlightId = (state: RootState) =>
  state.flights?.currentFlight;
const selectAllFlights = (state: RootState) => state.flights.flightsArray;

export const getCurrentFlight = createSelector(
  [selectCurrentFlightId, selectAllFlights],
  (currentFlightId, allFlights) => {
    return allFlights?.find((f) => f?.flightId === currentFlightId);
  }
);
