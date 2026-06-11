import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { BackendSearchResults } from "@/components/search/BackendSearchResults";
import { ExploreFilterRow } from "@/components/search/ExploreFilterRow";
import { ExploreHeader } from "@/components/search/ExploreHeader";
import { ExploreResultsHeader } from "@/components/search/ExploreResultsHeader";
import { ExploreSearchBar } from "@/components/search/ExploreSearchBar";
import { PopularSearchChips } from "@/components/search/PopularSearchChips";
import { SearchFiltersSheet } from "@/components/search/SearchFiltersSheet";
import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";
import { defaultSearchFilters, SearchFilters } from "@/types/search";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>(defaultSearchFilters);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [resultCount, setResultCount] = useState(0);

  const handleCountChange = useCallback((count: number) => {
    setResultCount(count);
  }, []);

  function clearFilters() {
    setFilters(defaultSearchFilters);
    setQuery("");
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
          <ExploreFilterRow onOpenFilters={() => setIsFiltersOpen(true)} />
          <PopularSearchChips onSelectSearch={setQuery} />
          <ExploreResultsHeader count={resultCount} onSortPress={() => setIsFiltersOpen(true)} />
          <BackendSearchResults query={query} filters={filters} onCountChange={handleCountChange} />
        </ScrollView>

        <SearchFiltersSheet
          visible={isFiltersOpen}
          filters={filters}
          onChange={setFilters}
          onClose={() => setIsFiltersOpen(false)}
          onClear={clearFilters}
        />
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
