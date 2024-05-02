import FlightSection from "@/components/FlightSection";
import { IFlight } from "@/models/Flight";
import { RootState } from "@/redux/store";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
export default function () {
  const completedFlightsArray = useSelector((state: RootState) =>
    state.flights.flightsArray.filter((f) => f?.status === "Completed")
  );
  const theme = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();

  let parseFlightsByDate: Record<string, IFlight[]> = useMemo(() => {
    let dateFlightsMap: Record<string, IFlight[]> = {};

    completedFlightsArray.forEach((flight: IFlight) => {
      const dateOfFlight = dayjs(flight.arrival?.arrivalDate).format(
        "YYYY-MM-DD"
      );

      if (!dateFlightsMap[dateOfFlight])
        dateFlightsMap[dateOfFlight] = [flight];
      else dateFlightsMap[dateOfFlight].push(flight);
    });

    return dateFlightsMap;
  }, [completedFlightsArray]);

  //agg flights by date
  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      {Object.entries(parseFlightsByDate).map(([date, flights], index) => {
        return (
          <FlightSection
            key={date + index}
            dateString={
              dayjs(date)?.isToday()
                ? "Today"
                : dayjs(date).format("MMM DD, YYYY")
            }
            flights={flights}
          />
        );
      })}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 10,
    bottom: 20,
  },
  verticalContainer: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    width: "100%",
    gap: 10,
  },

  horizontalContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    gap: 10,
  },
  wrapper: {
    display: "flex",
    flexWrap: "wrap",
    width: "100%",
    height: "100%",
    flex: 1,
    flexDirection: "column",
    padding: 10,
    gap: 30,
  },

  newFlightIcon: {
    alignItems: "flex-end",
    flexDirection: "column",
  },
});
