import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

type FilterRowProps = {
  onOpenFilters: () => void;
};

const filters = [
  { label: "Filters", flex: 1.02, icon: "options-outline" as const },
  { label: "Price", flex: 0.88 },
  { label: "Nearby", flex: 1.06, icon: "location-outline" as const },
  { label: "Condition", flex: 1.18 }
];

export function FilterRow({ onOpenFilters }: FilterRowProps) {
  return (
    <View style={styles.row}>
      {filters.map((filter) => (
        <Pressable key={filter.label} style={[styles.pill, { flex: filter.flex }]} onPress={onOpenFilters}>
          {filter.icon ? <Ionicons name={filter.icon} size={13} color={colors.primary} style={styles.leftIcon} /> : null}
          <Text style={styles.label} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.86}>{filter.label}</Text>
          <Ionicons name="chevron-down" size={12} color={colors.text} style={styles.chevron} />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", columnGap: 6, marginBottom: 16 },
  pill: { height: 33, minWidth: 0, flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 16.5, borderWidth: 1, borderColor: "#D8E2DF", backgroundColor: colors.surface, paddingHorizontal: 8 },
  leftIcon: { marginRight: 4 },
  label: { color: colors.text, fontSize: 11.2, fontWeight: "700" },
  chevron: { marginLeft: 4 }
});
