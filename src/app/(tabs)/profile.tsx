import { useCallback, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileSection } from "@/components/profile/ProfileSection";
import { ProfileStatsCard } from "@/components/profile/ProfileStatsCard";
import { ProfileSummaryCard } from "@/components/profile/ProfileSummaryCard";
import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";
import { ProfileSection as ProfileSectionType } from "@/data/mockProfile";
import { useAuth } from "@/hooks/useAuth";
import { getProfileStats, ProfileStats } from "@/services/profileStats";

const emptyStats: ProfileStats = {
  activeListings: 0,
  savedItems: 0,
  soldListings: 0
};

export default function ProfileScreen() {
  const router = useRouter();
  const { isLoading, profile, user, signOut } = useAuth();
  const [stats, setStats] = useState<ProfileStats>(emptyStats);
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!isLoading && !user) {
        router.push("/auth/welcome");
      }
    }, [isLoading, router, user])
  );

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      async function loadStats() {
        if (!user) {
          return;
        }

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

  function handleItemPress(label: string) {
    if (label === "My listings") {
      router.push("/my-listings");
    }

    if (label === "Create listing") {
      router.push("/sell");
    }
  }

  if (isLoading || !user) {
    return (
      <Screen noPadding>
        <View style={styles.screen} />
      </Screen>
    );
  }

  const ratingLabel = profile?.rating_count ? profile.rating_average.toFixed(1) : "New";
  const sections: ProfileSectionType[] = [
    {
      title: "My activity",
      items: [
        { label: "Saved items", icon: "heart-outline", badge: stats.savedItems },
        { label: "My listings", icon: "pricetag-outline", badge: stats.activeListings },
        { label: "Recently viewed", icon: "time-outline" }
      ]
    },
    {
      title: "Selling tools",
      items: [
        { label: "Create listing", icon: "add-circle-outline" },
        { label: "Seller tips", icon: "bulb-outline" },
        { label: "Price guidance", icon: "analytics-outline" }
      ]
    },
    {
      title: "Support & account",
      items: [
        { label: "Help center", icon: "help-circle-outline" },
        { label: "Account settings", icon: "settings-outline" },
        { label: "Sign out", icon: "log-out-outline" }
      ]
    }
  ];

  return (
    <Screen noPadding>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader />
        <ProfileSummaryCard />
        <ProfileStatsCard stats={stats} ratingLabel={ratingLabel} isLoading={isStatsLoading} />
        {sections.map((section) => (
          <ProfileSection key={section.title} section={section} onSignOut={handleSignOut} onItemPress={handleItemPress} />
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 118
  }
});
