import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { homeCategories } from "@/constants/categories";
import { colors } from "@/constants/colors";
import { ListingCondition } from "@/types/listing";
import { defaultSearchFilters, SearchDeliveryOption, SearchFilters, SearchSortOption } from "@/types/search";
import { KitlivaBottomSheet } from "@/components/sheets/KitlivaBottomSheet";
import { SheetActionCard } from "@/components/sheets/SheetActionCard";
import { SheetChip } from "@/components/sheets/SheetChip";
import { SheetOptionRow } from "@/components/sheets/SheetOptionRow";

export type SearchFilterSheetType = "category" | "price" | "condition" | "location" | "shipping" | "sort";

const conditions: { label: string; subtitle: string; value: ListingCondition | "any" }[] = [
  { label: "Any condition", subtitle: "Show all used gear.", value: "any" },
  { label: "New", subtitle: "Unused or still in original condition.", value: "new" },
  { label: "Like new", subtitle: "Barely used and very clean.", value: "like_new" },
  { label: "Good", subtitle: "Light normal use, ready to enjoy.", value: "good" },
  { label: "Fair", subtitle: "Visible use, but still works well.", value: "fair" },
  { label: "Poor", subtitle: "Needs care or repair.", value: "poor" }
];

const pricePresets = [
  { label: "Any price", minPrice: "", maxPrice: "" },
  { label: "Under €50", minPrice: "", maxPrice: "50" },
  { label: "€50–€150", minPrice: "50", maxPrice: "150" },
  { label: "€150–€300", minPrice: "150", maxPrice: "300" },
  { label: "€300+", minPrice: "300", maxPrice: "" }
];

const locationPresets = ["Helsinki", "Espoo", "Tampere", "Turku", "Oulu"];

const deliveryOptions: { label: string; subtitle: string; value: SearchDeliveryOption; icon: keyof typeof Ionicons.glyphMap }[] = [
  { label: "Any delivery", subtitle: "Show all pickup and shipping options.", value: "any", icon: "cube-outline" },
  { label: "Local pickup", subtitle: "Find gear you can collect in person.", value: "pickup", icon: "location-outline" },
  { label: "Shipping available", subtitle: "Browse gear that can be shipped.", value: "shipping", icon: "paper-plane-outline" }
];

const sortOptions: { label: string; subtitle: string; value: SearchSortOption; icon: keyof typeof Ionicons.glyphMap }[] = [
  { label: "Recommended", subtitle: "Kitliva’s balanced default order.", value: "recommended", icon: "sparkles-outline" },
  { label: "Newest", subtitle: "Recently published gear first.", value: "newest", icon: "time-outline" },
  { label: "Price: low to high", subtitle: "Start with the lowest prices.", value: "price_low", icon: "arrow-down-outline" },
  { label: "Price: high to low", subtitle: "Start with the highest prices.", value: "price_high", icon: "arrow-up-outline" }
];

type SearchFiltersSheetProps = {
  visible: boolean;
  activeSheet: SearchFilterSheetType | null;
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  onClose: () => void;
  onClear: () => void;
};

function getSheetTitle(activeSheet: SearchFilterSheetType | null) {
  if (activeSheet === "category") return "Category";
  if (activeSheet === "price") return "Price range";
  if (activeSheet === "condition") return "Condition";
  if (activeSheet === "location") return "Location";
  if (activeSheet === "shipping") return "Delivery";
  if (activeSheet === "sort") return "Sort";
  return "Filters";
}

function getSheetSubtitle(activeSheet: SearchFilterSheetType | null) {
  if (activeSheet === "category") return "Choose the type of gear you want to browse.";
  if (activeSheet === "price") return "Set a budget that fits you.";
  if (activeSheet === "condition") return "Choose how used the item can be.";
  if (activeSheet === "location") return "Find gear by city or area.";
  if (activeSheet === "shipping") return "Choose how you want to receive gear.";
  if (activeSheet === "sort") return "Choose how results are ordered.";
  return "Refine the gear you see.";
}

function pricePresetSelected(filters: SearchFilters, preset: { minPrice: string; maxPrice: string }) {
  return filters.minPrice === preset.minPrice && filters.maxPrice === preset.maxPrice;
}

