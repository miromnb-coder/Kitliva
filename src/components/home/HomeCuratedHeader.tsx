import { Ionicons } from "@expo/vector-icons";
import { Platform, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

const serifFont = Platform.select({ ios: "Georgia", android: "serif", default: undefined });

export function HomeCuratedHeader() {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Curated gear</Text>
        <Text style={styles.subtitle}>Fresh finds from the Kitliva community</Text>
      </View>
      <View style={styles.sortButton}>
        <Ionicons name="swap-vertical-outline" size={13} color="#A77C3A" />
        <Text style={styles.sortText}>Sort</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 10
  },
  title: {
    color: colors.text,
    fontFamily: serifFont,
    fontSize: 22,
    fontWeight: "500",
    letterSpacing: -0.25,
    lineHeight: 27
  },
  subtitle: {
    marginTop: 1,
    color: colors.muted,
    fontSize: 11.5,
    fontWeight: "400",
    lineHeight: 15
  },
  sortButton: {
    height: 31,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15.5,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 12
  },
  sortText: {
    marginLeft: 5,
    color: "#7B623C",
    fontSize: 11.5,
    fontWeight: "500"
  }
});
