import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import React, { useRef } from "react";
import formStyles from "@/styles/formStyles";
import SectionTitle from "@/components/FormUtils/SectionTitle";

const SignaturePage = () => {
  return (
    <View style={{ ...formStyles.container, flex: 1 }}>
      <View style={{ ...styles.signatureContainer, backgroundColor: "red" }}>
        <SectionTitle>Pilot in command signature:</SectionTitle>
      </View>
      <View style={{ ...styles.signatureContainer, backgroundColor: "blue" }}>
        <SectionTitle>Ramp signature:</SectionTitle>
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
