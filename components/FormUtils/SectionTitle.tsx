import formStyles from "@/styles/formStyles";
import { ReactNode } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
const SectionTitle = ({ children }: { children: ReactNode }) => {
  return (
    <View style={formStyles.row}>
      <Text variant="headlineSmall">{children}</Text>
    </View>
  );
};

export default SectionTitle;
