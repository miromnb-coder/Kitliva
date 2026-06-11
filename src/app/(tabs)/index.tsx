import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";

import { HomeCategoryCards } from "@/components/home/HomeCategoryCards";
import { HomeCuratedHeader } from "@/components/home/HomeCuratedHeader";
import { HomeHeader } from "@/components/home/HomeHeader";
import { HomeHeroCard } from "@/components/home/HomeHeroCard";
import { HomeListingFeed } from "@/components/home/HomeListingFeed";
import { HomeSearchBar } from "@/components/home/HomeSearchBar";
import { HomeTrustRow } from "@/components/home/HomeTrustRow";
import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";

const serifFont = Platform.select({ ios: "Georgia", android: "serif", default: undefined });

export default function HomeScreen() {
  return (
    <Screen noPadding>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <HomeHeader />
        <Text style={styles.headline} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.88} maxFontSizeMultiplier={1}>
          Find premium used gear
        </Text>
        <View style={styles.searchWrap}>
          <HomeSearchBar />
        </View>
        <HomeTrustRow />
        <HomeHeroCard />
        <HomeCategoryCards />
        <HomeCuratedHeader />
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 100
  },
  headline: {
    marginTop: 18,
    color: colors.text,
    fontFamily: serifFont,
    fontSize: 30,
    fontWeight: "500",
    letterSpacing: -0.55,
    lineHeight: 36
  },
  searchWrap: {
    marginTop: 17
  }
});
