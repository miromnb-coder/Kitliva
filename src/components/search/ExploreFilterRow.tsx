import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { SearchFilters } from "@/types/search";
import { SearchFilterSheetType } from "@/components/search/SearchFiltersSheet";

type ExploreFilterRowProps = {
  filters: SearchFilters;
  onOpenFilter: (filter: SearchFilterSheetType) => void;
  onClearFilter: (filter: SearchFilterSheetType) => void;
};

function getPriceLabel(filters: SearchFilters) {
  if (filters.minPrice && filters.maxPrice) return `€${filters.minPrice}–€${filters.maxPrice}`;
  if (filters.minPrice) return `From €${filters.minPrice}`;
  if (filters.maxPrice) return `Under €${filters.maxPrice}`;
  return "Price";
}

function getConditionLabel(filters: SearchFilters) {
  if (filters.condition === "any") return "Condition";
  if (filters.condition === "like_new") return "Like new";
  return filters.condition.charAt(0).toUpperCase() + filters.condition.slice(1);
}

function getShippingLabel(filters: SearchFilters) {
  if (filters.deliveryOption === "pickup") return "Pickup";
  if (filters.deliveryOption === "shipping") return "Shipping";
  return "Shipping";
}

export function ExploreFilterRow({ filters, onOpenFilter, onClearFilter }: ExploreFilterRowProps) {
  const items: { type: SearchFilterSheetType; label: string; active: boolean; icon?: keyof typeof Ionicons.glyphMap }[] = [
    { type: "category", label: filters.categoryName === "All" ? "Category" : filters.categoryName, active: filters.categoryName !== "All" },
    { type: "price", label: getPriceLabel(filters), active: Boolean(filters.minPrice || filters.maxPrice) },
    { type: "condition", label: getConditionLabel(filters), active: filters.condition !== "any" },
    { type: "location", label: filters.city.trim() ? filters.city.trim() : "Location", active: Boolean(filters.city.trim()) },
    { type: "shipping", label: getShippingLabel(filters), active: filters.deliveryOption !== "any", icon: "cube-outline" }
  ];

  return (
    <View style={styles.wrap}>
      {items.map((item) => (
        <Pressable key={item.type} style={[styles.chip, item.active && styles.activeChip]} onPress={() => onOpenFilter(item.type)}>
          {item.icon ? <Ionicons name={item.icon} size={13} color={item.active ? "#A77C3A" : colors.muted} style={styles.leadingIcon} /> : null}
          <Text style={[styles.label, item.active && styles.activeLabel]} numberOfLines={1}>{item.label}</Text>
          {item.active ? (
            <Pressable hitSlop={10} onPress={() => onClearFilter(item.type)}>
              <Ionicons name="close" size={13} color={colors.text} style={styles.chevron} />
            </Pressable>
          ) : (
            <Ionicons name="chevron-down" size={12} color={colors.muted} style={styles.chevron} />
          )}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
    marginTop: 14
  },
  chip: {
    height: 40,
    maxWidth: "48%",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 13
  },
  activeChip: {
    borderColor: "#D4B987",
    backgroundColor: "#F7F2EB"
  },
  leadingIcon: {
    marginRight: 5
  },
  label: {
    color: colors.text,
    fontSize: 12.5,
    fontWeight: "600"
  },
  activeLabel: {
    color: colors.text,
    fontWeight: "700"
  },
  chevron: {
    marginLeft: 6
  }
});
