import { StyleSheet, Text, TextInput, View } from "react-native";

import { PhotoUploadPreview } from "@/components/sell/PhotoUploadPreview";
import { colors } from "@/constants/colors";
import { useI18n } from "@/i18n";
import { SellFormDraft, SellPhoto } from "@/types/sell";

type PhotosStepProps = {
  photos: SellPhoto[];
  form?: SellFormDraft;
  error?: string | null;
  isDraftRestored?: boolean;
  onChange?: <Key extends keyof SellFormDraft>(key: Key, value: SellFormDraft[Key]) => void;
  onAddPhotos: (photos: SellPhoto[]) => void;
  onRemovePhoto: (photoId: string) => void;
};

export function PhotosStep({ photos, form, error, isDraftRestored = false, onChange, onAddPhotos, onRemovePhoto }: PhotosStepProps) {
  const { t } = useI18n();

  return (
    <>
      <PhotoUploadPreview photos={photos} error={error} isDraftRestored={isDraftRestored} onAddPhotos={onAddPhotos} onRemovePhoto={onRemovePhoto} />
      {form && onChange ? (
        <View style={styles.card}>
          <Text style={styles.label}>{t("sell.details.titleLabel")}</Text>
          <TextInput style={styles.input} value={form.title} onChangeText={(value) => onChange("title", value)} placeholder={t("sell.details.titlePlaceholder")} placeholderTextColor={colors.inputPlaceholder} maxLength={70} />
          <Text style={styles.label}>{t("sell.pricing.price")}</Text>
          <TextInput style={styles.input} value={form.priceLabel} onChangeText={(value) => onChange("priceLabel", value)} placeholder="€220" placeholderTextColor={colors.inputPlaceholder} keyboardType="decimal-pad" />
          <View style={styles.row}>
            <View style={styles.item}>
              <Text style={styles.label}>{t("sell.delivery.city")}</Text>
              <TextInput style={styles.input} value={form.locationCity} onChangeText={(value) => onChange("locationCity", value)} placeholder={t("sell.delivery.city")} placeholderTextColor={colors.inputPlaceholder} />
            </View>
            <View style={styles.item}>
              <Text style={styles.label}>{t("sell.delivery.country")}</Text>
              <TextInput style={styles.input} value={form.locationCountry} onChangeText={(value) => onChange("locationCountry", value)} placeholder={t("sell.delivery.country")} placeholderTextColor={colors.inputPlaceholder} />
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
