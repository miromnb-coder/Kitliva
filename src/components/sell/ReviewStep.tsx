import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { SellFormDraft, SellPhoto } from "@/types/sell";

type ReviewStepProps = {
  form: SellFormDraft;
  photos: SellPhoto[];
  publishError?: string | null;
};

export function ReviewStep({ form, photos, publishError }: ReviewStepProps) {
  const coverUri = photos[0]?.uri;
  const photoCount = photos.length;
  const delivery = [form.allowPickup ? "Pickup" : null, form.allowShipping ? "Shipping" : null].filter(Boolean).join(" + ");
  const details = [
    { label: "Category", value: form.categoryName },
    { label: "Condition", value: form.conditionLabel },
    { label: "Price", value: `€${form.priceLabel}` },
    { label: "Location", value: [form.locationCity, form.locationCountry].filter(Boolean).join(", ") },
    { label: "Delivery", value: delivery }
  ];

  return (
    <>
      <View style={styles.headerBlock}>
        <Text style={styles.screenTitle}>Review your listing</Text>
        <Text style={styles.screenSubtitle}>Check your own details before publishing.</Text>
      </View>

      {publishError ? (
        <View style={styles.errorCard}>
          <View style={styles.errorIconCircle}>
            <Ionicons name="alert-circle-outline" size={18} color={colors.primary} />
          </View>
          <View style={styles.errorContent}>
            <Text style={styles.errorTitle}>Listing needs details</Text>
            <Text style={styles.errorText}>{publishError}</Text>
          </View>
        </View>
      ) : null}

      <View style={styles.previewCard}>
        {coverUri ? (
          <Image source={{ uri: coverUri }} style={styles.previewImage} contentFit="cover" transition={180} />
        ) : (
          <View style={styles.previewPlaceholder}>
            <Ionicons name="image-outline" size={22} color={colors.primary} />
          </View>
        )}

        <View style={styles.previewContent}>
          <Text style={styles.previewTitle} numberOfLines={2}>
            {form.title}
          </Text>
          <Text style={styles.previewMeta}>{form.categoryName} • {form.conditionLabel}</Text>
          <Text style={styles.previewPrice}>€{form.priceLabel}</Text>
          <View style={styles.photoBadge}>
            <Ionicons name="image-outline" size={13} color={colors.primary} style={styles.photoIcon} />
            <Text style={styles.photoBadgeText}>{photoCount} photos</Text>
          </View>
        </View>
      </View>

      <View style={styles.summaryCard}>
        {details.map((item, index) => (
          <View key={item.label}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{item.label}</Text>
              <Text style={styles.summaryValue} numberOfLines={1}>{item.value}</Text>
            </View>
            {index < details.length - 1 ? <View style={styles.separator} /> : null}
          </View>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  headerBlock: { marginBottom: 14 },
  screenTitle: { color: colors.text, fontSize: 18, fontWeight: "800", letterSpacing: -0.2 },
  screenSubtitle: { marginTop: 3, color: colors.muted, fontSize: 12.5, fontWeight: "500" },
  errorCard: { minHeight: 68, flexDirection: "row", alignItems: "center", borderRadius: 15, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 12, marginBottom: 15 },
  errorIconCircle: { width: 36, height: 36, alignItems: "center", justifyContent: "center", borderRadius: 18, backgroundColor: colors.mint, marginRight: 11 },
  errorContent: { flex: 1 },
  errorTitle: { color: colors.text, fontSize: 12.5, fontWeight: "800" },
  errorText: { marginTop: 3, color: colors.muted, fontSize: 12, fontWeight: "500", lineHeight: 16 },
  previewCard: { minHeight: 114, flexDirection: "row", borderRadius: 15, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 12, marginBottom: 15 },
  previewImage: { width: 86, height: 86, borderRadius: 12, backgroundColor: "#EDF2F0", marginRight: 12 },
  previewPlaceholder: { width: 86, height: 86, alignItems: "center", justifyContent: "center", borderRadius: 12, backgroundColor: colors.mint, marginRight: 12 },
  previewContent: { flex: 1 },
  previewTitle: { color: colors.text, fontSize: 14.5, fontWeight: "800", lineHeight: 18 },
  previewMeta: { marginTop: 4, color: colors.muted, fontSize: 11.5, fontWeight: "500" },
  previewPrice: { marginTop: 7, color: colors.text, fontSize: 17, fontWeight: "800" },
  photoBadge: { alignSelf: "flex-start", height: 24, flexDirection: "row", alignItems: "center", borderRadius: 12, backgroundColor: colors.mint, paddingHorizontal: 8, marginTop: 7 },
  photoIcon: { marginRight: 4 },
  photoBadgeText: { color: colors.primary, fontSize: 11.5, fontWeight: "800" },
  summaryCard: { overflow: "hidden", borderRadius: 15, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, marginBottom: 15 },
  summaryRow: { minHeight: 41, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 13 },
  summaryLabel: { color: colors.muted, fontSize: 12.5, fontWeight: "600" },
  summaryValue: { maxWidth: "58%", color: colors.text, fontSize: 12.5, fontWeight: "800", textAlign: "right" },
  separator: { height: 1, marginLeft: 13, backgroundColor: colors.border }
});
