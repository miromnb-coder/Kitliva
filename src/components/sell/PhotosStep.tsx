import { StyleSheet, Text, TextInput, View } from "react-native";

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

export function PhotosStep({ photos, form, error, onChange, onAddPhotos, onRemovePhoto }: PhotosStepProps) {
  return (
    <>
      <PhotoUploadPreview photos={photos} error={error} onAddPhotos={onAddPhotos} onRemovePhoto={onRemovePhoto} />
      {form && onChange ? (
        <View style={styles.card}>
          <Text style={styles.label}>Title</Text>
          <TextInput style={styles.input} value={form.title} onChangeText={(value) => onChange("title", value)} placeholder="Item title" placeholderTextColor={colors.inputPlaceholder} maxLength={70} />
          <Text style={styles.label}>Price</Text>
          <TextInput style={styles.input} value={form.priceLabel} onChangeText={(value) => onChange("priceLabel", value)} placeholder="€220" placeholderTextColor={colors.inputPlaceholder} keyboardType="decimal-pad" />
          <View style={styles.row}>
            <View style={styles.item}>
              <Text style={styles.label}>City</Text>
              <TextInput style={styles.input} value={form.locationCity} onChangeText={(value) => onChange("locationCity", value)} placeholder="City" placeholderTextColor={colors.inputPlaceholder} />
            </View>
            <View style={styles.item}>
              <Text style={styles.label}>Country</Text>
              <TextInput style={styles.input} value={form.locationCountry} onChangeText={(value) => onChange("locationCountry", value)} placeholder="Country" placeholderTextColor={colors.inputPlaceholder} />
            </View>
          </View>
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: 14, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 14 },
  label: { marginTop: 10, marginBottom: 7, color: colors.text, fontSize: 14, fontWeight: "700" },
  input: { minHeight: 48, borderRadius: 13, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, color: colors.text, fontSize: 14, fontWeight: "600", paddingHorizontal: 13 },
  row: { flexDirection: "row", gap: 9 },
  item: { flex: 1 }
});
