import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { BackendSearchResults } from "@/components/search/BackendSearchResults";
import { ExploreFilterRow } from "@/components/search/ExploreFilterRow";
import { ExploreHeader } from "@/components/search/ExploreHeader";
import { ExploreResultsHeader } from "@/components/search/ExploreResultsHeader";
import { ExploreSearchBar } from "@/components/search/ExploreSearchBar";
import { PopularSearchChips } from "@/components/search/PopularSearchChips";
import { SearchFilterSheetType, SearchFiltersSheet } from "@/components/search/SearchFiltersSheet";
import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";
import { defaultSearchFilters, SearchFilters } from "@/types/search";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>(defaultSearchFilters);
  const [activeSheet, setActiveSheet] = useState<SearchFilterSheetType | null>(null);
  const [resultCount, setResultCount] = useState(0);

  const handleCountChange = useCallback((count: number) => {
    setResultCount(count);
  }, []);

  function clearFilters() {
    setFilters(defaultSearchFilters);
    setQuery("");
  }

  function clearSingleFilter(filter: SearchFilterSheetType) {
    if (filter === "category") setFilters((current) => ({ ...current, categoryName: "All" }));
    if (filter === "price") setFilters((current) => ({ ...current, minPrice: "", maxPrice: "" }));
    if (filter === "condition") setFilters((current) => ({ ...current, condition: "any" }));
    if (filter === "location") setFilters((current) => ({ ...current, city: "" }));
    if (filter === "shipping") setFilters((current) => ({ ...current, deliveryOption: "any" }));
    if (filter === "sort") setFilters((current) => ({ ...current, sort: "recommended" }));
  }

  return (
    <Screen noPadding>
      <View style={styles.wrapper}>
        <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <ExploreHeader />
          <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.9} maxFontSizeMultiplier={1}>
            Explore gear
          </Text>
          <View style={styles.searchWrap}>
            <ExploreSearchBar value={query} onChangeText={setQuery} />
          </View>
          <ExploreFilterRow filters={filters} onOpenFilter={setActiveSheet} onClearFilter={clearSingleFilter} />
          <PopularSearchChips onSelectSearch={setQuery} />
          <ExploreResultsHeader count={resultCount} sort={filters.sort} onSortPress={() => setActiveSheet("sort")} />
          <BackendSearchResults query={query} filters={filters} onCountChange={handleCountChange} />
        </ScrollView>

        {activeSheet ? (
          <SearchFiltersSheet
            visible
            activeSheet={activeSheet}
            filters={filters}
            onChange={setFilters}
            onClose={() => setActiveSheet(null)}
            onClear={clearFilters}
          />
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: colors.background },
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 112 },
  title: {
    marginTop: 22,
    color: colors.text,
    fontSize: 34,
    fontWeight: "500",
    letterSpacing: -0.8,
    lineHeight: 40
  },
  searchWrap: {
    marginTop: 18
  }
});
