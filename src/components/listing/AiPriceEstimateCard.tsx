import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { useI18n } from "@/i18n";
import { Listing } from "@/types/listing";
import { formatPrice } from "@/utils/formatPrice";

type AiPriceEstimateCardProps = {
  listing: Listing;
};

export function AiPriceEstimateCard({ listing }: AiPriceEstimateCardProps) {
  const { t } = useI18n();

  return (
    <View style={styles.card}>
      <View style={styles.leftSide}>
        <Ionicons name="trending-up-outline" size={24} color="#7B623C" />
        <View style={styles.leftTextWrap}>
          <Text style={styles.label}>{t("listing.priceInsight")}</Text>
          <Text style={styles.sub}>{t("listing.priceInsightSub")}</Text>
        </View>
      </View>

      <View style={styles.rightSide}>
        <Text style={styles.rangeLabel}>{t("listing.fairPriceRange")}</Text>
        <Text style={styles.estimate}>{formatPrice(listing.aiPriceMin, listing.currency)} – {formatPrice(listing.aiPriceMax, listing.currency)}</Text>
        <View style={styles.sliderTrack}>
          <View style={styles.sliderFill} />
          <View style={styles.sliderDot} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 88,
    flexDirection: "row",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.softGold,
    padding: 14,
    marginTop: 18
  },
  leftSide: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center"
  },
  leftTextWrap: {
    flex: 1,
    marginLeft: 10
  },
  label: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "700"
  },
  sub: {
    marginTop: 4,
    color: colors.mutedStrong,
    fontSize: 10.5,
    fontWeight: "400",
    lineHeight: 14
  },
  rightSide: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
    paddingLeft: 14,
    justifyContent: "center"
  },
  rangeLabel: {
    color: colors.mutedStrong,
    fontSize: 10.5,
    fontWeight: "600"
  },
  estimate: {
    marginTop: 3,
    color: colors.text,
    fontSize: 19,
    fontWeight: "500",
    letterSpacing: -0.3
  },
  sliderTrack: {
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#D8C9B7",
    marginTop: 9
  },
  sliderFill: {
    width: "58%",
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.accent
  },
  sliderDot: {
    position: "absolute",
    left: "58%",
    top: -4,
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: "#7B623C"
  }
});
