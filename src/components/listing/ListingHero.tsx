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
};

export function ListingHero({ listing, onFavoritePress }: ListingHeroProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Image source={{ uri: listing.imageUrl }} style={styles.image} contentFit="cover" transition={180} />

      <View style={[styles.topActions, { top: insets.top + 8 }]}> 
        <Pressable style={styles.roundButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>

        <View style={styles.rightActions}>
          <Pressable style={styles.roundButton}>
            <Ionicons name="share-outline" size={20} color={colors.text} />
          </Pressable>
          <Pressable style={styles.roundButton}>
            <Ionicons name="ellipsis-horizontal" size={20} color={colors.text} />
          </Pressable>
        </View>
      </View>

      <View style={styles.bottomActions}>
        <View style={styles.counterPill}>
          <Text style={styles.counterText}>1/8</Text>
        </View>
        <Pressable style={styles.favoriteButton} onPress={onFavoritePress}>
          <Ionicons name="heart-outline" size={24} color={colors.primary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 260,
    backgroundColor: "#EDF2F0"
  },
  image: {
    width: "100%",
    height: "100%"
  },
  topActions: {
    position: "absolute",
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  rightActions: {
    flexDirection: "row",
    gap: 10
  },
  roundButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.88)"
  },
  bottomActions: {
    position: "absolute",
    right: 16,
    bottom: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  counterPill: {
    height: 24,
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "rgba(16,42,42,0.65)",
    paddingHorizontal: 9
  },
  counterText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: "700"
  },
  favoriteButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.92)"
  }
});
