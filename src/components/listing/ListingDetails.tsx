import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { Listing } from "@/types/listing";

type ListingDetailsProps = {
  listing: Listing;
};

export function ListingDetails({ listing }: ListingDetailsProps) {
  return (
    <View style={styles.container}>
      {listing.details.map((detail) => (
        <View key={detail.label} style={styles.row}>
          <Text style={styles.label}>{detail.label}</Text>
          <Text style={styles.value} numberOfLines={1}>
            {detail.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16
  },
  row: {
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "600"
  },
  value: {
    maxWidth: "58%",
    color: colors.text,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "right"
  }
});
