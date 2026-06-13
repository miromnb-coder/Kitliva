import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { KitlivaBottomSheet } from "@/components/sheets/KitlivaBottomSheet";
import { SheetActionCard } from "@/components/sheets/SheetActionCard";
import { SheetChip } from "@/components/sheets/SheetChip";
import { SheetOptionRow } from "@/components/sheets/SheetOptionRow";
import { homeCategories } from "@/constants/categories";
import { colors } from "@/constants/colors";
import { useI18n } from "@/i18n";
import { ListingCondition } from "@/types/listing";
import { SearchDeliveryOption, SearchFilters, SearchSortOption } from "@/types/search";

export type SearchFilterSheetType = "category" | "price" | "condition" | "location" | "shipping" | "sort";

type PricePreset = { labelKey: string; labelParams?: Record<string, string | number>; minPrice: string; maxPrice: string };

const conditionValues: { subtitleKey: string; value: ListingCondition | "any" }[] = [
  { subtitleKey: "explore.sheet.anyConditionSubtitle", value: "any" },
  { subtitleKey: "explore.sheet.newSubtitle", value: "new" },
  { subtitleKey: "explore.sheet.likeNewSubtitle", value: "like_new" },
  { subtitleKey: "explore.sheet.goodSubtitle", value: "good" },
  { subtitleKey: "explore.sheet.fairSubtitle", value: "fair" },
  { subtitleKey: "explore.sheet.poorSubtitle", value: "poor" }
];

const pricePresets: PricePreset[] = [
  { labelKey: "explore.sheet.anyPrice", minPrice: "", maxPrice: "" },
  { labelKey: "explore.filters.under", labelParams: { price: 50 }, minPrice: "", maxPrice: "50" },
  { labelKey: "explore.sheet.price50to150", minPrice: "50", maxPrice: "150" },
  { labelKey: "explore.sheet.price150to300", minPrice: "150", maxPrice: "300" },
  { labelKey: "explore.sheet.price300Plus", minPrice: "300", maxPrice: "" }
];

const locationPresets = ["Helsinki", "Espoo", "Tampere", "Turku", "Oulu"];

const deliveryOptions: { labelKey: string; subtitleKey: string; value: SearchDeliveryOption; icon: keyof typeof Ionicons.glyphMap }[] = [
  { labelKey: "explore.sheet.anyDelivery", subtitleKey: "explore.sheet.anyDeliverySubtitle", value: "any", icon: "cube-outline" },
  { labelKey: "explore.sheet.localPickup", subtitleKey: "explore.sheet.localPickupSubtitle", value: "pickup", icon: "location-outline" },
  { labelKey: "explore.sheet.shippingAvailable", subtitleKey: "explore.sheet.shippingAvailableSubtitle", value: "shipping", icon: "paper-plane-outline" }
];

const sortOptions: { labelKey: string; subtitleKey: string; value: SearchSortOption; icon: keyof typeof Ionicons.glyphMap }[] = [
  { labelKey: "explore.results.recommended", subtitleKey: "explore.sheet.recommendedSubtitle", value: "recommended", icon: "sparkles-outline" },
  { labelKey: "explore.results.newest", subtitleKey: "explore.sheet.newestSubtitle", value: "newest", icon: "time-outline" },
  { labelKey: "explore.results.priceLow", subtitleKey: "explore.sheet.priceLowSubtitle", value: "price_low", icon: "arrow-down-outline" },
  { labelKey: "explore.results.priceHigh", subtitleKey: "explore.sheet.priceHighSubtitle", value: "price_high", icon: "arrow-up-outline" }
];

type SearchFiltersSheetProps = {
  visible: boolean;
  activeSheet: SearchFilterSheetType | null;
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  onClose: () => void;
  onClear: () => void;
};

function getSheetTitleKey(activeSheet: SearchFilterSheetType | null) {
  if (activeSheet === "category") return "explore.sheet.category";
  if (activeSheet === "price") return "explore.sheet.price";
  if (activeSheet === "condition") return "explore.sheet.condition";
  if (activeSheet === "location") return "explore.sheet.location";
  if (activeSheet === "shipping") return "explore.sheet.shipping";
  if (activeSheet === "sort") return "explore.sheet.sort";
  return "explore.sheet.filters";
}

function getSheetSubtitleKey(activeSheet: SearchFilterSheetType | null) {
  if (activeSheet === "category") return "explore.sheet.categorySubtitle";
  if (activeSheet === "price") return "explore.sheet.priceSubtitle";
  if (activeSheet === "condition") return "explore.sheet.conditionSubtitle";
  if (activeSheet === "location") return "explore.sheet.locationSubtitle";
  if (activeSheet === "shipping") return "explore.sheet.shippingSubtitle";
  if (activeSheet === "sort") return "explore.sheet.sortSubtitle";
  return "explore.sheet.filtersSubtitle";
}

