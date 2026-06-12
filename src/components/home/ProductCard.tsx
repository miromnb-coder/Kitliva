import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
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
  const [imageFailed, setImageFailed] = useState(false);
  const shouldShowImage = Boolean(listing.imageUrl && !imageFailed);

  useEffect(() => {
    setImageFailed(false);
  }, [listing.imageUrl]);

  function handleFavoritePress(event: GestureResponderEvent) {
    event.stopPropagation();
    onFavoritePress?.(listing);
  }

  return (
    <Pressable style={styles.card} onPress={() => router.push(`/listing/${listing.id}`)}>
      <View style={styles.imageWrap}>
        {shouldShowImage ? (
          <Image source={{ uri: listing.imageUrl as string }} style={styles.image} contentFit="contain" transition={180} onError={() => setImageFailed(true)} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="image-outline" size={18} color={colors.primary} />
          </View>
        )}
        {onFavoritePress ? (
          <Pressable style={styles.favoriteButton} onPress={handleFavoritePress} hitSlop={8}>
            <Ionicons name={listing.isFavorite ? "heart" : "heart-outline"} size={17} color={colors.text} />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{listing.title || "Untitled item"}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>{listing.subtitle || listing.categoryName || "Kitliva gear"}</Text>
        <Text style={styles.price}>{formatPrice(listing.price, listing.currency)}</Text>
        <View style={styles.badgeRow}>
          <View style={styles.smallBadge}><Text style={styles.smallBadgeText}>{listing.conditionLabel.replace(" condition", "")}</Text></View>
          <View style={styles.smallBadge}><Text style={styles.smallBadgeText}>Fair</Text></View>
        </View>
        <View style={styles.verifiedRow}>
          <Ionicons name="shield-checkmark" size={8.5} color={colors.primary} />
          <Text style={styles.verifiedText}>{listing.sellerTrustLabel ?? "Verified profile"}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48.5%",
    minHeight: 178,
    overflow: "hidden",
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  imageWrap: {
    height: 74,
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
    backgroundColor: colors.softGreen
  },
  favoriteButton: {
    position: "absolute",
    top: 7,
    right: 7,
    width: 25,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12.5,
    backgroundColor: "rgba(255,254,250,0.88)"
  },
  content: {
    paddingHorizontal: 8,
    paddingTop: 7,
    paddingBottom: 7
  },
  title: {
    color: colors.text,
    fontSize: 10.8,
    fontWeight: "700",
    lineHeight: 13.5
  },
  subtitle: {
    marginTop: 1,
    color: colors.muted,
    fontSize: 9.8,
    fontWeight: "400",
    lineHeight: 12
  },
  price: {
    marginTop: 3,
    color: colors.text,
    fontSize: 12.8,
    fontWeight: "700",
    lineHeight: 16
  },
  badgeRow: {
    flexDirection: "row",
    gap: 4,
    marginTop: 5
  },
  smallBadge: {
    height: 17,
    justifyContent: "center",
    borderRadius: 8.5,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.softGold,
    paddingHorizontal: 5
  },
  smallBadgeText: {
    color: colors.mutedStrong,
    fontSize: 7.5,
    fontWeight: "500"
  },
  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4
  },
  verifiedText: {
    marginLeft: 4,
    color: colors.mutedStrong,
    fontSize: 8.5,
    fontWeight: "500"
  }
});
