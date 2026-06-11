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
          <Text style={styles.name}>{listing.sellerName}</Text>
          <View style={[styles.trustBadge, !listing.sellerIsVerified && !listing.sellerIsTrusted && styles.mutedBadge]}>
            <Text style={[styles.trustText, !listing.sellerIsVerified && !listing.sellerIsTrusted && styles.mutedTrustText]}>{listing.sellerTrustLabel ?? "New member"}</Text>
          </View>
        </View>
        <Text style={styles.meta}>{listing.sellerLocation}</Text>
      </View>

      <Ionicons name="chevron-forward" size={18} color={colors.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 64,
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 12
  },
  avatar: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 21,
    backgroundColor: colors.mint
  },
  avatarImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.mint
  },
  avatarText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "800"
  },
  textWrap: {
    marginLeft: 11,
    flex: 1
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7
  },
  name: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800"
  },
  trustBadge: {
    height: 22,
    justifyContent: "center",
    borderRadius: 11,
    backgroundColor: colors.mint,
    paddingHorizontal: 8
  },
  mutedBadge: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  trustText: {
    color: colors.primary,
    fontSize: 10.5,
    fontWeight: "800"
  },
  mutedTrustText: {
    color: colors.muted
  },
  meta: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 12,
    fontWeight: "500"
  }
});
