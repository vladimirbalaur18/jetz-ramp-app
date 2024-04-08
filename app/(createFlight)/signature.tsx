import formStyles from "@/styles/formStyles";
import SectionTitle from "@/components/FormUtils/SectionTitle";
import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
//@ts-expect-error
import ExpoDraw from "expo-draw";
import { captureRef as takeSnapshotAsync } from "react-native-view-shot";

const DrawSignatureScreen = () => {
  const signatureRef = useRef<any>(null);
  const [filePath, setFilePath] = useState("");
  async function clearCanvas() {
    signatureRef?.current?.clear();
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
      setFilePath(signatureResult);
      console.log("signature file", signatureResult);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {filePath && (
        <Image source={{ uri: filePath }} width={300} height={300} />
      )}
      <Text>Enter your signature here</Text>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ExpoDraw
          strokes={[]}
          ref={signatureRef}
          containerStyle={{
            backgroundColor: "rgba(0,0,0,0.01)",
            height: 300,
            width: 500,
          }}
          rewind={(undo: any) => console.log("undo", undo)}
          clear={(clear: any) => console.log("clear", clear)}
          color={"#000000"}
          strokeWidth={4}
          enabled={true}
          onChangeStrokes={(strokes: any) => console.log(strokes)}
        />
        <View style={{ justifyContent: "space-evenly", marginTop: 20 }}>
          <TouchableOpacity
            style={{
              position: "absolute",
              bottom: 10,
              left: 10,
              padding: 10,
              height: 50,
              borderRadius: 10,
              backgroundColor: "green",
              alignItems: "center",
            }}
            onPress={clearCanvas}
          >
            <Text style={{ fontSize: 18, color: "white" }}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              position: "absolute",
              bottom: 10,
              right: 10,
              padding: 10,
              height: 50,
              borderRadius: 10,
              backgroundColor: "green",
              alignItems: "center",
            }}
            onPress={() => saveCanvas()}
          >
            <Text style={{ fontSize: 18, color: "white" }}>Sign</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
const SignaturePage = () => {
  return (
    <View style={{ ...formStyles.container, flex: 1 }}>
      <View style={{ ...styles.signatureContainer }}>
        <SectionTitle>Pilot in command signature:</SectionTitle>
        <DrawSignatureScreen />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  signatureContainer: {
    flex: 1,
  },
});
export default SignaturePage;
