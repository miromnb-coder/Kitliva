import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { Listing } from "@/types/listing";

type DeliveryPickupCardProps = {
  listing: Listing;
};

type IconName = keyof typeof Ionicons.glyphMap;

export function DeliveryPickupCard({ listing }: DeliveryPickupCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Delivery & pickup</Text>
      <View style={styles.card}>
        {listing.deliveryOptions.map((option, index) => (
          <View key={option.id} style={[styles.row, index > 0 && styles.rowBorder]}>
            <View style={styles.iconCircle}>
              <Ionicons name={option.icon as IconName} size={17} color={colors.primary} />
            </View>
            <View style={styles.textWrap}>
              <Text style={styles.title}>{option.title}</Text>
              <Text style={styles.subtitle}>{option.subtitle}</Text>
            </View>
            <Text style={styles.priceLabel}>{option.priceLabel}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 18
  },
  sectionTitle: {
    marginBottom: 10,
    color: colors.text,
    fontSize: 15,
    fontWeight: "800"
  },
  card: {
    overflow: "hidden",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  row: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14
  },
  rowBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  iconCircle: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: colors.background
  },
  textWrap: {
    flex: 1,
    marginLeft: 10
  },
  title: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800"
  },
  subtitle: {
    marginTop: 2,
    color: colors.muted,
    fontSize: 11,
    fontWeight: "500"
  },
  priceLabel: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "700"
  }
});
