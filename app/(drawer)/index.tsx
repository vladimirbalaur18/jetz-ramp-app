import { Button, ScrollView, View, useColorScheme } from "react-native";
import { Text, FAB } from "react-native-paper";
import React, { useContext, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import { StyleSheet } from "react-native";
import FlightItem from "@/components/FlightItem";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useAppTheme } from "react-native-paper/src/core/theming";
import { Flight } from "@/redux/types";
import { RootState } from "@/redux/store";
import { removeCurrentFlightById } from "@/redux/slices/flightsSlice";
dayjs.extend(isToday);

const FlightSection: React.FC<{
  dateString: string;
  flights: Flight[];
}> = ({ dateString, flights }) => {
  return (
    <View style={styles.verticalContainer}>
      <Text variant="titleMedium">{dateString}</Text>
      <View style={styles.horizontalContainer}>
        {flights?.map((flight) => {
          return <FlightItem flight={flight} />;
        })}
      </View>
    </View>
  );
};

export default function Page() {
  const { flightsArray: flightsArr, currentFlightId } = useSelector(
    (state: RootState) => state.flights
  );
  const theme = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();

  let parseFlightsByDate: Record<string, Flight[]> = useMemo(() => {
    let dateFlightsMap: Record<string, Flight[]> = {};

    flightsArr.forEach((flight: Flight) => {
      const dateOfFlight = dayjs(flight.arrival?.arrivalDate).format(
        "YYYY-MM-DD"
      );

      if (!dateFlightsMap[dateOfFlight])
        dateFlightsMap[dateOfFlight] = [flight];
      else dateFlightsMap[dateOfFlight].push(flight);
    });

    return dateFlightsMap;
  }, [flightsArr]);

  //agg flights by date

  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <FAB
        icon="plus"
        color={theme.colors.text}
        style={{ ...styles.fab }}
        variant="secondary"
        label="Create a new flight"
        onPress={() => {
          //clear leftover flight
          dispatch(removeCurrentFlightById());
          router.navigate("/(createFlight)/general");
        }}
      />
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
