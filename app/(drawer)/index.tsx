import { Button, ScrollView, View, useColorScheme } from "react-native";
import { Text, FAB } from "react-native-paper";
import React, { useContext } from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import { StyleSheet } from "react-native";
import FlightItem from "@/components/FlightItem";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useAppTheme } from "react-native-paper/src/core/theming";
dayjs.extend(isToday);
//@ts-ignore

const FlightSection = ({ dateString, flights }) => {
  return (
    <View style={styles.verticalContainer}>
      <Text variant="titleMedium">{dateString}</Text>
      <View style={styles.horizontalContainer}>
        {
          //@ts-ignore
          flights?.map((flight) => {
            return <FlightItem callsign={flight?.callsign} />;
          })
        }
      </View>
    </View>
  );
};

export default function Page() {
  //@ts-ignore"

  const flightsArr = useSelector((state) => state.flights.flightsArray);
  const theme = useTheme();

  const router = useRouter();
  let parseFlightsByDate = {};

  //agg flights by date
  //@ts-ignore

  flightsArr.forEach((flight) => {
    //@ts-ignore"

    const date = dayjs(flight.date).format();
    //@ts-ignore
    if (!parseFlightsByDate[date]) {
      //@ts-ignore

      parseFlightsByDate[date] = [flight];
      //@ts-ignore
    } else parseFlightsByDate[date].push(flight);
  });

  console.log(parseFlightsByDate);
  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      {/* <Text variant="headlineMedium">Active flights</Text> */}
      <FAB
        icon="plus"
        color={theme.colors.text}
        style={{ ...styles.fab }}
        variant="secondary"
        label="Create a new flight"
        onPress={() => router.navigate("/createFlight")}
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
