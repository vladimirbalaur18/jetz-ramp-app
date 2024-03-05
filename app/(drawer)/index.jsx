import { ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import React from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import { StyleSheet } from "react-native";
dayjs.extend(isToday);

const FlightSection = ({ dateString, flights }) => {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">{dateString}</Text>
      {flights?.map((flight) => {
        return <Text>{flight?.callsign}</Text>;
      })}
    </View>
  );
};

export default function Page() {
  const flightsArr = useSelector((state) => state.flights.flightsArray);

  let parseFlightsByDate = {};

  //agg flights by date
  flightsArr.forEach((flight) => {
    const date = dayjs(flight.date).format();
    if (!parseFlightsByDate[date]) {
      parseFlightsByDate[date] = [flight];
    } else parseFlightsByDate[date].push(flight);
  });

  console.log(parseFlightsByDate);
  return (
    <ScrollView>
      <Text variant="headlineMedium">Active flights</Text>
      {Object.entries(parseFlightsByDate).map(([date, flights]) => {
        return (
          <FlightSection
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
  container: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    gap: 10,
  },
});
