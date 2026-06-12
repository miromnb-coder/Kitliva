import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";
import { ProfileStats } from "@/services/profileStats";

type ProfileSummaryCardProps = {
  stats: ProfileStats;
  ratingLabel: string;
  isLoading?: boolean;
};

function getMemberSince(createdAt?: string) {
  if (!createdAt) return "New";
  const year = new Date(createdAt).getFullYear();
  return Number.isFinite(year) ? String(year) : "New";
}

export function ProfileSummaryCard({ stats, ratingLabel, isLoading = false }: ProfileSummaryCardProps) {
  const { profile, user } = useAuth();

  const displayName = profile?.display_name ?? user?.email ?? "Kitliva user";
  const location = [profile?.location_city, profile?.location_country].filter(Boolean).join(", ") || "Location not set";
  const trustLabel = profile?.is_trusted_seller ? "Trusted seller" : profile?.is_verified ? "Verified profile" : "New member";
  const avatarUrl = profile?.avatar_url;
  const initial = displayName.trim().charAt(0).toUpperCase() || "K";
  const memberSince = getMemberSince(profile?.created_at);

  const miniStats = [
    { label: "Rating", value: isLoading ? "-" : ratingLabel, icon: "star-outline" as const },
    { label: "Sold", value: isLoading ? "-" : String(stats.soldListings), icon: "cube-outline" as const },
    { label: "Member since", value: memberSince, icon: "calendar-outline" as const }
  ];

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} contentFit="cover" transition={180} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarInitial}>{initial}</Text>
          </View>
        )}

        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={1}>{displayName}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={15} color={colors.muted} />
            <Text style={styles.location} numberOfLines={1}>{location}</Text>
          </View>
          <View style={styles.trustRow}>
            <Ionicons name="shield-checkmark" size={15} color={colors.primary} />
            <Text style={styles.trustLabel}>{trustLabel}</Text>
          </View>
        </View>
      </View>

      <View style={styles.miniStatsRow}>
        {miniStats.map((item, index) => (
          <View key={item.label} style={styles.miniStatWrap}>
            <View style={styles.miniStat}>
              <Ionicons name={item.icon} size={22} color="#A77C3A" />
              <View style={styles.miniTextWrap}>
                <Text style={styles.miniValue}>{item.value}</Text>
                <Text style={styles.miniLabel}>{item.label}</Text>
              </View>
            </View>
            {index < miniStats.length - 1 ? <View style={styles.dotDivider} /> : null}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 16
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center"
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: colors.mint
  },
  avatarFallback: {
    width: 78,
    height: 78,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 39,
    backgroundColor: colors.mint
  },
  avatarInitial: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: "700"
  },
  content: {
    flex: 1,
    marginLeft: 16
  },
  name: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 24
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7
  },
  location: {
    flex: 1,
    marginLeft: 5,
    color: colors.muted,
    fontSize: 13,
    fontWeight: "400"
  },
  trustRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8
  },
  trustLabel: {
    marginLeft: 6,
    color: colors.primary,
    fontSize: 13,
    fontWeight: "600"
  },
  miniStatsRow: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 18
  },
  miniStatWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  miniStat: {
    alignItems: "center"
  },
  miniTextWrap: {
    alignItems: "center",
    marginTop: 5
  },
  miniValue: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 18
  },
  miniLabel: {
    marginTop: 1,
    color: colors.muted,
    fontSize: 11,
    fontWeight: "400"
  },
  dotDivider: {
    position: "absolute",
    right: 0,
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#D8D1C7"
  }
});
