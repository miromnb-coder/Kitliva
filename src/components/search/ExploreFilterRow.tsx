import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

type ExploreFilterRowProps = {
  onOpenFilters: () => void;
};

const filters = [
  { label: "Category" },
  { label: "Price" },
  { label: "Condition" },
  { label: "Location" },
  { label: "Shipping", icon: "cube-outline" as const }
];

export function ExploreFilterRow({ onOpenFilters }: ExploreFilterRowProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content} style={styles.scroll}>
      {filters.map((filter) => (
        <Pressable key={filter.label} style={styles.chip} onPress={onOpenFilters}>
          {filter.icon ? <Ionicons name={filter.icon} size={13} color={colors.muted} style={styles.leadingIcon} /> : null}
          <Text style={styles.label}>{filter.label}</Text>
          {filter.label !== "Shipping" ? <Ionicons name="chevron-down" size={12} color={colors.muted} style={styles.chevron} /> : null}
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    marginTop: 14,
    minHeight: 32
  },
  content: {
    flexDirection: "row",
    gap: 7,
    paddingRight: 2
  },
  chip: {
    height: 32,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 12
  },
  leadingIcon: {
    marginRight: 5
  },
  label: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "500"
  },
  chevron: {
    marginLeft: 5
  }
});
