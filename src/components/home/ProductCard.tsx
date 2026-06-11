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
            <Ionicons name="image-outline" size={22} color={colors.primary} />
          </View>
        )}
        {onFavoritePress ? (
          <Pressable style={styles.favoriteButton} onPress={handleFavoritePress} hitSlop={8}>
            <Ionicons name={listing.isFavorite ? "heart" : "heart-outline"} size={19} color={colors.text} />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{listing.title}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>{listing.subtitle}</Text>
        <Text style={styles.price}>{formatPrice(listing.price, listing.currency)}</Text>
        <View style={styles.badgeRow}>
          <View style={styles.smallBadge}><Text style={styles.smallBadgeText}>{listing.conditionLabel.replace(" condition", "")}</Text></View>
          <View style={styles.smallBadge}><Text style={styles.smallBadgeText}>Fair price</Text></View>
        </View>
        <View style={styles.verifiedRow}>
          <Ionicons name="shield-checkmark" size={10} color={colors.primary} />
          <Text style={styles.verifiedText}>{listing.sellerTrustLabel ?? "Verified profile"}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48.5%",
    minHeight: 214,
    overflow: "hidden",
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  imageWrap: {
    height: 90,
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
    top: 9,
    right: 9,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.86)"
  },
  content: {
    paddingHorizontal: 9,
    paddingTop: 8,
    paddingBottom: 9
  },
  title: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 15
  },
  subtitle: {
    marginTop: 2,
    color: colors.muted,
    fontSize: 10.5,
    fontWeight: "400",
    lineHeight: 13
  },
  price: {
    marginTop: 4,
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 18
  },
  badgeRow: {
    flexDirection: "row",
    gap: 5,
    marginTop: 7
  },
  smallBadge: {
    height: 20,
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#F7F2EB",
    paddingHorizontal: 6
  },
  smallBadgeText: {
    color: "#5F655F",
    fontSize: 8.5,
    fontWeight: "500"
  },
  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7
  },
  verifiedText: {
    marginLeft: 4,
    color: "#4F5752",
    fontSize: 9.5,
    fontWeight: "500"
  }
});
