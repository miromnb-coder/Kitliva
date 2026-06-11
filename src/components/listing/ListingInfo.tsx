import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { Listing } from "@/types/listing";
import { formatPrice } from "@/utils/formatPrice";

type ListingInfoProps = {
  listing: Listing;
};

export function ListingInfo({ listing }: ListingInfoProps) {
  return (
    <View>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{listing.title}</Text>
        <View style={styles.priceWrap}>
          <Text style={styles.price}>{formatPrice(listing.price, listing.currency)}</Text>
          {listing.originalPrice ? (
            <Text style={styles.originalPrice}>{formatPrice(listing.originalPrice, listing.currency)}</Text>
          ) : null}
        </View>
      </View>

      <View style={styles.badgeRow}>
        <View style={styles.conditionBadge}>
          <Text style={styles.conditionText}>{listing.conditionLabel}</Text>
        </View>
        <View style={styles.metaBadge}>
          <Text style={styles.metaText}>{listing.subtitle.split(" ")[0]}</Text>
        </View>
        <View style={styles.metaBadge}>
          <Text style={styles.metaText}>{listing.subtitle}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12
  },
  title: {
    flex: 1,
    color: colors.text,
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 27
  },
  priceWrap: {
    flexDirection: "row",
    alignItems: "baseline",
    paddingTop: 1
  },
  price: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "800"
  },
  originalPrice: {
    marginLeft: 5,
    color: "#A3ADAD",
    fontSize: 13,
    fontWeight: "600",
    textDecorationLine: "line-through"
  },
  badgeRow: {
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  conditionBadge: {
    height: 24,
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: colors.mint,
    paddingHorizontal: 10
  },
  conditionText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "700"
  },
  metaBadge: {
    height: 24,
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 10
  },
  metaText: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700"
  }
});
