import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { colors } from "@/constants/colors";
import { defaultSearchFilters, SearchFilters, SearchSortOption } from "@/types/search";
import { ListingCondition } from "@/types/listing";

const conditions: { label: string; value: ListingCondition | "any" }[] = [
  { label: "Any", value: "any" },
  { label: "New", value: "new" },
  { label: "Like new", value: "like_new" },
  { label: "Good", value: "good" },
  { label: "Fair", value: "fair" },
  { label: "Poor", value: "poor" }
];

const sortOptions: { label: string; value: SearchSortOption }[] = [
  { label: "Newest", value: "newest" },
  { label: "Price low to high", value: "price_low" },
  { label: "Price high to low", value: "price_high" }
];

type SearchFiltersSheetProps = {
  visible: boolean;
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  onClose: () => void;
  onClear: () => void;
};

export function SearchFiltersSheet({ visible, filters, onChange, onClose, onClear }: SearchFiltersSheetProps) {
  if (!visible) return null;

  function update<Key extends keyof SearchFilters>(key: Key, value: SearchFilters[Key]) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Filters</Text>
            <Text style={styles.subtitle}>Refine the gear you see.</Text>
          </View>
          <Pressable style={styles.closeButton} onPress={onClose}><Ionicons name="close" size={18} color={colors.text} /></Pressable>
        </View>

        <Text style={styles.sectionLabel}>Condition</Text>
        <View style={styles.chipRow}>
          {conditions.map((condition) => {
            const selected = filters.condition === condition.value;
            return (
              <Pressable key={condition.value} style={[styles.chip, selected && styles.selectedChip]} onPress={() => update("condition", condition.value)}>
                <Text style={[styles.chipText, selected && styles.selectedChipText]}>{condition.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>Price range</Text>
        <View style={styles.rowInputs}>
          <View style={styles.inputBox}><Text style={styles.currency}>€</Text><TextInput style={styles.input} value={filters.minPrice} onChangeText={(value) => update("minPrice", value)} placeholder="Min" placeholderTextColor={colors.muted} keyboardType="number-pad" /></View>
          <View style={styles.inputBox}><Text style={styles.currency}>€</Text><TextInput style={styles.input} value={filters.maxPrice} onChangeText={(value) => update("maxPrice", value)} placeholder="Max" placeholderTextColor={colors.muted} keyboardType="number-pad" /></View>
        </View>

        <Text style={styles.sectionLabel}>Location</Text>
        <View style={styles.cityInput}><Ionicons name="location-outline" size={16} color={colors.primary} /><TextInput style={styles.cityTextInput} value={filters.city} onChangeText={(value) => update("city", value)} placeholder="Example: Helsinki" placeholderTextColor={colors.muted} /></View>
        <Text style={styles.helpText}>Search by city for now.</Text>

        <Text style={styles.sectionLabel}>Sort</Text>
        <View style={styles.sortCard}>
          {sortOptions.map((option, index) => {
            const selected = filters.sort === option.value;
            return (
              <Pressable key={option.value} style={styles.sortRow} onPress={() => update("sort", option.value)}>
                <Text style={styles.sortText}>{option.label}</Text>
                {selected ? <Ionicons name="checkmark-circle" size={18} color={colors.primary} /> : null}
                {index < sortOptions.length - 1 ? <View style={styles.separator} /> : null}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.secondaryButton} onPress={() => { onChange(defaultSearchFilters); onClear(); }}><Text style={styles.secondaryText}>Clear filters</Text></Pressable>
          <Pressable style={styles.primaryButton} onPress={onClose}><Text style={styles.primaryText}>Show results</Text></Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, zIndex: 40, justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(16,42,42,0.18)" },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: colors.background, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 26 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  title: { color: colors.text, fontSize: 22, fontWeight: "800" },
  subtitle: { marginTop: 2, color: colors.muted, fontSize: 12.5, fontWeight: "500" },
  closeButton: { width: 36, height: 36, alignItems: "center", justifyContent: "center", borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  sectionLabel: { color: colors.text, fontSize: 14, fontWeight: "800", marginTop: 10, marginBottom: 8 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { height: 34, justifyContent: "center", borderRadius: 17, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 12 },
  selectedChip: { borderColor: colors.primary, backgroundColor: colors.primary },
  chipText: { color: colors.muted, fontSize: 12, fontWeight: "800" },
  selectedChipText: { color: colors.surface },
  rowInputs: { flexDirection: "row", gap: 9 },
  inputBox: { flex: 1, height: 43, flexDirection: "row", alignItems: "center", borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 12 },
  currency: { color: colors.text, fontSize: 13, fontWeight: "800", marginRight: 6 },
  input: { flex: 1, color: colors.text, fontSize: 13, fontWeight: "700", paddingVertical: 0 },
  cityInput: { height: 43, flexDirection: "row", alignItems: "center", borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 12 },
  cityTextInput: { flex: 1, marginLeft: 8, color: colors.text, fontSize: 13, fontWeight: "700", paddingVertical: 0 },
  helpText: { marginTop: 5, color: colors.muted, fontSize: 11.5, fontWeight: "500" },
  sortCard: { overflow: "hidden", borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  sortRow: { minHeight: 43, flexDirection: "row", alignItems: "center", paddingHorizontal: 13 },
  sortText: { flex: 1, color: colors.text, fontSize: 13, fontWeight: "700" },
  separator: { position: "absolute", left: 13, right: 13, bottom: 0, height: 1, backgroundColor: colors.border },
  actions: { flexDirection: "row", gap: 9, marginTop: 18 },
  secondaryButton: { height: 46, flex: 1, alignItems: "center", justifyContent: "center", borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  secondaryText: { color: colors.text, fontSize: 13, fontWeight: "800" },
  primaryButton: { height: 46, flex: 1, alignItems: "center", justifyContent: "center", borderRadius: 12, backgroundColor: colors.primary },
  primaryText: { color: colors.surface, fontSize: 13, fontWeight: "800" }
});
