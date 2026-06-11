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
        <Ionicons name="options-outline" size={23} color={colors.primary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12
  },
  title: {
    color: colors.text,
    fontSize: 27,
    fontWeight: "800",
    letterSpacing: -0.4,
    lineHeight: 32
  },
  subtitle: {
    marginTop: 1,
    color: "#4F7370",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 18
  },
  iconButton: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 23,
    borderWidth: 1,
    borderColor: "#BFD5D1",
    backgroundColor: colors.background
  }
});
