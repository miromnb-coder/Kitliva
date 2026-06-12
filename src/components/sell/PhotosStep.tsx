import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { PhotoUploadPreview } from "@/components/sell/PhotoUploadPreview";
import { colors } from "@/constants/colors";
import { SellFormDraft, SellPhoto } from "@/types/sell";

type PhotosStepProps = {
  photos: SellPhoto[];
  form?: SellFormDraft;
  error?: string | null;
  onChange?: <Key extends keyof SellFormDraft>(key: Key, value: SellFormDraft[Key]) => void;
  onAddPhotos: (photos: SellPhoto[]) => void;
  onRemovePhoto: (photoId: string) => void;
};

const conditions = ["New", "Like new", "Good", "Fair", "Poor"];

export function PhotosStep({ photos, form, error, onChange, onAddPhotos, onRemovePhoto }: PhotosStepProps) {
  return (
    <>
      <PhotoUploadPreview photos={photos} error={error} onAddPhotos={onAddPhotos} onRemovePhoto={onRemovePhoto} />

      {form && onChange ? (
        <>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Title</Text>
            <View style={styles.inputRow}>
              <TextInput style={styles.titleInput} value={form.title} onChangeText={(value) => onChange("title", value)} placeholder="Example: MSR Hubba NX 2-Person Tent" placeholderTextColor={colors.inputPlaceholder} maxLength={70} />
              <Ionicons name="create-outline" size={18} color={colors.muted} />
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Condition</Text>
            <Text style={styles.helperText}>Choose the option that best matches your item.</Text>
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

          <View style={styles.priceInputCard}>
            <Text style={styles.priceLabel}>Set your price</Text>
            <TextInput style={styles.priceInput} value={form.priceLabel} onChangeText={(value) => onChange("priceLabel", value)} placeholder="€220" placeholderTextColor={colors.inputPlaceholder} keyboardType="decimal-pad" />
          </View>
        </>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: 14, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 14 },
  cardTitle: { color: colors.text, fontSize: 14, fontWeight: "700", lineHeight: 18 },
  inputRow: { height: 48, marginTop: 12, flexDirection: "row", alignItems: "center", borderRadius: 13, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 13 },
  titleInput: { flex: 1, color: colors.text, fontSize: 14, fontWeight: "600", paddingVertical: 0 },
  helperText: { marginTop: 5, color: colors.mutedStrong, fontSize: 12.5, fontWeight: "500", lineHeight: 17 },
  conditionChips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  conditionChip: { minHeight: 34, justifyContent: "center", borderRadius: 17, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 12 },
  selectedChip: { borderColor: colors.buttonPrimary, backgroundColor: colors.buttonPrimary },
  conditionText: { color: colors.text, fontSize: 12, fontWeight: "700" },
  selectedText: { color: colors.buttonPrimaryText },
  priceInputCard: { height: 58, marginTop: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 14 },
  priceLabel: { color: colors.text, fontSize: 14, fontWeight: "700" },
  priceInput: { width: 166, height: 42, borderRadius: 13, borderWidth: 1, borderColor: colors.border, color: colors.text, fontSize: 14, fontWeight: "600", paddingHorizontal: 14, paddingVertical: 0 }
});
