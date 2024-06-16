import FlightSection from "@/components/FlightSection";
import { IFlight } from "@/models/Flight";
import { RootState } from "@/redux/store";
import reverseObjectProperties from "@/utils/reverseObjectKeys";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { useQuery } from "@realm/react";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import Drawer from "expo-router/drawer";
import React from "react";
import { useMemo } from "react";
import { View, StyleSheet, ScrollView, FlatList } from "react-native";
import { Button, Searchbar, Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
export default function () {
  const completedFlightsArray = useQuery<IFlight>("Flight", (collection) =>
    collection.filtered("status == $0", "Completed")
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const iconColor = useTheme().colors.text;

  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchVisible, setSearchVisible] = React.useState(false);

  let parseFlightsByDate: Record<string, IFlight[]> = useMemo(() => {
    let dateFlightsMap: Record<string, IFlight[]> = {};

    completedFlightsArray
      .filter((f) =>
        searchQuery
          ? f.flightNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.operatorName.toLowerCase().includes(searchQuery.toLowerCase())
          : true
      )
      .forEach((flight: IFlight) => {
        const dateOfFlight = dayjs(flight.arrival?.arrivalDate).format(
          "YYYY-MM-DD"
        );

        if (!dateFlightsMap[dateOfFlight])
          dateFlightsMap[dateOfFlight] = [flight];
        else dateFlightsMap[dateOfFlight].push(flight);
      });

    return dateFlightsMap;
  }, [completedFlightsArray, searchQuery]);
  const EmptyList = () => {
    return (
      <View
        style={{
          flexDirection: "column",
          flex: 1,
          marginTop: "50%",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          opacity: 0.2,
        }}
      >
        <MaterialCommunityIcons name="airport" size={68} color={iconColor} />
        <Text variant="headlineSmall">No completed flights yet</Text>
      </View>
    );
  };

  //agg flights by date
  return (
    <>
      <Drawer.Screen
        options={{
          drawerLabel: "Completed flights",
          unmountOnBlur: true,
          title: "Completed flights",
          headerRight: () => (
            <Button
              onPress={() => setSearchVisible((prev) => !prev)}
              icon="airplane-search"
            >
              Find
            </Button>
          ),
          drawerIcon: () => (
            <MaterialCommunityIcons
              name="tooltip-check-outline"
              size={24}
              color={iconColor}
            />
          ),
        }}
      />
      {searchVisible && (
        <Searchbar
          style={{ marginHorizontal: 10, marginTop: 10 }}
          placeholder="Flight number / Operator"
          onChangeText={setSearchQuery}
          value={searchQuery}
        />
      )}
      {/* <ScrollView contentContainerStyle={styles.wrapper}>
        {Object.entries(
          reverseObjectProperties(parseFlightsByDate, (d1, d2) =>
            dayjs(d1).diff(dayjs(d2))
          )
        ).map(([date, flights], index) => {
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
      </ScrollView> */}
      <FlatList
        // ref={flatListRef}
        ListEmptyComponent={EmptyList}
        data={[
          ...Object.entries(
            reverseObjectProperties(parseFlightsByDate, (d1, d2) =>
              dayjs(d1).diff(dayjs(d2))
            )
          ),
        ]}
        renderItem={({ item }) => {
          const [date, flights] = item;

          return (
            <View key={date} style={{ marginVertical: 5 }}>
              <FlightSection
                key={date}
                dateString={
                  dayjs(date)?.isToday()
                    ? "Today"
                    : dayjs(date).format("MMM DD, YYYY")
                }
                flights={flights}
              />
            </View>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{
          padding: 10,
          gap: 30,
        }}
      />
    </>
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
