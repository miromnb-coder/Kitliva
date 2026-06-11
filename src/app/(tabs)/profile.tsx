import { useCallback } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileSection } from "@/components/profile/ProfileSection";
import { ProfileStatsCard } from "@/components/profile/ProfileStatsCard";
import { ProfileSummaryCard } from "@/components/profile/ProfileSummaryCard";
import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";
import { mockProfile } from "@/data/mockProfile";
import { useAuth } from "@/hooks/useAuth";

export default function ProfileScreen() {
  const router = useRouter();
  const { isLoading, user, signOut } = useAuth();

  useFocusEffect(
    useCallback(() => {
      if (!isLoading && !user) {
        router.push("/auth/welcome");
      }
    }, [isLoading, router, user])
  );

  async function handleSignOut() {
    await signOut();
    router.replace("/auth/welcome");
  }

  if (isLoading || !user) {
    return (
      <Screen noPadding>
        <View style={styles.screen} />
      </Screen>
    );
  }

  return (
    <Screen noPadding>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader />
        <ProfileSummaryCard />
        <ProfileStatsCard />
        {mockProfile.sections.map((section) => (
          <ProfileSection key={section.title} section={section} onSignOut={handleSignOut} />
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
