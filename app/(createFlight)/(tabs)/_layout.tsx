import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentFlight } from "@/redux/slices/flightsSlice/selectors";
import { AppDispatch, RootState } from "@/redux/store";
import { MaterialCommunityIcons } from "@expo/vector-icons";
export { ErrorBoundary } from "expo-router";

export default function TabLayout() {
  const dispatch = useDispatch<AppDispatch>();
  const currentFlightNumber = selectCurrentFlight(
    useSelector((state: RootState) => state)
  )?.flightNumber;
  const FlightNumberIndicator = currentFlightNumber
    ? `(${currentFlightNumber})`
    : "";

  return (
    <Tabs>
      <Tabs.Screen
        name="chargeNote"
        options={{
          title: `Charge Note ${FlightNumberIndicator}`,
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="clipboard-list"
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="depArr"
        options={{
          title: "Dep & Arr",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="airport" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="rampCheck"
        options={{
          title: "Ramp checklist",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="format-list-checks"
              size={28}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
