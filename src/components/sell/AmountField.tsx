import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

export function AmountField() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Set your price</Text>
      <View style={styles.box}>
        <Text style={styles.value}>€ 220</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15
  },
  label: {
    marginBottom: 7,
    color: colors.text,
    fontSize: 14,
    fontWeight: "800"
  },
  box: {
    height: 42,
    justifyContent: "center",
    borderRadius: 11,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 13
  },
  value: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800"
  }
});
