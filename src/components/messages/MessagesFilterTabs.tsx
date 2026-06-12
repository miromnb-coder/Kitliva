import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

export type MessageFilter = "all" | "buying" | "selling" | "support";

const filters: { key: MessageFilter; label: string; icon?: keyof typeof Ionicons.glyphMap }[] = [
  { key: "all", label: "All" },
  { key: "buying", label: "Buying", icon: "pricetag-outline" },
  { key: "selling", label: "Selling", icon: "bag-handle-outline" },
  { key: "support", label: "Support", icon: "headset-outline" }
];

type MessagesFilterTabsProps = {
  activeFilter: MessageFilter;
  onChange: (filter: MessageFilter) => void;
};

export function MessagesFilterTabs({ activeFilter, onChange }: MessagesFilterTabsProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {filters.map((filter) => {
        const selected = activeFilter === filter.key;
        return (
          <Pressable key={filter.key} style={[styles.chip, selected && styles.activeChip]} onPress={() => onChange(filter.key)}>
            {filter.icon ? <Ionicons name={filter.icon} size={15} color="#4F5752" style={styles.icon} /> : null}
            <Text style={styles.label}>{filter.label}</Text>
            {selected ? <View style={styles.activeDot} /> : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 8,
    paddingRight: 2,
    marginTop: 24
  },
  chip: {
    height: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 16
  },
  activeChip: {
    borderColor: "#E7D8C8",
    backgroundColor: "#F7F2EB"
  },
  icon: {
    marginRight: 6
  },
  label: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "500"
  },
  activeDot: {
    position: "absolute",
    bottom: 4,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#A77C3A"
  }
});
