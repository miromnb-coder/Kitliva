import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";

export function ProfileSummaryCard() {
  const { profile, user } = useAuth();

  const displayName = profile?.display_name ?? user?.email ?? "Kitliva user";
  const location = [profile?.location_city, profile?.location_country].filter(Boolean).join(", ") || "Location not set";
  const rating = profile?.rating_average ?? 0;
  const reviewCount = profile?.rating_count ?? 0;
  const trustLabel = profile?.is_trusted_seller ? "Trusted seller" : profile?.is_verified ? "Verified profile" : "New member";
  const avatarUrl = profile?.avatar_url;
  const initial = displayName.trim().charAt(0).toUpperCase() || "K";

  return (
    <View style={styles.card}>
      {avatarUrl ? (
        <Image source={{ uri: avatarUrl }} style={styles.avatar} contentFit="cover" transition={180} />
      ) : (
        <View style={styles.avatarFallback}>
          <Text style={styles.avatarInitial}>{initial}</Text>
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.name}>{displayName}</Text>

        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={14} color={colors.muted} style={styles.metaIcon} />
          <Text style={styles.location}>{location}</Text>
        </View>

        <View style={styles.metaRow}>
          <Ionicons name="star" size={15} color="#F5B931" style={styles.metaIcon} />
          <Text style={styles.rating}>
            {rating.toFixed(1)} ({reviewCount})
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Ionicons name="shield-checkmark" size={14} color="#007A68" style={styles.metaIcon} />
          <Text style={styles.trustLabel}>{trustLabel}</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={22} color="#6F7E7E" />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 12
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: colors.mint,
    marginRight: 14
  },
  avatarFallback: {
    width: 62,
    height: 62,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 31,
    backgroundColor: colors.mint,
    marginRight: 14
  },
  avatarInitial: {
    color: colors.primary,
    fontSize: 25,
    fontWeight: "900"
  },
  content: {
    flex: 1
  },
  name: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 22
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4
  },
  metaIcon: {
    marginRight: 5
  },
  location: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "500"
  },
  rating: {
    color: "#4A5A5A",
    fontSize: 13,
    fontWeight: "600"
  },
  trustLabel: {
    color: "#007A68",
    fontSize: 13,
    fontWeight: "800"
  }
});
