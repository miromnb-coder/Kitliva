import { useState } from "react";
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

function formatPrice(priceLabel: string) {
  const trimmed = priceLabel.trim();
  if (!trimmed) return "Not added";
  return trimmed.startsWith("€") ? trimmed : `€${trimmed}`;
}

function optionalValue(value: string) {
  return value.trim() || "Not added";
}

export function ReviewStep({ form, photos, publishError }: ReviewStepProps) {
  const [coverFailed, setCoverFailed] = useState(false);
  const coverUri = photos[0]?.uri;
  const photoCount = photos.length;
  const delivery = [form.allowPickup ? "Pickup" : null, form.allowShipping ? "Shipping" : null].filter(Boolean).join(" + ") || "Not added";
  const location = [form.locationCity, form.locationCountry].filter(Boolean).join(", ");
  const details = [
    { label: "Category", value: form.categoryName, optional: false },
    { label: "Condition", value: form.conditionLabel, optional: false },
    { label: "Brand", value: optionalValue(form.brand), optional: !form.brand.trim() },
    { label: "Model", value: optionalValue(form.model), optional: !form.model.trim() },
    { label: "Price", value: formatPrice(form.priceLabel), optional: false },
    { label: "Location", value: location || "Not added", optional: !location },
    { label: "Delivery", value: delivery, optional: delivery === "Not added" },
    { label: "Photos", value: `${photoCount} ${photoCount === 1 ? "photo" : "photos"}`, optional: false }
  ];
  const showCover = Boolean(coverUri && !coverFailed);

  return (
    <>
      <View style={styles.headerBlock}>
        <Text style={styles.screenTitle}>Review your listing</Text>
        <Text style={styles.screenSubtitle}>Check the details before publishing.</Text>
      </View>

      {publishError ? (
        <View style={styles.errorCard}>
          <View style={styles.errorIconCircle}>
            <Ionicons name="alert-circle-outline" size={18} color={colors.dangerText} />
          </View>
          <View style={styles.errorContent}>
            <Text style={styles.errorTitle}>Listing needs details</Text>
            <Text style={styles.errorText}>{publishError}</Text>
          </View>
        </View>
      ) : null}

      <View style={styles.previewCard}>
        {showCover ? (
          <Image source={{ uri: coverUri }} style={styles.previewImage} contentFit="cover" transition={180} onError={() => setCoverFailed(true)} />
        ) : (
          <View style={styles.previewPlaceholder}>
            <Ionicons name="image-outline" size={24} color={colors.primary} />
          </View>
        )}

        <View style={styles.previewContent}>
          <Text style={styles.previewTitle} numberOfLines={2}>
            {form.title || "Untitled listing"}
          </Text>
          <Text style={styles.previewMeta}>{form.categoryName || "Category"} • {form.conditionLabel || "Condition"}</Text>
          <Text style={styles.previewPrice}>{formatPrice(form.priceLabel)}</Text>
          <Text style={styles.previewLocation} numberOfLines={1}>{location || "Location not added"}</Text>
          <View style={styles.photoBadge}>
            <Ionicons name="image-outline" size={13} color={colors.primary} style={styles.photoIcon} />
            <Text style={styles.photoBadgeText}>{photoCount} {photoCount === 1 ? "photo" : "photos"}</Text>
          </View>
        </View>
      </View>

      <View style={styles.summaryCard}>
        {details.map((item, index) => (
          <View key={item.label}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{item.label}</Text>
              <Text style={[styles.summaryValue, item.optional && styles.optionalSummaryValue]} numberOfLines={1}>{item.value}</Text>
            </View>
            {index < details.length - 1 ? <View style={styles.separator} /> : null}
          </View>
        ))}
      </View>

      <View style={styles.safetyCard}>
        <View style={styles.safetyIconCircle}>
          <Ionicons name="shield-checkmark-outline" size={17} color={colors.primary} />
        </View>
        <View style={styles.safetyContent}>
          <Text style={styles.safetyTitle}>Sell safely</Text>
          <Text style={styles.safetyText}>Keep conversations in Kitliva and agree pickup or shipping details clearly with the buyer.</Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  headerBlock: { marginBottom: 14 },
  screenTitle: { color: colors.text, fontSize: 22, fontWeight: "800", letterSpacing: -0.3, lineHeight: 28 },
  screenSubtitle: { marginTop: 5, color: colors.mutedStrong, fontSize: 13, fontWeight: "500", lineHeight: 18 },
  errorCard: { minHeight: 68, flexDirection: "row", alignItems: "center", borderRadius: 16, borderWidth: 1, borderColor: colors.dangerBorder, backgroundColor: colors.dangerSurface, padding: 12, marginBottom: 15 },
  errorIconCircle: { width: 36, height: 36, alignItems: "center", justifyContent: "center", borderRadius: 18, backgroundColor: colors.surface, marginRight: 11 },
  errorContent: { flex: 1 },
  errorTitle: { color: colors.dangerText, fontSize: 12.5, fontWeight: "800" },
  errorText: { marginTop: 3, color: colors.dangerText, fontSize: 12, fontWeight: "500", lineHeight: 16 },
  previewCard: { minHeight: 122, flexDirection: "row", borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 12, marginBottom: 15 },
  previewImage: { width: 96, height: 96, borderRadius: 14, backgroundColor: colors.softGreen, marginRight: 12 },
  previewPlaceholder: { width: 96, height: 96, alignItems: "center", justifyContent: "center", borderRadius: 14, backgroundColor: colors.softGreen, marginRight: 12 },
  previewContent: { flex: 1 },
  previewTitle: { color: colors.text, fontSize: 15, fontWeight: "800", lineHeight: 19 },
  previewMeta: { marginTop: 4, color: colors.muted, fontSize: 12, fontWeight: "500" },
  previewPrice: { marginTop: 6, color: colors.text, fontSize: 18, fontWeight: "800" },
  previewLocation: { marginTop: 4, color: colors.mutedStrong, fontSize: 12, fontWeight: "500" },
  photoBadge: { alignSelf: "flex-start", height: 24, flexDirection: "row", alignItems: "center", borderRadius: 12, backgroundColor: colors.softGreen, paddingHorizontal: 8, marginTop: 7 },
  photoIcon: { marginRight: 4 },
  photoBadgeText: { color: colors.primary, fontSize: 11.5, fontWeight: "800" },
  summaryCard: { overflow: "hidden", borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, marginBottom: 15 },
  summaryRow: { minHeight: 42, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 13 },
  summaryLabel: { color: colors.muted, fontSize: 12.5, fontWeight: "600" },
  summaryValue: { maxWidth: "58%", color: colors.text, fontSize: 12.5, fontWeight: "800", textAlign: "right" },
  optionalSummaryValue: { color: colors.muted, fontWeight: "600" },
  separator: { height: 1, marginLeft: 13, backgroundColor: colors.border },
  safetyCard: { flexDirection: "row", alignItems: "flex-start", borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 14, marginBottom: 15 },
  safetyIconCircle: { width: 32, height: 32, alignItems: "center", justifyContent: "center", borderRadius: 16, backgroundColor: colors.softGreen, marginRight: 11 },
  safetyContent: { flex: 1 },
  safetyTitle: { color: colors.text, fontSize: 14, fontWeight: "800", lineHeight: 18 },
  safetyText: { marginTop: 4, color: colors.mutedStrong, fontSize: 12.5, fontWeight: "500", lineHeight: 17 }
});
