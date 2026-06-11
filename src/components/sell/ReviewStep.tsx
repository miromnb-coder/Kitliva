import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { mockSellListing } from "@/data/mockSellListing";
import { SellPhoto } from "@/types/sell";

const details = [
  { label: "Category", value: mockSellListing.category },
  { label: "Condition", value: mockSellListing.condition },
  { label: "Price", value: mockSellListing.price.replace(" ", "") },
  { label: "Location", value: mockSellListing.location },
  { label: "Delivery", value: mockSellListing.delivery }
];

type ReviewStepProps = {
  photos: SellPhoto[];
  publishError?: string | null;
};

export function ReviewStep({ photos, publishError }: ReviewStepProps) {
  const coverUri = photos[0]?.uri ?? mockSellListing.photos[0];
  const photoCount = photos.length;

  return (
    <>
      <View style={styles.headerBlock}>
        <Text style={styles.screenTitle}>Review your listing</Text>
        <Text style={styles.screenSubtitle}>Make sure everything looks right before publishing.</Text>
      </View>

      {publishError ? (
        <View style={styles.errorCard}>
          <View style={styles.errorIconCircle}>
            <Ionicons name="alert-circle-outline" size={18} color={colors.primary} />
          </View>
          <View style={styles.errorContent}>
            <Text style={styles.errorTitle}>Could not publish listing</Text>
            <Text style={styles.errorText}>{publishError}</Text>
          </View>
        </View>
      ) : null}

      <View style={styles.previewCard}>
        <Image source={{ uri: coverUri }} style={styles.previewImage} contentFit="cover" transition={180} />

        <View style={styles.previewContent}>
          <Text style={styles.previewTitle} numberOfLines={2}>
            {mockSellListing.title}
          </Text>
          <Text style={styles.previewMeta}>{mockSellListing.category} • {mockSellListing.condition} condition</Text>
          <Text style={styles.previewPrice}>{mockSellListing.price.replace(" ", "")}</Text>
          <View style={styles.photoBadge}>
            <Ionicons name="image-outline" size={13} color={colors.primary} style={styles.photoIcon} />
            <Text style={styles.photoBadgeText}>{photoCount} photos</Text>
          </View>
        </View>
      </View>

      <View style={styles.aiCard}>
        <View style={styles.aiIconCircle}>
          <Ionicons name="sparkles" size={18} color={colors.primary} />
        </View>
        <View style={styles.aiContent}>
          <Text style={styles.aiTitle}>AI check</Text>
          <Text style={styles.aiText}>Looks good for publishing. Suggested price range: €200 - €240.</Text>
        </View>
      </View>

      <View style={styles.summaryCard}>
        {details.map((item, index) => (
          <View key={item.label}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{item.label}</Text>
              <Text style={styles.summaryValue}>{item.value}</Text>
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
  previewContent: { flex: 1 },
  previewTitle: { color: colors.text, fontSize: 14.5, fontWeight: "800", lineHeight: 18 },
  previewMeta: { marginTop: 4, color: colors.muted, fontSize: 11.5, fontWeight: "500" },
  previewPrice: { marginTop: 7, color: colors.text, fontSize: 17, fontWeight: "800" },
  photoBadge: { alignSelf: "flex-start", height: 24, flexDirection: "row", alignItems: "center", borderRadius: 12, backgroundColor: colors.mint, paddingHorizontal: 8, marginTop: 7 },
  photoIcon: { marginRight: 4 },
  photoBadgeText: { color: colors.primary, fontSize: 11.5, fontWeight: "800" },
  aiCard: { minHeight: 68, flexDirection: "row", alignItems: "center", borderRadius: 15, borderWidth: 1, borderColor: "#BFE9DC", backgroundColor: colors.mint, padding: 12, marginBottom: 15 },
  aiIconCircle: { width: 36, height: 36, alignItems: "center", justifyContent: "center", borderRadius: 18, backgroundColor: colors.surface, marginRight: 11 },
  aiContent: { flex: 1 },
  aiTitle: { color: colors.primary, fontSize: 12.5, fontWeight: "800" },
  aiText: { marginTop: 3, color: "#51706E", fontSize: 12, fontWeight: "500", lineHeight: 16 },
  summaryCard: { overflow: "hidden", borderRadius: 15, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, marginBottom: 15 },
  summaryRow: { minHeight: 41, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 13 },
  summaryLabel: { color: colors.muted, fontSize: 12.5, fontWeight: "600" },
  summaryValue: { color: colors.text, fontSize: 12.5, fontWeight: "800" },
  separator: { height: 1, marginLeft: 13, backgroundColor: colors.border }
});
