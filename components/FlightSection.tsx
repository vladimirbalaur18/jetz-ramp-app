import { IFlight } from "@/redux/types";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import FlightItem from "./FlightItem";
const FlightSection: React.FC<{
  dateString: string;
  flights: IFlight[];
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
export default FlightSection;
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
