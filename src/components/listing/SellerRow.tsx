import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { Listing } from "@/types/listing";

type SellerRowProps = {
  listing: Listing;
};

export function SellerRow({ listing }: SellerRowProps) {
  const router = useRouter();
  const meta = listing.sellerRating > 0 ? `${listing.sellerRating.toFixed(1)} (${listing.sellerReviewCount}) · ${listing.sellerLocation}` : `${listing.sellerTrustLabel ?? "New member"} · ${listing.sellerLocation}`;

  return (
    <Pressable style={styles.container} onPress={() => listing.sellerId && router.push(`/seller/${listing.sellerId}`)}>
      {listing.sellerAvatarUrl ? (
        <Image source={{ uri: listing.sellerAvatarUrl }} style={styles.avatarImage} contentFit="cover" />
      ) : (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{listing.sellerInitial}</Text>
        </View>
      )}

      <View style={styles.textWrap}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{listing.sellerName}</Text>
          <Text style={styles.dot}>·</Text>
          <Ionicons name="shield-checkmark" size={13} color={colors.primary} />
          <Text style={styles.trustText} numberOfLines={1}>{listing.sellerTrustLabel ?? "New member"}</Text>
        </View>
        <View style={styles.metaRow}>
          {listing.sellerRating > 0 ? <Ionicons name="star" size={12} color="#D8A21B" style={styles.starIcon} /> : null}
          <Text style={styles.meta} numberOfLines={1}>{meta}</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={18} color={colors.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 72,
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 12
  },
  avatar: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    backgroundColor: colors.mint
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.mint
  },
  avatarText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "700"
  },
  textWrap: {
    flex: 1,
    marginLeft: 12
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center"
  },
  name: {
    maxWidth: "46%",
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 19
  },
  dot: {
    marginHorizontal: 6,
    color: colors.muted,
    fontSize: 12,
    fontWeight: "600"
  },
  trustText: {
    marginLeft: 4,
    color: colors.primary,
    fontSize: 11,
    fontWeight: "600"
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5
  },
  starIcon: {
    marginRight: 4
  },
  meta: {
    flex: 1,
    color: colors.muted,
    fontSize: 11.5,
    fontWeight: "400",
    lineHeight: 15
  }
});
