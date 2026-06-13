import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { SearchFilterSheetType } from "@/components/search/SearchFiltersSheet";
import { colors } from "@/constants/colors";
import { useI18n } from "@/i18n";
import { SearchFilters } from "@/types/search";

type ExploreFilterRowProps = {
  filters: SearchFilters;
  onOpenFilter: (filter: SearchFilterSheetType) => void;
  onClearFilter: (filter: SearchFilterSheetType) => void;
};

function conditionKey(condition: SearchFilters["condition"]) {
  return `condition.${condition}`;
}

export function ExploreFilterRow({ filters, onOpenFilter, onClearFilter }: ExploreFilterRowProps) {
  const { t } = useI18n();

  function getPriceLabel() {
    if (filters.minPrice && filters.maxPrice) return t("explore.filters.range", { min: filters.minPrice, max: filters.maxPrice });
    if (filters.minPrice) return t("explore.filters.from", { price: filters.minPrice });
    if (filters.maxPrice) return t("explore.filters.under", { price: filters.maxPrice });
    return t("explore.filters.price");
  }

  function getConditionLabel() {
    if (filters.condition === "any") return t("explore.filters.condition");
    return t(conditionKey(filters.condition));
  }

  function getShippingLabel() {
    if (filters.deliveryOption === "pickup") return t("explore.filters.pickup");
    return t("explore.filters.shipping");
  }

  const items: { type: SearchFilterSheetType; label: string; active: boolean; icon?: keyof typeof Ionicons.glyphMap }[] = [
    { type: "category", label: filters.categoryName === "All" ? t("explore.filters.category") : filters.categoryName, active: filters.categoryName !== "All" },
    { type: "price", label: getPriceLabel(), active: Boolean(filters.minPrice || filters.maxPrice) },
    { type: "condition", label: getConditionLabel(), active: filters.condition !== "any" },
    { type: "location", label: filters.city.trim() ? filters.city.trim() : t("explore.filters.location"), active: Boolean(filters.city.trim()) },
    { type: "shipping", label: getShippingLabel(), active: filters.deliveryOption !== "any", icon: "cube-outline" }
  ];

  return (
    <View style={styles.wrap}>
      {items.map((item) => (
        <Pressable key={item.type} style={[styles.chip, item.active && styles.activeChip]} onPress={() => onOpenFilter(item.type)}>
          {item.icon ? <Ionicons name={item.icon} size={13} color={item.active ? colors.accent : colors.muted} style={styles.leadingIcon} /> : null}
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
    backgroundColor: colors.softGold
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
