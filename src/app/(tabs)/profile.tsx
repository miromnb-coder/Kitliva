import { ScrollView, StyleSheet } from "react-native";

import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileSection } from "@/components/profile/ProfileSection";
import { ProfileStatsCard } from "@/components/profile/ProfileStatsCard";
import { ProfileSummaryCard } from "@/components/profile/ProfileSummaryCard";
import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";
import { mockProfile } from "@/data/mockProfile";

export default function ProfileScreen() {
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
          <ProfileSection key={section.title} section={section} />
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
