import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { typography } from "@/theme/typography";

export function HomeHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kitliva</Text>
      <Ionicons name="notifications-outline" size={22} color={colors.text} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  title: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.4,
    lineHeight: typography.title
  }
});
