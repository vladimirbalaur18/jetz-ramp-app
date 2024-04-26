import { View, Text } from "react-native";
import React, { useEffect } from "react";
import realm from "@/realm";
import ConfigModel from "@/models/Config";

const Config = () => {
  const VAT = realm.objects<ConfigModel>("config");

  return (
    <View>
      <Text>These are your configs</Text>
      <Text>{JSON.stringify(VAT)}</Text>
    </View>
  );
};

export default Config;
