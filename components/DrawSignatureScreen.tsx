import React, { useRef } from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
//@ts-expect-error
import ExpoDraw from "expo-draw";
import { captureRef as takeSnapshotAsync } from "react-native-view-shot";

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
        height: 400,
        width: 400,
      });
      // Here you can handle the captured signature image, e.g., upload it to a server
      handleSignatureSave(signatureResult);
      console.log("signature file", signatureResult);
    } catch (error) {
      console.log(error);
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
          <ExpoDraw
            strokes={[]}
            ref={signatureRef}
            containerStyle={{
              backgroundColor: "rgba(255,255,255,0.0001)",
              height: 300,
              width: 800,
            }}
            rewind={(undo: any) => console.log("undo", undo)}
            clear={(clear: any) => console.log("clear", clear)}
            color={"#000000"}
            strokeWidth={4}
            enabled={true}
            onChangeStrokes={(strokes: any) => console.log(strokes)}
          />
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
