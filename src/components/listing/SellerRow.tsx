import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { Listing } from "@/types/listing";

type SellerRowProps = {
  listing: Listing;
};

export function SellerRow({ listing }: SellerRowProps) {
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{listing.sellerInitial}</Text>
      </View>

      <View style={styles.textWrap}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{listing.sellerName}</Text>
          <Ionicons name="star" size={12} color="#F5A623" />
          <Text style={styles.rating}>
            {listing.sellerRating} ({listing.sellerReviewCount})
          </Text>
        </View>
        <Text style={styles.meta}>
          {listing.sellerLocation}, {listing.sellerDistanceKm} km away
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 42,
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center"
  },
  avatar: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: colors.mint
  },
  avatarText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "800"
  },
  textWrap: {
    marginLeft: 10,
    flex: 1
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  },
  name: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800"
  },
  rating: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "600"
  },
  meta: {
    marginTop: 2,
    color: colors.muted,
    fontSize: 11,
    fontWeight: "500"
  }
});
