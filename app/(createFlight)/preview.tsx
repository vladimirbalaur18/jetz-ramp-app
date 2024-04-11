import * as React from "react";
import {
  View,
  StyleSheet,
  Button,
  Platform,
  Text,
  Linking,
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import chargeNoteTemplateHTML from "@/utils/chargeNoteTemplate";
import { useSelector } from "react-redux";
import { selectCurrentFlight } from "@/redux/slices/flightsSlice/selectors";
import { RootState } from "@/redux/store";

export default function App() {
  const [selectedPrinter, setSelectedPrinter] = React.useState<any>();
  const state = useSelector((state: RootState) => state);
  const existingFlight = selectCurrentFlight(state);

  const printToFile = async (html: string) => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    const { uri } = await Print.printToFileAsync({ html, height: 892 });
    console.log("File has been saved to:", uri);

    try {
      const contentUri = await FileSystem.getContentUriAsync(uri);
      if (Platform.OS === "ios") {
        await shareAsync(contentUri);
      } else {
        await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
          data: contentUri,
          flags: 1,
          type: "application/pdf",
        });
      }
    } catch (e) {
      console.error(e);
    }

    // await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
  };

  const selectPrinter = async () => {
    const printer = await Print.selectPrinterAsync(); // iOS only
    setSelectedPrinter(printer);
  };

  return (
    <View style={styles.container}>
      <View style={styles.spacer} />
      <Button
        title="Generate charge note"
        onPress={() => printToFile(chargeNoteTemplateHTML(existingFlight))}
      />
      <Button
        title="Generate something else"
        onPress={() => printToFile(`<h1>hehe</h1>`)}
      />
      {Platform.OS === "ios" && (
        <>
          <View style={styles.spacer} />
          <Button title="Select printer" onPress={selectPrinter} />
          <View style={styles.spacer} />
          {selectedPrinter ? (
            <Text
              style={styles.printer}
            >{`Selected printer: ${selectedPrinter.name}`}</Text>
          ) : undefined}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    flexDirection: "column",
    padding: 8,
  },
  spacer: {
    height: 8,
  },
  printer: {
    textAlign: "center",
  },
});
