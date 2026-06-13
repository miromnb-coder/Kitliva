import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { useI18n } from "@/i18n";
import { Listing } from "@/types/listing";
import { formatPrice } from "@/utils/formatPrice";

type ListingInfoProps = {
  listing: Listing;
};

function getConditionKey(conditionLabel: string) {
  const normalized = conditionLabel.trim().toLowerCase();
  if (normalized === "new") return "condition.new";
  if (normalized === "like new") return "condition.like_new";
  if (normalized === "good") return "condition.good";
  if (normalized === "fair") return "condition.fair";
  if (normalized === "poor") return "condition.poor";
  return null;
}

export function ListingInfo({ listing }: ListingInfoProps) {
  const { t } = useI18n();
  const conditionKey = getConditionKey(listing.conditionLabel);

  return (
    <View>
      <Text style={styles.title} numberOfLines={2}>{listing.title}</Text>

      <View style={styles.priceRow}>
        <Text style={styles.price}>{formatPrice(listing.price, listing.currency)}</Text>
        <View style={styles.badge}>
          <Ionicons name="shield-checkmark-outline" size={13} color={colors.primary} />
          <Text style={styles.badgeText}>{conditionKey ? t(conditionKey) : listing.conditionLabel}</Text>
        </View>
        <View style={styles.badge}>
          <Ionicons name="pricetag-outline" size={13} color={colors.accent} />
          <Text style={styles.badgeText}>{t("listing.fairPrice")}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 24, fontWeight: "600", letterSpacing: -0.4, lineHeight: 30 },
  priceRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 8, marginTop: 10 },
  price: { color: colors.text, fontSize: 30, fontWeight: "500", letterSpacing: -0.5, lineHeight: 36 },
  badge: { height: 30, flexDirection: "row", alignItems: "center", borderRadius: 15, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.softGold, paddingHorizontal: 11 },
  badgeText: { marginLeft: 5, color: colors.mutedStrong, fontSize: 11, fontWeight: "500" }
});
