import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { Listing } from "@/types/listing";
import { formatPrice } from "@/utils/formatPrice";

export function ProductCard({ listing }: { listing: Listing }) {
  return (
    <View style={styles.card}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: listing.imageUrl }} style={styles.image} contentFit="cover" transition={180} />
        {listing.isGreatDeal ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Great deal</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {listing.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {listing.subtitle}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(listing.price, listing.currency)}</Text>
          {listing.originalPrice ? (
            <Text style={styles.originalPrice}>{formatPrice(listing.originalPrice, listing.currency)}</Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48.5%",
    height: 176,
    overflow: "hidden",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  imageWrap: {
    height: 90,
    backgroundColor: "#EDF2F0"
  },
  image: {
    width: "100%",
    height: "100%"
  },
  badge: {
    position: "absolute",
    top: 8,
    left: 8,
    height: 20,
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: colors.primary,
    paddingHorizontal: 8
  },
  badgeText: {
    color: colors.surface,
    fontSize: 10,
    fontWeight: "700"
  },
  content: {
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 10
  },
  title: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "800"
  },
  subtitle: {
    marginTop: 2,
    color: colors.muted,
    fontSize: 11,
    fontWeight: "500"
  },
  priceRow: {
    marginTop: spacing.sm,
    flexDirection: "row",
    alignItems: "baseline"
  },
  price: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800"
  },
  originalPrice: {
    marginLeft: 5,
    color: "#A3ADAD",
    fontSize: 11,
    fontWeight: "600",
    textDecorationLine: "line-through"
  }
});
