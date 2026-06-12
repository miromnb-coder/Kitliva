import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "@/constants/colors";
import { Listing } from "@/types/listing";

type ListingHeroProps = {
  listing: Listing;
  onFavoritePress?: () => void;
  isFavoriteLoading?: boolean;
};

export function ListingHero({ listing, onFavoritePress, isFavoriteLoading = false }: ListingHeroProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const imageCount = listing.imageCount ?? listing.imageUrls?.length ?? (listing.imageUrl ? 1 : 0);

  return (
    <View style={styles.container}>
      {listing.imageUrl ? (
        <Image source={{ uri: listing.imageUrl }} style={styles.image} contentFit="cover" contentPosition="center" transition={180} />
      ) : (
        <View style={styles.placeholder}>
          <Ionicons name="image-outline" size={36} color={colors.primary} />
          <Text style={styles.placeholderText}>Photo coming soon</Text>
        </View>
      )}

      <Pressable style={[styles.floatingButton, styles.backButton, { top: insets.top + 14 }]} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={22} color={colors.text} />
      </Pressable>

      <Pressable style={[styles.floatingButton, styles.favoriteButton, { top: insets.top + 14 }]} onPress={onFavoritePress} disabled={isFavoriteLoading}>
        <Ionicons name={listing.isFavorite ? "heart" : "heart-outline"} size={22} color={listing.isFavorite ? colors.accent : colors.text} />
      </Pressable>

      {imageCount > 1 ? (
        <View style={styles.counterPill}>
          <Text style={styles.counterText}>1 / {imageCount}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 318,
    backgroundColor: colors.highlight
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
    backgroundColor: colors.softGold
  },
  placeholderText: {
    marginTop: 8,
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700"
  },
  floatingButton: {
    position: "absolute",
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "rgba(255,254,250,0.92)"
  },
  backButton: {
    left: 20
  },
  favoriteButton: {
    right: 20
  },
  counterPill: {
    position: "absolute",
    right: 20,
    bottom: 18,
    minWidth: 50,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "rgba(255,254,250,0.92)",
    paddingHorizontal: 12
  },
  counterText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "600"
  }
});
