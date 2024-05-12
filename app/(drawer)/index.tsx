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
import { RootState } from "@/redux/store";
import { removeCurrentFlightById } from "@/redux/slices/flightsSlice";
import FlightSection from "@/components/FlightSection";
import { IFlight } from "@/models/Flight";
import { useQuery } from "@realm/react";
import reverseObjectProperties from "@/utils/reverseObjectKeys";
dayjs.extend(isToday);

export default function Page() {
  // const flightsArr = useSelector((state: RootState) =>
  //   state.flights.flightsArray.filter((f) => f?.status !== "Completed")
  // );

  const flightsArr = useQuery<IFlight>("Flight", (collection) =>
    collection.filtered("status != $0", "Completed")
  );
  const theme = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();

  let parseFlightsByDate: Record<string, IFlight[]> = useMemo(() => {
    let dateFlightsMap: Record<string, IFlight[]> = {};

    flightsArr.forEach((flight: IFlight) => {
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
    <>
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
      <View>
        <ScrollView contentContainerStyle={styles.wrapper}>
          {Object.entries(
            reverseObjectProperties(parseFlightsByDate, (d1, d2) =>
              dayjs(d1).diff(dayjs(d2))
            )
          ).map(([date, flights], index) => {
            return (
              <View style={{ marginVertical: 15 }}>
                <FlightSection
                  key={date + index}
                  dateString={
                    dayjs(date)?.isToday()
                      ? "Today"
                      : dayjs(date).format("MMM DD, YYYY")
                  }
                  flights={flights}
                />
              </View>
            );
          })}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    zIndex: 999,
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
    flexDirection: "column",
    padding: 10,
    gap: 30,
    alignItems: "flex-start",
  },

  newFlightIcon: {
    alignItems: "flex-end",
    flexDirection: "column",
  },
});
