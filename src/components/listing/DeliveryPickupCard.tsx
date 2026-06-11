import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { Listing } from "@/types/listing";

type DeliveryPickupCardProps = {
  listing: Listing;
};

export function DeliveryPickupCard({ listing }: DeliveryPickupCardProps) {
  const location = listing.sellerLocation && listing.sellerLocation !== "Location not set" ? `Meet in ${listing.sellerLocation}` : "Agree pickup details";

  return (
    <View style={styles.container}>
      <View style={styles.infoCard}>
        <View style={styles.column}>
          <Ionicons name="location-outline" size={18} color="#7B623C" />
          <Text style={styles.title}>Local pickup</Text>
          <Text style={styles.subtitle}>{location}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.column}>
          <Ionicons name="cube-outline" size={18} color="#7B623C" />
          <Text style={styles.title}>Delivery</Text>
          <Text style={styles.subtitle}>Agree with seller</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.column}>
          <Ionicons name="lock-closed-outline" size={18} color="#7B623C" />
          <Text style={styles.title}>Safe chat</Text>
          <Text style={styles.subtitle}>Keep it on Kitliva</Text>
        </View>
      </View>

      <View style={styles.trustNote}>
        <Ionicons name="shield-checkmark" size={14} color={colors.primary} />
        <Text style={styles.trustText}>Stay safe: message and agree details on Kitliva</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16
  },
  infoCard: {
    height: 78,
    overflow: "hidden",
    flexDirection: "row",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  column: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10
  },
  divider: {
    width: 1,
    height: 46,
    alignSelf: "center",
    backgroundColor: colors.border
  },
  title: {
    marginTop: 6,
    color: colors.text,
    fontSize: 11,
    fontWeight: "700"
  },
  subtitle: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 9.5,
    fontWeight: "400",
    lineHeight: 13
  },
  trustNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16
  },
  trustText: {
    marginLeft: 7,
    color: "#4F5752",
    fontSize: 11,
    fontWeight: "500"
  }
});
