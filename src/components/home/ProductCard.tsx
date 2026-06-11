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
          <Image source={{ uri: listing.imageUrl }} style={styles.image} contentFit="cover" transition={180} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="image-outline" size={22} color={colors.primary} />
          </View>
        )}
        {listing.isGreatDeal ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Great deal</Text>
          </View>
        ) : null}
        {onFavoritePress ? (
          <Pressable style={styles.favoriteButton} onPress={handleFavoritePress} hitSlop={8}>
            <Ionicons name={listing.isFavorite ? "heart" : "heart-outline"} size={17} color={colors.primary} />
          </Pressable>
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
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48.5%",
    height: 150,
    overflow: "hidden",
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  imageWrap: {
    height: 78,
    backgroundColor: "#EDF2F0"
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
  badge: {
    position: "absolute",
    top: 7,
    left: 7,
    height: 19,
    justifyContent: "center",
    borderRadius: 9.5,
    backgroundColor: colors.primary,
    paddingHorizontal: 7
  },
  badgeText: {
    color: colors.surface,
    fontSize: 9.5,
    fontWeight: "700"
  },
  favoriteButton: {
    position: "absolute",
    top: 7,
    right: 7,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.92)"
  },
  content: {
    paddingHorizontal: 9,
    paddingTop: 7,
    paddingBottom: 8
  },
  title: {
    color: colors.text,
    fontSize: 11.5,
    fontWeight: "800"
  },
  subtitle: {
    marginTop: 1,
    color: colors.muted,
    fontSize: 10.5,
    fontWeight: "500"
  },
  priceRow: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "baseline"
  },
  price: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800"
  },
  originalPrice: {
    marginLeft: 5,
    color: "#A3ADAD",
    fontSize: 10.5,
    fontWeight: "600",
    textDecorationLine: "line-through"
  }
});
