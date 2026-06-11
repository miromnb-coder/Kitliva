import { Ionicons } from "@expo/vector-icons";
import { Platform, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

const serifFont = Platform.select({ ios: "Georgia", android: "serif", default: undefined });

export function ExploreHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Kitliva</Text>
      <View style={styles.actions}>
        <Ionicons name="notifications-outline" size={21} color={colors.text} />
        <Ionicons name="bag-handle-outline" size={21} color={colors.text} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  logo: {
    color: colors.text,
    fontFamily: serifFont,
    fontSize: 22,
    fontWeight: "500",
    letterSpacing: -0.2,
    lineHeight: 28
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15
  }
});
