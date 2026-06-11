import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

export function SellHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sell your gear</Text>
      <Text style={styles.saveDraft}>Save draft</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 28
  },
  saveDraft: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "700"
  }
});
