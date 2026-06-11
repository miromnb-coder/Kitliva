import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

export function AmountField() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Set amount</Text>
      <View style={styles.box}>
        <Text style={styles.value}>220 EUR</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18
  },
  label: {
    marginBottom: 8,
    color: colors.text,
    fontSize: 15,
    fontWeight: "800"
  },
  box: {
    height: 46,
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 14
  },
  value: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800"
  }
});
