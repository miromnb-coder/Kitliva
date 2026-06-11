import { StyleSheet, Text } from "react-native";

import { colors } from "@/constants/colors";

export function SellContinueButton() {
  return <Text style={styles.button}>Continue</Text>;
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    overflow: "hidden",
    borderRadius: 13,
    backgroundColor: colors.primary,
    color: colors.surface,
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 50,
    textAlign: "center"
  }
});
