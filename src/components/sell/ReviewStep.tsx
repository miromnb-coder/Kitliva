import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { useI18n } from "@/i18n";
import { SellFormDraft, SellPhoto } from "@/types/sell";

type ReviewStepProps = {
  form: SellFormDraft;
  photos: SellPhoto[];
  publishError?: string | null;
};

function formatPrice(priceLabel: string, notAdded: string) {
  const trimmed = priceLabel.trim();
  if (!trimmed) return notAdded;
  return trimmed.startsWith("€") ? trimmed : `€${trimmed}`;
}

function optionalValue(value: string, notAdded: string) {
  return value.trim() || notAdded;
}

function isConnectionError(message?: string | null) {
  return Boolean(message?.toLowerCase().includes("connection"));
}

function getConditionKey(conditionLabel: string) {
  const normalized = conditionLabel.trim().toLowerCase();
  if (normalized === "new") return "condition.new";
  if (normalized === "like new") return "condition.like_new";
  if (normalized === "good") return "condition.good";
  if (normalized === "fair") return "condition.fair";
  if (normalized === "poor") return "condition.poor";
  return null;
}

export function ReviewStep({ form, photos, publishError }: ReviewStepProps) {
  const { t } = useI18n();
  const [coverFailed, setCoverFailed] = useState(false);
  const coverUri = photos[0]?.uri;
  const photoCount = photos.length;
  const notAdded = t("sell.review.notAdded");
  const photoWord = photoCount === 1 ? t("sell.review.photoSingular") : t("sell.review.photoPlural");
  const conditionKey = getConditionKey(form.conditionLabel);
  const conditionLabel = conditionKey ? t(conditionKey) : form.conditionLabel;
  const delivery = [form.allowPickup ? t("sell.review.pickup") : null, form.allowShipping ? t("sell.review.shipping") : null].filter(Boolean).join(" + ") || notAdded;
  const location = [form.locationCity, form.locationCountry].filter(Boolean).join(", ");
  const details = [
    { label: t("sell.details.category"), value: form.categoryName, optional: false },
    { label: t("sell.details.condition"), value: conditionLabel, optional: false },
    { label: t("sell.details.brand"), value: optionalValue(form.brand, notAdded), optional: !form.brand.trim() },
    { label: t("sell.details.model"), value: optionalValue(form.model, notAdded), optional: !form.model.trim() },
    { label: t("sell.pricing.price"), value: formatPrice(form.priceLabel, notAdded), optional: false },
    { label: t("explore.filters.location"), value: location || notAdded, optional: !location },
    { label: t("sell.review.delivery"), value: delivery, optional: delivery === notAdded },
    { label: t("sell.review.photos"), value: `${photoCount} ${photoWord}`, optional: false }
  ];
  const showCover = Boolean(coverUri && !coverFailed);

  return (
    <>
      <View style={styles.headerBlock}>
        <Text style={styles.screenTitle}>{t("sell.review.title")}</Text>
        <Text style={styles.screenSubtitle}>{t("sell.review.subtitle")}</Text>
      </View>

      {publishError ? (
        <View style={styles.errorCard}>
          <View style={styles.errorIconCircle}>
            <Ionicons name="alert-circle-outline" size={18} color={colors.dangerText} />
          </View>
          <View style={styles.errorContent}>
            <Text style={styles.errorTitle}>{isConnectionError(publishError) ? t("sell.review.photosUploadTitle") : t("sell.review.needsDetailsTitle")}</Text>
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
            {form.title || t("sell.review.untitled")}
          </Text>
          <Text style={styles.previewMeta}>{form.categoryName || t("sell.review.categoryFallback")} • {conditionLabel || t("sell.review.conditionFallback")}</Text>
          <Text style={styles.previewPrice}>{formatPrice(form.priceLabel, notAdded)}</Text>
          <Text style={styles.previewLocation} numberOfLines={1}>{location || t("sell.review.locationNotAdded")}</Text>
          <View style={styles.photoBadge}>
            <Ionicons name="image-outline" size={13} color={colors.primary} style={styles.photoIcon} />
            <Text style={styles.photoBadgeText}>{photoCount} {photoWord}</Text>
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
          <Text style={styles.safetyTitle}>{t("sell.review.safeTitle")}</Text>
          <Text style={styles.safetyText}>{t("sell.review.safeBody")}</Text>
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
