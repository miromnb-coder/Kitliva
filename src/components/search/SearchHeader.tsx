import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

export function SearchHeader() {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>Search</Text>
        <Text style={styles.subtitle}>Find the right gear faster</Text>
      </View>

      <View style={styles.iconButton}>
        <Ionicons name="options-outline" size={21} color={colors.primary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 10
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.35,
    lineHeight: 29
  },
  subtitle: {
    marginTop: 0,
    color: "#4F7370",
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 17
  },
  iconButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 21,
    borderWidth: 1,
    borderColor: "#BFD5D1",
    backgroundColor: colors.background
  }
});
