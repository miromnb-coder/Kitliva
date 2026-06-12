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
    marginTop: 34
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#D8D1C7"
  },
  text: {
    marginHorizontal: 18,
    color: colors.muted,
    fontSize: 13,
    fontWeight: "400"
  }
});
