import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

type FilterItem = {
  label: string;
  minWidth: number;
  icon?: keyof typeof Ionicons.glyphMap;
};

const filters: FilterItem[] = [
  { label: "Category", minWidth: 99 },
  { label: "Price", minWidth: 78 },
  { label: "Distance", minWidth: 112, icon: "location-outline" },
  { label: "Condition", minWidth: 111 }
];

export function FilterRow() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.content}
    >
      {filters.map((filter) => (
        <View key={filter.label} style={[styles.pill, { minWidth: filter.minWidth }]}>
          {filter.icon ? <Ionicons name={filter.icon} size={15} color={colors.primary} style={styles.leftIcon} /> : null}
          <Text style={styles.label}>{filter.label}</Text>
          <Ionicons name="chevron-down" size={14} color={colors.text} style={styles.chevron} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    marginBottom: 18
  },
  content: {
    gap: 8
  },
  pill: {
    height: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D8E2DF",
    backgroundColor: colors.surface,
    paddingHorizontal: 13
  },
  leftIcon: {
    marginRight: 5
  },
  label: {
    color: colors.text,
    fontSize: 12.5,
    fontWeight: "700"
  },
  chevron: {
    marginLeft: 6
  }
});