export function SearchFiltersSheet({ visible, activeSheet, filters, onChange, onClose, onClear }: SearchFiltersSheetProps) {
  function update<Key extends keyof SearchFilters>(key: Key, value: SearchFilters[Key]) {
    onChange({ ...filters, [key]: value });
  }

  function resetActiveSheet() {
    if (activeSheet === "category") update("categoryName", "All");
    else if (activeSheet === "price") onChange({ ...filters, minPrice: "", maxPrice: "" });
    else if (activeSheet === "condition") update("condition", "any");
    else if (activeSheet === "location") update("city", "");
    else if (activeSheet === "shipping") update("deliveryOption", "any");
    else if (activeSheet === "sort") update("sort", "recommended");
    else onClear();
  }

  function applyAndClose() {
    onClose();
  }

  return (
    <KitlivaBottomSheet
      visible={visible}
      title={getSheetTitle(activeSheet)}
      subtitle={getSheetSubtitle(activeSheet)}
      snapPoints={activeSheet === "category" ? ["70%"] : activeSheet === "price" || activeSheet === "location" ? ["64%"] : ["58%"]}
      secondaryLabel="Reset"
      primaryLabel="Apply"
      onSecondaryPress={resetActiveSheet}
      onPrimaryPress={applyAndClose}
      onClose={onClose}
    >
      {activeSheet === "category" ? (
        <View style={styles.categoryGrid}>
          <SheetActionCard icon="apps-outline" title="All" subtitle="Browse every category." selected={filters.categoryName === "All"} onPress={() => update("categoryName", "All")} />
          {homeCategories.map((category) => (
            <SheetActionCard key={category.id} icon={category.icon} title={category.label} subtitle="Quality checked hobby gear." selected={filters.categoryName === category.label} onPress={() => update("categoryName", category.label)} />
          ))}
        </View>
      ) : null}

      {activeSheet === "price" ? (
        <View>
          <View style={styles.chipRow}>
            {pricePresets.map((preset) => (
              <SheetChip key={preset.label} label={preset.label} selected={pricePresetSelected(filters, preset)} onPress={() => onChange({ ...filters, minPrice: preset.minPrice, maxPrice: preset.maxPrice })} />
            ))}
          </View>
          <View style={styles.inputRow}>
            <View style={styles.inputBox}><Text style={styles.currency}>€</Text><TextInput style={styles.input} value={filters.minPrice} onChangeText={(value) => update("minPrice", value)} placeholder="Min" placeholderTextColor={colors.inputPlaceholder} keyboardType="number-pad" /></View>
            <View style={styles.inputBox}><Text style={styles.currency}>€</Text><TextInput style={styles.input} value={filters.maxPrice} onChangeText={(value) => update("maxPrice", value)} placeholder="Max" placeholderTextColor={colors.inputPlaceholder} keyboardType="number-pad" /></View>
          </View>
        </View>
      ) : null}

      {activeSheet === "condition" ? (
        <View>
          {conditions.map((condition) => <SheetOptionRow key={condition.value} title={condition.label} subtitle={condition.subtitle} selected={filters.condition === condition.value} onPress={() => update("condition", condition.value)} />)}
        </View>
      ) : null}

      {activeSheet === "location" ? (
        <View>
          <View style={styles.cityInput}><Ionicons name="location-outline" size={17} color={colors.accent} /><TextInput style={styles.cityTextInput} value={filters.city} onChangeText={(value) => update("city", value)} placeholder="Search city or area" placeholderTextColor={colors.inputPlaceholder} /></View>
          <Text style={styles.helperText}>City search is active now. Radius search can be added later.</Text>
          <View style={styles.chipRow}>
            <SheetChip label="Anywhere" selected={!filters.city.trim()} onPress={() => update("city", "")} />
            {locationPresets.map((city) => <SheetChip key={city} label={city} selected={filters.city === city} onPress={() => update("city", city)} />)}
          </View>
        </View>
      ) : null}

      {activeSheet === "shipping" ? (
        <View>
          {deliveryOptions.map((option) => <SheetOptionRow key={option.value} icon={option.icon} title={option.label} subtitle={option.subtitle} selected={filters.deliveryOption === option.value} onPress={() => update("deliveryOption", option.value)} />)}
          <View style={styles.infoCard}><Ionicons name="information-circle-outline" size={18} color={colors.accent} /><Text style={styles.infoText}>Delivery filtering is prepared for upcoming listing delivery data.</Text></View>
        </View>
      ) : null}

      {activeSheet === "sort" ? (
        <View>
          {sortOptions.map((option) => <SheetOptionRow key={option.value} icon={option.icon} title={option.label} subtitle={option.subtitle} selected={filters.sort === option.value} onPress={() => update("sort", option.value)} />)}
        </View>
      ) : null}
    </KitlivaBottomSheet>
  );
}

const styles = StyleSheet.create({
  categoryGrid: {
    gap: 0
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
    marginBottom: 16
  },
  inputRow: {
    flexDirection: "row",
    gap: 10
  },
  inputBox: {
    flex: 1,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 14
  },
  currency: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
    marginRight: 8
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
    paddingVertical: 0
  },
  cityInput: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    marginBottom: 8
  },
  cityTextInput: {
    flex: 1,
    marginLeft: 9,
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
    paddingVertical: 0
  },
  helperText: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 14
  },
  infoCard: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.softGold,
    paddingHorizontal: 13,
    marginTop: 2
  },
  infoText: {
    flex: 1,
    marginLeft: 9,
    color: colors.mutedStrong,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500"
  }
});
