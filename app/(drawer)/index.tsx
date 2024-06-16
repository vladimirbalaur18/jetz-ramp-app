import { FlatList, ScrollView, View, useColorScheme } from "react-native";
import { Button, Text, FAB, Searchbar, Divider } from "react-native-paper";
import { Drawer } from "expo-router/drawer";

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
import { MaterialCommunityIcons } from "@expo/vector-icons";
dayjs.extend(isToday);

export default function Page() {
  const iconColor = useTheme().colors.text;

  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchVisible, setSearchVisible] = React.useState(false);

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

    flightsArr
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
  }, [flightsArr, searchQuery]);

  //agg flights by date

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
        <Text variant="headlineSmall">No active flights yet</Text>
      </View>
    );
  };

  return (
    <>
      <Drawer.Screen
        options={{
          drawerLabel: "Active flights",
          title: "Active flights",
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
              name="airport"
              size={24}
              color={iconColor}
            />
          ),
        }}
      />
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
              <View key={date + index} style={{ marginVertical: 5 }}>
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
