import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";

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
  const { uri } = await Print.printToFileAsync({ html, height, width });

  const pdfName = `${uri.slice(0, uri.lastIndexOf("/") + 1)}${fileName}.pdf`;

  // Rename the file
  await FileSystem.moveAsync({
    from: uri,
    to: pdfName,
  });
  console.log("File has been saved to:", uri);

  try {
    const contentUri = await FileSystem.getContentUriAsync(pdfName);
    if (Platform.OS === "ios") {
      await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
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
};
export default printToFile;
