import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

export function SearchResultsHeader() {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>Recommended gear</Text>
        <Text style={styles.subtitle}>128 results nearby</Text>
      </View>

      <View style={styles.sortButton}>
        <Ionicons name="swap-vertical-outline" size={16} color={colors.primary} style={styles.sortIcon} />
        <Text style={styles.sortText}>Sort</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 10
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.2,
    lineHeight: 22
  },
  subtitle: {
    marginTop: 1,
    color: "#6F8380",
    fontSize: 12.5,
    fontWeight: "500"
  },
  sortButton: {
    height: 36,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D8E2DF",
    backgroundColor: colors.surface,
    paddingHorizontal: 13
  },
  sortIcon: {
    marginRight: 6
  },
  sortText: {
    color: colors.text,
    fontSize: 12.5,
    fontWeight: "800"
  }
});
