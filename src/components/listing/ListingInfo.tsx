import { Ionicons } from "@expo/vector-icons";
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
      <Text style={styles.title} numberOfLines={2}>{listing.title}</Text>

      <View style={styles.priceRow}>
        <Text style={styles.price}>{formatPrice(listing.price, listing.currency)}</Text>
        <View style={styles.badge}>
          <Ionicons name="shield-checkmark-outline" size={13} color={colors.primary} />
          <Text style={styles.badgeText}>{listing.conditionLabel}</Text>
        </View>
        <View style={styles.badge}>
          <Ionicons name="pricetag-outline" size={13} color="#A77C3A" />
          <Text style={styles.badgeText}>Fair price</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "600",
    letterSpacing: -0.4,
    lineHeight: 30
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10
  },
  price: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "500",
    letterSpacing: -0.5,
    lineHeight: 36
  },
  badge: {
    height: 30,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#F7F2EB",
    paddingHorizontal: 11
  },
  badgeText: {
    marginLeft: 5,
    color: "#5F655F",
    fontSize: 11,
    fontWeight: "500"
  }
});
