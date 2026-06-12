import { Pressable, StyleSheet, Text, View } from "react-native";

import { SellTextField } from "@/components/sell/SellTextField";
import { colors } from "@/constants/colors";
import { SellFormDraft } from "@/types/sell";

const categories = ["Cycling", "Winter", "Outdoor", "Music", "Cameras", "Fitness", "Gaming", "Kids’ Gear"];
const conditions = ["New", "Like new", "Good", "Fair", "Poor"];

type DetailsStepProps = {
  form: SellFormDraft;
  error?: string | null;
  onChange: <Key extends keyof SellFormDraft>(key: Key, value: SellFormDraft[Key]) => void;
};

export function DetailsStep({ form, error, onChange }: DetailsStepProps) {
  return (
    <>
      <View style={styles.headerBlock}>
        <Text style={styles.screenTitle}>Item details</Text>
        <Text style={styles.screenSubtitle}>Help buyers understand exactly what you are selling.</Text>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <SellTextField label="Title" value={form.title} placeholder="Example: MSR Hubba NX 2-Person Tent" maxLength={70} onChangeText={(value) => onChange("title", value)} />

      <View style={styles.section}>
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryGrid}>
          {categories.map((category) => {
            const selected = form.categoryName === category;
            return (
              <Pressable key={category} style={[styles.categoryChip, selected && styles.selectedChip]} onPress={() => onChange("categoryName", category)}>
                <Text style={[styles.categoryText, selected && styles.selectedText]}>{category}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Condition</Text>
        <Text style={styles.helperText}>Choose the option that best matches the item.</Text>
        <View style={styles.conditionChips}>
          {conditions.map((condition) => {
            const selected = form.conditionLabel === condition;
            return (
              <Pressable key={condition} style={[styles.conditionChip, selected && styles.selectedChip]} onPress={() => onChange("conditionLabel", condition)}>
                <Text style={[styles.conditionText, selected && styles.selectedText]}>{condition}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.fieldRow}>
        <View style={styles.fieldItem}>
          <SellTextField label="Brand" value={form.brand} placeholder="Optional" onChangeText={(value) => onChange("brand", value)} />
        </View>
        <View style={styles.fieldItem}>
          <SellTextField label="Model" value={form.model} placeholder="Optional" onChangeText={(value) => onChange("model", value)} />
        </View>
      </View>

      <SellTextField label="Description" value={form.description} placeholder="Tell buyers what is included, how much it has been used and why you are selling it." multiline onChangeText={(value) => onChange("description", value)} />
    </>
  );
}

const styles = StyleSheet.create({
  headerBlock: { marginBottom: 14 },
  screenTitle: { color: colors.text, fontSize: 22, fontWeight: "800", letterSpacing: -0.3, lineHeight: 28 },
  screenSubtitle: { marginTop: 5, color: colors.mutedStrong, fontSize: 13, fontWeight: "500", lineHeight: 18 },
  errorText: { marginBottom: 10, color: colors.danger, fontSize: 12, fontWeight: "700", lineHeight: 16 },
  section: { marginBottom: 15 },
  label: { marginBottom: 7, color: colors.text, fontSize: 14, fontWeight: "800" },
  helperText: { marginTop: -2, marginBottom: 9, color: colors.mutedStrong, fontSize: 12.5, fontWeight: "500", lineHeight: 17 },
  categoryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  categoryChip: { minHeight: 34, justifyContent: "center", borderRadius: 17, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 12 },
  categoryText: { color: colors.mutedStrong, fontSize: 12, fontWeight: "800" },
  conditionChips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  conditionChip: { minHeight: 34, justifyContent: "center", borderRadius: 17, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 12 },
  conditionText: { color: colors.text, fontSize: 12, fontWeight: "700" },
  selectedChip: { borderColor: colors.buttonPrimary, backgroundColor: colors.buttonPrimary },
  selectedText: { color: colors.buttonPrimaryText },
  fieldRow: { flexDirection: "row", gap: 9 },
  fieldItem: { flex: 1 }
});
