import formStyles from "@/styles/formStyles";
import SectionTitle from "@/components/FormUtils/SectionTitle";
import React, { useState, useRef } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text, Button, useTheme } from "react-native-paper";
//@ts-expect-error
import ExpoDraw from "expo-draw";
import { captureRef as takeSnapshotAsync } from "react-native-view-shot";

interface IDrawSignatureScreenProps {
  handleSignatureSave: React.Dispatch<React.SetStateAction<string>>;
}

const DrawSignatureScreen: React.FC<IDrawSignatureScreenProps> = ({
  handleSignatureSave,
}) => {
  const signatureRef = useRef<any>(null);
  async function clearCanvas() {
    signatureRef?.current?.clear();
  }
  const theme = useTheme();

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
        marginVertical: 15,
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
              width: 400,
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
          <Button mode="contained" onPress={() => saveCanvas()}>
            Sign
          </Button>
        </View>
      </View>
    </View>
  );
};
const SignaturePage = () => {
  const [picSignatureBase64, setPICSignatureBase64] = useState<string>("");
  const [rampSignatureBase64, setRampSignatureBase64] = useState<string>("");

  return (
    <ScrollView contentContainerStyle={{ ...formStyles.container, flex: 1 }}>
      <View style={{ ...styles.signatureContainer }}>
        <SectionTitle>Pilot in command signature:</SectionTitle>
        <DrawSignatureScreen handleSignatureSave={setPICSignatureBase64} />
      </View>
      <View style={{ ...styles.signatureContainer }}>
        <SectionTitle>Ramp agent signature:</SectionTitle>
        <DrawSignatureScreen handleSignatureSave={setRampSignatureBase64} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  signatureContainer: {
    flex: 1,
  },
});
export default SignaturePage;
