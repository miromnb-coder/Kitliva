import { useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";

import { HomeCategoryCards } from "@/components/home/HomeCategoryCards";
import { HomeCuratedHeader } from "@/components/home/HomeCuratedHeader";
import { HomeHeader } from "@/components/home/HomeHeader";
import { HomeHeroCard } from "@/components/home/HomeHeroCard";
import { HomeListingFeed } from "@/components/home/HomeListingFeed";
import { HomeSearchBar } from "@/components/home/HomeSearchBar";
import { HomeTrustRow } from "@/components/home/HomeTrustRow";
import { SearchFiltersSheet, SearchFilterSheetType } from "@/components/search/SearchFiltersSheet";
import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";
import { defaultSearchFilters, SearchFilters } from "@/types/search";

const serifFont = Platform.select({ ios: "Georgia", android: "serif", default: undefined });

export default function HomeScreen() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>(defaultSearchFilters);
  const [activeSheet, setActiveSheet] = useState<SearchFilterSheetType | null>(null);

  function selectCategory(categoryName: string) {
    setFilters((current) => ({ ...current, categoryName }));
  }

  function clearHomeFilters() {
    setQuery("");
    setFilters(defaultSearchFilters);
  }

  return (
    <Screen noPadding>
      <View style={styles.wrapper}>
        <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <HomeHeader />
          <Text style={styles.headline} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.88} maxFontSizeMultiplier={1}>
            Find premium used gear
          </Text>
          <View style={styles.searchWrap}>
            <HomeSearchBar value={query} onChangeText={setQuery} />
          </View>
          <HomeTrustRow />
          <HomeHeroCard />
          <HomeCategoryCards selectedCategoryName={filters.categoryName} onSelectCategory={selectCategory} />
          <HomeCuratedHeader sort={filters.sort} onSortPress={() => setActiveSheet("sort")} />
          <HomeListingFeed query={query} filters={filters} />
        </ScrollView>

        {activeSheet ? (
          <SearchFiltersSheet
            visible
            activeSheet={activeSheet}
            filters={filters}
            onChange={setFilters}
            onClose={() => setActiveSheet(null)}
            onClear={clearHomeFilters}
          />
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background
  },
  screen: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 112
  },
  headline: {
    marginTop: 16,
    color: colors.text,
    fontFamily: serifFont,
    fontSize: 28,
    fontWeight: "500",
    letterSpacing: -0.45,
    lineHeight: 34
  },
  searchWrap: {
    marginTop: 14
  }
});
