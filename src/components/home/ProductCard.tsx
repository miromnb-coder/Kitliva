import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { GestureResponderEvent, Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { Listing } from "@/types/listing";
import { formatPrice } from "@/utils/formatPrice";

type ProductCardProps = {
  listing: Listing;
  onFavoritePress?: (listing: Listing) => void;
};

export function ProductCard({ listing, onFavoritePress }: ProductCardProps) {
  const router = useRouter();

  function handleFavoritePress(event: GestureResponderEvent) {
    event.stopPropagation();
    onFavoritePress?.(listing);
  }

  return (
    <Pressable style={styles.card} onPress={() => router.push(`/listing/${listing.id}`)}>
      <View style={styles.imageWrap}>
        {listing.imageUrl ? (
          <Image source={{ uri: listing.imageUrl }} style={styles.image} contentFit="contain" transition={180} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="image-outline" size={20} color={colors.primary} />
          </View>
        )}
        {onFavoritePress ? (
          <Pressable style={styles.favoriteButton} onPress={handleFavoritePress}>
            <Ionicons name={listing.isFavorite ? "heart" : "heart-outline"} size={18} color={colors.text} />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{listing.title}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>{listing.subtitle}</Text>
        <Text style={styles.price}>{formatPrice(listing.price, listing.currency)}</Text>
        <View style={styles.badgeRow}>
          <View style={styles.smallBadge}><Text style={styles.smallBadgeText}>{listing.conditionLabel.replace(" condition", "")}</Text></View>
          <View style={styles.smallBadge}><Text style={styles.smallBadgeText}>Fair</Text></View>
        </View>
        <View style={styles.verifiedRow}>
          <Ionicons name="shield-checkmark" size={9} color={colors.primary} />
          <Text style={styles.verifiedText}>{listing.sellerTrustLabel ?? "Verified profile"}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48.5%",
    minHeight: 188,
    overflow: "hidden",
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  imageWrap: {
    height: 78,
    backgroundColor: colors.background
  },
  image: {
    width: "100%",
    height: "100%"
  },
  placeholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.mint
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.86)"
  },
  content: {
    paddingHorizontal: 8,
    paddingTop: 7,
    paddingBottom: 8
  },
  title: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 14
  },
  subtitle: {
    marginTop: 1,
    color: colors.muted,
    fontSize: 10,
    fontWeight: "400",
    lineHeight: 12
  },
  price: {
    marginTop: 3,
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 16
  },
  badgeRow: {
    flexDirection: "row",
    gap: 4,
    marginTop: 5
  },
  smallBadge: {
    height: 18,
    justifyContent: "center",
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#F7F2EB",
    paddingHorizontal: 5
  },
  smallBadgeText: {
    color: "#5F655F",
    fontSize: 7.8,
    fontWeight: "500"
  },
  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5
  },
  verifiedText: {
    marginLeft: 4,
    color: "#4F5752",
    fontSize: 8.8,
    fontWeight: "500"
  }
});
