import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

type FilterItem = {
  label: string;
  flex: number;
  icon?: keyof typeof Ionicons.glyphMap;
};

const filters: FilterItem[] = [
  { label: "Category", flex: 1.14 },
  { label: "Price", flex: 0.88 },
  { label: "Distance", flex: 1.24, icon: "location-outline" },
  { label: "Condition", flex: 1.18 }
];

export function FilterRow() {
  return (
    <View style={styles.row}>
      {filters.map((filter) => (
        <View key={filter.label} style={[styles.pill, { flex: filter.flex }]}>
          {filter.icon ? <Ionicons name={filter.icon} size={13} color={colors.primary} style={styles.leftIcon} /> : null}
          <Text style={styles.label} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.86}>
            {filter.label}
          </Text>
          <Ionicons name="chevron-down" size={12} color={colors.text} style={styles.chevron} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    columnGap: 6,
    marginBottom: 16
  },
  pill: {
    height: 33,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16.5,
    borderWidth: 1,
    borderColor: "#D8E2DF",
    backgroundColor: colors.surface,
    paddingHorizontal: 8
  },
  leftIcon: {
    marginRight: 4
  },
  label: {
    color: colors.text,
    fontSize: 11.2,
    fontWeight: "700"
  },
  chevron: {
    marginLeft: 4
  }
});
