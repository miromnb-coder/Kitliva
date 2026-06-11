import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { Listing } from "@/types/listing";
import { formatPrice } from "@/utils/formatPrice";

type AiPriceEstimateCardProps = {
  listing: Listing;
};

export function AiPriceEstimateCard({ listing }: AiPriceEstimateCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconCircle}>
        <Ionicons name="pulse" size={22} color={colors.surface} />
      </View>

      <View style={styles.textWrap}>
        <Text style={styles.label}>AI price estimate</Text>
        <Text style={styles.estimate}>
          {formatPrice(listing.aiPriceMin, listing.currency)} – {formatPrice(listing.aiPriceMax, listing.currency)}
        </Text>
        <Text style={styles.sub}>Based on {listing.aiSimilarListings} similar listings</Text>
      </View>

      <Ionicons name="analytics-outline" size={24} color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 72,
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#BFE9DC",
    backgroundColor: colors.mint,
    padding: 14
  },
  iconCircle: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "#7ED9C2"
  },
  textWrap: {
    flex: 1,
    marginLeft: 12
  },
  label: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "700"
  },
  estimate: {
    marginTop: 2,
    color: colors.text,
    fontSize: 18,
    fontWeight: "800"
  },
  sub: {
    marginTop: 2,
    color: "#51706E",
    fontSize: 11,
    fontWeight: "500"
  }
});
