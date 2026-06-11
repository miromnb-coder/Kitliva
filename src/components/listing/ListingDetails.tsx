import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { Listing } from "@/types/listing";

type ListingDetailsProps = {
  listing: Listing;
};

type IconName = keyof typeof Ionicons.glyphMap;

function iconForLabel(label: string): IconName {
  const normalized = label.toLowerCase();
  if (normalized.includes("condition")) return "shield-checkmark-outline";
  if (normalized.includes("category")) return "cube-outline";
  if (normalized.includes("posted") || normalized.includes("published")) return "calendar-outline";
  if (normalized.includes("brand") || normalized.includes("model")) return "camera-outline";
  return "cube-outline";
}

export function ListingDetails({ listing }: ListingDetailsProps) {
  const rows = listing.details.slice(0, 4);

  return (
    <View style={styles.container}>
      {rows.map((detail) => (
        <View key={detail.label} style={styles.row}>
          <View style={styles.iconColumn}>
            <Ionicons name={iconForLabel(detail.label)} size={18} color="#7B623C" />
          </View>
          <Text style={styles.label}>{detail.label}</Text>
          <Text style={styles.value} numberOfLines={2}>{detail.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    marginTop: 18
  },
  row: {
    minHeight: 20,
    flexDirection: "row",
    alignItems: "flex-start"
  },
  iconColumn: {
    width: 28,
    paddingTop: 1
  },
  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "500"
  },
  value: {
    maxWidth: "52%",
    marginLeft: "auto",
    color: "#5F655F",
    fontSize: 13,
    fontWeight: "400",
    lineHeight: 18,
    textAlign: "right"
  }
});
