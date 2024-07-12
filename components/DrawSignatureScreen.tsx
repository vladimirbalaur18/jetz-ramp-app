import React, { useRef } from "react";
import { Alert, Image, ImageBackground, View } from "react-native";
import { Button } from "react-native-paper";
//@ts-expect-error
import ExpoDraw from "expo-draw";
import { captureRef as takeSnapshotAsync } from "react-native-view-shot";
import { Text } from "./Themed";

interface IDrawSignatureScreenProps {
  handleSignatureSave: React.Dispatch<React.SetStateAction<string>>;
  handleSignatureReset: () => void;
  signatureBase64?: string;
}

export const DrawSignatureScreen: React.FC<IDrawSignatureScreenProps> = ({
  handleSignatureSave,
  handleSignatureReset,
  signatureBase64,
}) => {
  const signatureRef = useRef<any>(null);
  const isSigned = !!signatureBase64;
  const signButtonIconName = isSigned ? "checkbox-marked-circle" : undefined;
  async function clearCanvas() {
    signatureRef?.current?.clear();
    handleSignatureReset();
  }

  async function saveCanvas() {
    try {
      const signatureResult = await takeSnapshotAsync(signatureRef.current, {
        format: "png",
        result: "base64",
        height: 300,
        width: 800,
      });
      // Here you can handle the captured signature image, e.g., upload it to a server
      handleSignatureSave(signatureResult);
    } catch (error) {
      Alert.alert("Error saving signature", JSON.stringify(error, null, 2));
    }
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 25,
      }}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View
          style={{ borderWidth: 1, backgroundColor: "rgba(255,255,255,1) " }}
        >
          {!isSigned ? (
            <ExpoDraw
              strokes={[]}
              ref={signatureRef}
              containerStyle={{
                backgroundColor: "rgba(255,255,255,0.0001)",
                height: 200,
                width: 800,
              }}
              rewind={(undo: any) => console.log("undo", undo)}
              clear={(clear: any) => console.log("clear", clear)}
              color={"#000000"}
              strokeWidth={4}
              enabled={true}
              onChangeStrokes={(strokes: any) => console.log(strokes)}
            />
          ) : (
            <ImageBackground
              style={{
                flex: 1, // This makes the ImageBackground take up the full space of the container
                width: 800,
                height: 200,
                justifyContent: "center", // Center the content vertically
                alignItems: "center", // Center the content horizontally
              }}
              source={{ uri: `data:image/png;base64,${signatureBase64}` }}
            />
          )}
        </View>
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            marginVertical: 10,
            alignItems: "center",
          }}
        >
          <Button onPress={clearCanvas}>Reset</Button>
          <Button
            disabled={isSigned}
            mode="contained"
            onPress={() => saveCanvas()}
            icon={signButtonIconName}
          >
            {isSigned ? "Signed" : "Sign"}
          </Button>
        </View>
      </View>
    </View>
  );
};
export default DrawSignatureScreen;
