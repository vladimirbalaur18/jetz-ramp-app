import { Alert, Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import * as Print from "expo-print";
import { shareAsync, isAvailableAsync } from "expo-sharing";

const printToFile = async ({
  html = "",
  fileName,
  width = undefined,
  height = 900,
}: {
  html: string;
  fileName: string;
  width?: number;
  height?: number;
}) => {
  try {
    const { uri } = await Print.printToFileAsync({ html, height, width });
    if (!uri) {
      alert("There was an error generating the file");
    }

    const pdfName = `${uri.slice(0, uri.lastIndexOf("/") + 1)}${fileName}.pdf`;

    await FileSystem.moveAsync({
      from: uri,
      to: pdfName,
    });
    console.log("File has been saved to:", uri);

    if (Platform.OS === "android") {
      const permissions =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        const base64 = await FileSystem.readAsStringAsync(pdfName, {
          encoding: FileSystem.EncodingType.Base64,
        });
        await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          fileName,
          "application/pdf"
        )
          .then(async (uri) => {
            await FileSystem.writeAsStringAsync(uri, base64, {
              encoding: FileSystem.EncodingType.Base64,
            });
            alert("File saved successfully");
          })
          .catch((e) =>
            Alert.alert("Error saving file", JSON.stringify(e, null, 2))
          );
      } else alert("Cannot save due to lack of permissions");
    } else alert("File cannot be generated. Invalid platform");
  } catch (e) {
    Alert.alert(
      "Unexpected error occured during file generation",
      JSON.stringify(e, null, 2)
    );
  }
};
export default printToFile;
