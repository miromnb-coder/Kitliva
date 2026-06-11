import { Ionicons } from "@expo/vector-icons";
import { Platform, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

const serifFont = Platform.select({ ios: "Georgia", android: "serif", default: undefined });

export function HomeHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kitliva</Text>
      <View style={styles.actions}>
        <Ionicons name="notifications-outline" size={22} color={colors.text} />
        <Ionicons name="bag-handle-outline" size={22} color={colors.text} />
      </View>
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
    fontFamily: serifFont,
    fontSize: 24,
    fontWeight: "500",
    letterSpacing: -0.3,
    lineHeight: 30
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16
  }
});