function pricePresetSelected(filters: SearchFilters, preset: { minPrice: string; maxPrice: string }) {
  return filters.minPrice === preset.minPrice && filters.maxPrice === preset.maxPrice;
}

export function SearchFiltersSheet({ visible, activeSheet, filters, onChange, onClose, onClear }: SearchFiltersSheetProps) {
  const { t } = useI18n();

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
      title={t(getSheetTitleKey(activeSheet))}
      subtitle={t(getSheetSubtitleKey(activeSheet))}
      snapPoints={activeSheet === "category" ? ["70%"] : activeSheet === "price" || activeSheet === "location" ? ["64%"] : ["58%"]}
      secondaryLabel={t("common.reset")}
      primaryLabel={t("common.apply")}
      onSecondaryPress={resetActiveSheet}
      onPrimaryPress={applyAndClose}
      onClose={onClose}
    >
      {activeSheet === "category" ? (
        <View style={styles.categoryGrid}>
          <SheetActionCard icon="apps-outline" title={t("explore.sheet.allCategories")} subtitle={t("explore.sheet.allCategoriesSubtitle")} selected={filters.categoryName === "All"} onPress={() => update("categoryName", "All")} />
          {homeCategories.map((category) => (
            <SheetActionCard key={category.id} icon={category.icon} title={category.label} subtitle={t("explore.sheet.categorySubtitleCard")} selected={filters.categoryName === category.label} onPress={() => update("categoryName", category.label)} />
          ))}
        </View>
      ) : null}

      {activeSheet === "price" ? (
        <View>
          <View style={styles.chipRow}>
            {pricePresets.map((preset) => (
              <SheetChip key={preset.labelKey} label={t(preset.labelKey, preset.labelParams)} selected={pricePresetSelected(filters, preset)} onPress={() => onChange({ ...filters, minPrice: preset.minPrice, maxPrice: preset.maxPrice })} />
            ))}
          </View>
          <View style={styles.inputRow}>
            <View style={styles.inputBox}><Text style={styles.currency}>€</Text><TextInput style={styles.input} value={filters.minPrice} onChangeText={(value) => update("minPrice", value)} placeholder={t("explore.sheet.min")} placeholderTextColor={colors.inputPlaceholder} keyboardType="number-pad" /></View>
            <View style={styles.inputBox}><Text style={styles.currency}>€</Text><TextInput style={styles.input} value={filters.maxPrice} onChangeText={(value) => update("maxPrice", value)} placeholder={t("explore.sheet.max")} placeholderTextColor={colors.inputPlaceholder} keyboardType="number-pad" /></View>
          </View>
        </View>
      ) : null}

      {activeSheet === "condition" ? (
        <View>
          {conditionValues.map((condition) => <SheetOptionRow key={condition.value} title={t(`condition.${condition.value}`)} subtitle={t(condition.subtitleKey)} selected={filters.condition === condition.value} onPress={() => update("condition", condition.value)} />)}
        </View>
      ) : null}

      {activeSheet === "location" ? (
        <View>
          <View style={styles.cityInput}><Ionicons name="location-outline" size={17} color={colors.accent} /><TextInput style={styles.cityTextInput} value={filters.city} onChangeText={(value) => update("city", value)} placeholder={t("explore.sheet.cityPlaceholder")} placeholderTextColor={colors.inputPlaceholder} /></View>
          <Text style={styles.helperText}>{t("explore.sheet.cityHelper")}</Text>
          <View style={styles.chipRow}>
            <SheetChip label={t("explore.sheet.anywhere")} selected={!filters.city.trim()} onPress={() => update("city", "")} />
            {locationPresets.map((city) => <SheetChip key={city} label={city} selected={filters.city === city} onPress={() => update("city", city)} />)}
          </View>
        </View>
      ) : null}

      {activeSheet === "shipping" ? (
        <View>
          {deliveryOptions.map((option) => <SheetOptionRow key={option.value} icon={option.icon} title={t(option.labelKey)} subtitle={t(option.subtitleKey)} selected={filters.deliveryOption === option.value} onPress={() => update("deliveryOption", option.value)} />)}
          <View style={styles.infoCard}><Ionicons name="information-circle-outline" size={18} color={colors.accent} /><Text style={styles.infoText}>{t("explore.sheet.shippingInfo")}</Text></View>
        </View>
      ) : null}

      {activeSheet === "sort" ? (
        <View>
          {sortOptions.map((option) => <SheetOptionRow key={option.value} icon={option.icon} title={t(option.labelKey)} subtitle={t(option.subtitleKey)} selected={filters.sort === option.value} onPress={() => update("sort", option.value)} />)}
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
