import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";

import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStatsCard } from "@/components/profile/ProfileStatsCard";
import { ProfileSummaryCard } from "@/components/profile/ProfileSummaryCard";
import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";
import { getProfileStats, ProfileStats } from "@/services/profileStats";

type IconName = keyof typeof Ionicons.glyphMap;

type AccountRowItem = {
  label: string;
  icon: IconName;
  badge?: number | string;
  onPress: () => void;
};

const emptyStats: ProfileStats = { activeListings: 0, savedItems: 0, soldListings: 0, offers: 0 };

function showComingLater(label: string) {
  Alert.alert(label, `${label} is coming later.`);
}

export default function ProfileScreen() {
  const router = useRouter();
  const { isLoading, profile, user, signOut } = useAuth();
  const [stats, setStats] = useState<ProfileStats>(emptyStats);
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!isLoading && !user) router.push("/auth/welcome");
    }, [isLoading, router, user])
  );

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      async function loadStats() {
        if (!user) return;
        setIsStatsLoading(true);
        const nextStats = await getProfileStats(user.id);
        if (isMounted) {
          setStats(nextStats);
          setIsStatsLoading(false);
        }
      }

      loadStats().catch(() => {
        if (isMounted) {
          setStats(emptyStats);
          setIsStatsLoading(false);
        }
      });

      return () => {
        isMounted = false;
      };
    }, [user])
  );

  async function handleSignOut() {
    await signOut();
    router.replace("/auth/welcome");
  }

  if (isLoading || !user) {
    return <Screen noPadding><View style={styles.screen} /></Screen>;
  }

  const ratingLabel = profile?.rating_count ? profile.rating_average.toFixed(1) : "New";

  const sellingRows: AccountRowItem[] = [
    { label: "Seller dashboard", icon: "analytics-outline", onPress: () => router.push("/seller-dashboard") },
    { label: "Drafts", icon: "document-text-outline", badge: 0, onPress: () => showComingLater("Drafts") },
    { label: "Price insights", icon: "trending-up-outline", onPress: () => showComingLater("Price insights") }
  ];

  const buyingRows: AccountRowItem[] = [
    { label: "Saved items", icon: "heart-outline", badge: stats.savedItems, onPress: () => router.push("/saved") },
    { label: "Recently viewed", icon: "time-outline", onPress: () => router.push("/recently-viewed") },
    { label: "Offers", icon: "pricetag-outline", badge: stats.offers, onPress: () => router.push("/inbox") }
  ];

  return (
    <Screen noPadding>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ProfileHeader onSettingsPress={() => router.push("/profile/edit")} />
        <ProfileSummaryCard stats={stats} ratingLabel={ratingLabel} isLoading={isStatsLoading} />
        <ProfileStatsCard stats={stats} ratingLabel={ratingLabel} isLoading={isStatsLoading} />

        <View style={styles.shortcutRow}>
          <ShortcutCard icon="pricetag-outline" title="My listings" subtitle="Manage active listings" onPress={() => router.push("/my-listings")} />
          <ShortcutCard icon="briefcase-outline" title="Dashboard" subtitle="Offers and deals" onPress={() => router.push("/seller-dashboard")} />
        </View>

        <AccountSection title="Selling dashboard" rows={sellingRows} />
        <AccountSection title="Buying" rows={buyingRows} />

        <Text style={styles.sectionTitle}>Support & account</Text>
        <View style={styles.gridRow}>
          <GridAction icon="person-circle-outline" label="Edit profile" onPress={() => router.push("/profile/edit")} />
          <GridAction icon="notifications-outline" label="Notifications" onPress={() => router.push("/notifications")} />
          <GridAction icon="shield-checkmark-outline" label="Safety" onPress={() => router.push("/safety")} />
          <GridAction icon="settings-outline" label="Settings" onPress={() => router.push("/profile/edit")} />
        </View>

        <Pressable style={styles.signOutRow} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={22} color="#A77C3A" />
          <Text style={styles.signOutText}>Sign out</Text>
          <Ionicons name="chevron-forward" size={17} color={colors.muted} />
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

function ShortcutCard({ icon, title, subtitle, onPress }: { icon: IconName; title: string; subtitle: string; onPress: () => void }) {
  return (
    <Pressable style={styles.shortcutCard} onPress={onPress}>
      <Ionicons name={icon} size={24} color={colors.text} />
      <Text style={styles.shortcutTitle} numberOfLines={1}>{title}</Text>
      <Text style={styles.shortcutSubtitle} numberOfLines={2}>{subtitle}</Text>
      <Ionicons name="chevron-forward" size={19} color={colors.text} style={styles.shortcutChevron} />
    </Pressable>
  );
}

function AccountSection({ title, rows }: { title: string; rows: AccountRowItem[] }) {
  return (
    <View style={styles.sectionWrap}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>
        {rows.map((row, index) => (
          <View key={row.label}>
            <Pressable style={styles.sectionRow} onPress={row.onPress}>
              <View style={styles.rowIconWrap}>
                <Ionicons name={row.icon} size={21} color={colors.text} />
              </View>
              <Text style={styles.rowText}>{row.label}</Text>
              {row.badge !== undefined ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{row.badge}</Text>
                </View>
              ) : null}
              <Ionicons name="chevron-forward" size={17} color={colors.muted} />
            </Pressable>
            {index < rows.length - 1 ? <View style={styles.rowSeparator} /> : null}
          </View>
        ))}
      </View>
    </View>
  );
}

function GridAction({ icon, label, onPress }: { icon: IconName; label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.gridCard} onPress={onPress}>
      <Ionicons name={icon} size={22} color={colors.text} />
      <Text style={styles.gridLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 128
  },
  shortcutRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 14
  },
  shortcutCard: {
    flex: 1,
    height: 112,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14
  },
  shortcutTitle: {
    marginTop: 13,
    paddingRight: 22,
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 19
  },
  shortcutSubtitle: {
    marginTop: 5,
    paddingRight: 18,
    color: colors.muted,
    fontSize: 12.5,
    fontWeight: "400",
    lineHeight: 17
  },
  shortcutChevron: {
    position: "absolute",
    right: 14,
    top: 47
  },
  sectionWrap: {
    marginTop: 20
  },
  sectionTitle: {
    marginBottom: 8,
    color: colors.muted,
    fontSize: 13,
    fontWeight: "500"
  },
  sectionCard: {
    overflow: "hidden",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  sectionRow: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16
  },
  rowIconWrap: {
    width: 24,
    alignItems: "center"
  },
  rowText: {
    flex: 1,
    marginLeft: 14,
    color: colors.text,
    fontSize: 14,
    fontWeight: "600"
  },
  badge: {
    minWidth: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    backgroundColor: "#F7F2EB",
    paddingHorizontal: 9,
    marginRight: 10
  },
  badgeText: {
    color: "#7B623C",
    fontSize: 12,
    fontWeight: "600"
  },
  rowSeparator: {
    height: 1,
    marginLeft: 54,
    backgroundColor: colors.border
  },
  gridRow: {
    flexDirection: "row",
    gap: 10
  },
  gridCard: {
    flex: 1,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  gridLabel: {
    marginTop: 7,
    color: colors.text,
    fontSize: 11,
    fontWeight: "500",
    textAlign: "center"
  },
  signOutRow: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    marginTop: 10
  },
  signOutText: {
    flex: 1,
    marginLeft: 14,
    color: colors.text,
    fontSize: 14,
    fontWeight: "600"
  }
});
