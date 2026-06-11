import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { ProfileStats } from "@/services/profileStats";

type ProfileStatsCardProps = {
  stats: ProfileStats;
  ratingLabel: string;
  isLoading?: boolean;
};

export function ProfileStatsCard({ stats, ratingLabel, isLoading = false }: ProfileStatsCardProps) {
  const items = [
    { label: "Active", value: isLoading ? "-" : String(stats.activeListings), icon: "pricetag-outline" as const },
    { label: "Saved", value: isLoading ? "-" : String(stats.savedItems), icon: "heart-outline" as const },
    { label: "Sold", value: isLoading ? "-" : String(stats.soldListings), icon: "bag-handle-outline" as const },
    { label: "Rating", value: isLoading ? "-" : ratingLabel, icon: "star-outline" as const }
  ];

  return (
    <View style={styles.card}>
      {items.map((stat, index) => (
        <View key={stat.label} style={styles.statWrap}>
          <View style={styles.stat}>
            <Ionicons name={stat.icon} size={18} color={colors.text} style={styles.icon} />
            <Text style={styles.value}>{stat.value}</Text>
            <Text style={styles.label}>{stat.label}</Text>
          </View>

          {index < items.length - 1 ? <View style={styles.separator} /> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 86,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginBottom: 18
  },
  statWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: "100%"
  },
  stat: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  icon: {
    marginBottom: 4
  },
  value: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "800",
    lineHeight: 21
  },
  label: {
    marginTop: 2,
    color: "#657575",
    fontSize: 11.5,
    fontWeight: "500"
  },
  separator: {
    width: 1,
    height: 54,
    backgroundColor: colors.border
  }
});
