import { ScrollView, StyleSheet, View } from "react-native";

import { CategoryGrid } from "@/components/home/CategoryGrid";
import { HomeHeader } from "@/components/home/HomeHeader";
import { HomeListingFeed } from "@/components/home/HomeListingFeed";
import { HomeSearchBar } from "@/components/home/HomeSearchBar";
import { SectionHeader } from "@/components/home/SectionHeader";
import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/spacing";

export default function HomeScreen() {
  return (
    <Screen noPadding>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader />

        <View style={styles.searchWrap}>
          <HomeSearchBar />
        </View>

        <View style={styles.categoriesWrap}>
          <CategoryGrid />
        </View>

        <View style={styles.sectionWrap}>
          <SectionHeader title="Picked for you" />
        </View>

        <HomeListingFeed />
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
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 118
  },
  searchWrap: {
    marginTop: 10
  },
  categoriesWrap: {
    marginTop: 16
  },
  sectionWrap: {
    marginTop: spacing.xs,
    marginBottom: 8
  }
});
