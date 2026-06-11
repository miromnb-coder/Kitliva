import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { mockProfile } from "@/data/mockProfile";

export function ProfileSummaryCard() {
  const user = mockProfile.user;

  return (
    <View style={styles.card}>
      <Image source={{ uri: user.avatarUrl }} style={styles.avatar} contentFit="cover" transition={180} />

      <View style={styles.content}>
        <Text style={styles.name}>{user.name}</Text>

        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={14} color={colors.muted} style={styles.metaIcon} />
          <Text style={styles.location}>{user.location}</Text>
        </View>

        <View style={styles.metaRow}>
          <Ionicons name="star" size={15} color="#F5B931" style={styles.metaIcon} />
          <Text style={styles.rating}>
            {user.rating} ({user.reviewCount})
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Ionicons name="shield-checkmark" size={14} color="#007A68" style={styles.metaIcon} />
          <Text style={styles.trustLabel}>{user.trustLabel}</Text>
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
