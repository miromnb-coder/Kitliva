import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

export function AuthDivider() {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>or continue with</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border
  },
  text: {
    marginHorizontal: 14,
    color: colors.muted,
    fontSize: 13,
    fontWeight: "500"
  }
});
