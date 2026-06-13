import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import { SellFlowActions } from "@/components/sell/SellFlowActions";
import { colors } from "@/constants/colors";
import { mockSellListing } from "@/data/mockSellListing";
import { useI18n } from "@/i18n";
import { PublishedListing } from "@/types/listing";

type PublishSuccessStepProps = {
  listing: PublishedListing | null;
  onCreateAnother: () => void;
  onViewListing?: () => void;
};

function formatPrice(listing: PublishedListing | null) {
  if (!listing) {
    return mockSellListing.price.replace(" ", "");
  }

  const symbol = listing.priceCurrency === "EUR" ? "€" : listing.priceCurrency;

  return `${symbol}${listing.priceAmount}`;
}

export function PublishSuccessStep({ listing, onCreateAnother, onViewListing }: PublishSuccessStepProps) {
  const { t } = useI18n();
  const title = listing?.title ?? mockSellListing.title;
  const category = listing?.categoryName ?? mockSellListing.category;
  const condition = listing?.conditionLabel ?? mockSellListing.condition;
  const nextSteps = [
    { icon: "search-outline" as const, text: t("sell.success.nextFind") },
    { icon: "chatbubble-outline" as const, text: t("sell.success.nextInbox") },
    { icon: "cube-outline" as const, text: t("sell.success.nextReady") }
  ];

  return (
    <>
      <View style={styles.successCard}>
        <View style={styles.successIconCircle}>
          <Ionicons name="checkmark" size={34} color={colors.primary} />
        </View>
        <Text style={styles.successTitle}>{t("sell.success.title")}</Text>
        <Text style={styles.successSubtitle}>{t("sell.success.subtitle")}</Text>
      </View>

      <View style={styles.previewCard}>
        <Image source={{ uri: listing?.coverImageUrl ?? mockSellListing.photos[0] }} style={styles.previewImage} contentFit="cover" transition={180} />

        <View style={styles.previewContent}>
          <View style={styles.previewTopRow}>
            <Text style={styles.previewTitle} numberOfLines={2}>
              {title}
            </Text>
            <View style={styles.liveBadge}>
              <Text style={styles.liveBadgeText}>{t("sell.success.live")}</Text>
            </View>
          </View>
          <Text style={styles.previewMeta}>{category} • {condition} {t("sell.success.condition")}</Text>
          <Text style={styles.previewPrice}>{formatPrice(listing)}</Text>
        </View>
      </View>

      <View style={styles.nextSection}>
        <Text style={styles.nextTitle}>{t("sell.success.nextTitle")}</Text>
        <View style={styles.nextCard}>
          {nextSteps.map((item, index) => (
            <View key={item.text} style={[styles.nextRow, index === nextSteps.length - 1 && styles.lastNextRow]}>
              <View style={styles.nextIconCircle}>
                <Ionicons name={item.icon} size={14} color={colors.primary} />
              </View>
              <Text style={styles.nextText}>{item.text}</Text>
            </View>
          ))}
        </View>
      </View>

      <SellFlowActions
        primaryLabel={t("sell.success.viewListing")}
        onPrimaryPress={onViewListing ?? (() => undefined)}
        secondaryLabel={t("sell.success.createAnother")}
        onSecondaryPress={onCreateAnother}
      />
    </>
  );
}

const styles = StyleSheet.create({
  successCard: {
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 18,
    paddingVertical: 22,
    marginTop: 22,
    marginBottom: 16
  },
  successIconCircle: {
    width: 66,
    height: 66,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 33,
    backgroundColor: colors.mint,
    marginBottom: 15
  },
  successTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.3,
    textAlign: "center"
  },
  successSubtitle: {
    marginTop: 7,
    color: colors.muted,
    fontSize: 13.5,
    fontWeight: "500",
    lineHeight: 19,
    textAlign: "center"
  },
  previewCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 12,
    marginBottom: 15
  },
  previewImage: {
    width: 76,
    height: 76,
    borderRadius: 12,
    backgroundColor: colors.softGreen,
    marginRight: 12
  },
  previewContent: {
    flex: 1
  },
  previewTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8
  },
  previewTitle: {
    flex: 1,
    color: colors.text,
    fontSize: 14.5,
    fontWeight: "800",
    lineHeight: 18
  },
  previewMeta: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 11.5,
    fontWeight: "500"
  },
  previewPrice: {
    marginTop: 6,
    color: colors.text,
    fontSize: 17,
    fontWeight: "800"
  },
  liveBadge: {
    height: 24,
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: colors.mint,
    paddingHorizontal: 9
  },
  liveBadgeText: {
    color: colors.primary,
    fontSize: 11.5,
    fontWeight: "800"
  },
  nextSection: {
    marginBottom: 18
  },
  nextTitle: {
    marginBottom: 10,
    color: colors.text,
    fontSize: 16,
    fontWeight: "800"
  },
  nextCard: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  nextRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10
  },
  lastNextRow: {
    marginBottom: 0
  },
  nextIconCircle: {
    width: 25,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12.5,
    backgroundColor: colors.mint,
    marginRight: 10
  },
  nextText: {
    flex: 1,
    color: colors.text,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18
  }
});
