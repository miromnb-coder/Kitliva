import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { GestureResponderEvent, Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { Listing } from "@/types/listing";
import { formatPrice } from "@/utils/formatPrice";

type ExploreProductCardProps = {
  listing: Listing;
  onFavoritePress?: (listing: Listing) => void;
};

function getTrustLabel(listing: Listing) {
  if (listing.sellerTrustLabel === "Trusted seller") return "Trusted seller";
  if (listing.sellerTrustLabel === "Verified profile") return "Verified seller";
  return listing.sellerTrustLabel ?? "Seller profile";
}

function getConditionLabel(label: string) {
  return label.replace(" condition", "");
}

export function ExploreProductCard({ listing, onFavoritePress }: ExploreProductCardProps) {
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
          <Image source={{ uri: listing.imageUrl ?? undefined }} style={styles.image} contentFit="contain" transition={180} onError={() => setImageFailed(true)} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="image-outline" size={18} color={colors.primary} />
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{listing.title || "Untitled item"}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.price}>{formatPrice(listing.price, listing.currency)}</Text>
          <View style={styles.conditionBadge}><Text style={styles.conditionText}>{getConditionLabel(listing.conditionLabel)}</Text></View>
        </View>
        <View style={styles.trustRow}>
          <Ionicons name="shield-checkmark" size={8.5} color={colors.primary} />
          <Text style={styles.trustText}>{getTrustLabel(listing)}</Text>
        </View>
      </View>

      {onFavoritePress ? (
        <Pressable style={styles.favoriteButton} onPress={handleFavoritePress} hitSlop={8}>
          <Ionicons name={listing.isFavorite ? "heart" : "heart-outline"} size={17} color={colors.text} />
        </Pressable>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48.5%",
    minHeight: 166,
    overflow: "hidden",
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  imageWrap: {
    height: 82,
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
  content: {
    paddingHorizontal: 8,
    paddingTop: 7,
    paddingBottom: 8
  },
  title: {
    color: colors.text,
    fontSize: 10.8,
    fontWeight: "700",
    lineHeight: 13.5
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4
  },
  price: {
    color: colors.text,
    fontSize: 12.8,
    fontWeight: "700",
    lineHeight: 16
  },
  conditionBadge: {
    height: 17,
    justifyContent: "center",
    borderRadius: 8.5,
    backgroundColor: colors.softGold,
    paddingHorizontal: 7,
    marginLeft: 8
  },
  conditionText: {
    color: colors.mutedStrong,
    fontSize: 7.8,
    fontWeight: "500"
  },
  trustRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6
  },
  trustText: {
    marginLeft: 4,
    color: colors.mutedStrong,
    fontSize: 8.5,
    fontWeight: "500"
  },
  favoriteButton: {
    position: "absolute",
    right: 10,
    bottom: 10,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center"
  }
});
