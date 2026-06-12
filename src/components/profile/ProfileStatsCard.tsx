import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { ProfileStats } from "@/services/profileStats";

type ProfileStatsCardProps = {
  stats: ProfileStats;
  ratingLabel: string;
  isLoading?: boolean;
};

export function ProfileStatsCard({ stats, isLoading = false }: ProfileStatsCardProps) {
  const items = [
    { label: "Listings", value: isLoading ? "-" : String(stats.activeListings), icon: "pricetag-outline" as const },
    { label: "Sold", value: isLoading ? "-" : String(stats.soldListings), icon: "bag-handle-outline" as const },
    { label: "Saved", value: isLoading ? "-" : String(stats.savedItems), icon: "heart-outline" as const },
    { label: "Offers", value: isLoading ? "-" : String(stats.offers), icon: "briefcase-outline" as const }
  ];

  return (
    <View style={styles.card}>
      {items.map((stat, index) => (
        <View key={stat.label} style={styles.statWrap}>
          <View style={styles.stat}>
            <Ionicons name={stat.icon} size={22} color={colors.text} />
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
    height: 92,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginTop: 14
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
  value: {
    marginTop: 7,
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 23
  },
  label: {
    marginTop: 2,
    color: colors.muted,
    fontSize: 11,
    fontWeight: "400"
  },
  separator: {
    width: 1,
    height: 48,
    backgroundColor: colors.border
  }
});
