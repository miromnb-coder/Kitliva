import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

export function SellHeader({ showSaveDraft = true }: { showSaveDraft?: boolean }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sell your gear</Text>
      {showSaveDraft ? <Text style={styles.saveDraft}>Save draft</Text> : <View style={styles.placeholder} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 25
  },
  saveDraft: {
    color: colors.primary,
    fontSize: 11.5,
    fontWeight: "700"
  },
  placeholder: {
    width: 1,
    height: 1
  }
});
