import { IFlight } from "@/models/Flight";
import { RootState } from "@/redux/store";
import { createSelector } from "@reduxjs/toolkit";

const selectCurrentFlightId = (state: RootState) =>
  state.flights?.currentFlightId;
const selectAllFlights = (state: RootState) => state.flights.flightsArray;

export const selectCurrentFlight = createSelector(
  [selectCurrentFlightId, selectAllFlights],
  (currentFlightId, allFlights) => {
    return allFlights.find((f) => f?.flightId === currentFlightId) as IFlight;
  }
);
