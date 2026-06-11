import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { BackendSearchResults } from "@/components/search/BackendSearchResults";
import { FilterRow } from "@/components/search/FilterRow";
import { SearchCategoryIcons } from "@/components/search/SearchCategoryIcons";
import { SearchFiltersSheet } from "@/components/search/SearchFiltersSheet";
import { SearchHeader } from "@/components/search/SearchHeader";
import { SearchInputBar } from "@/components/search/SearchInputBar";
import { SearchResultsHeader } from "@/components/search/SearchResultsHeader";
import { SuggestedSearches } from "@/components/search/SuggestedSearches";
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
          <SearchHeader />
          <SearchInputBar value={query} onChangeText={setQuery} onClear={() => setQuery("")} />
          <SuggestedSearches />
          <SearchCategoryIcons
            selectedCategory={filters.categoryName}
            onSelectCategory={(categoryName) => setFilters((current) => ({ ...current, categoryName }))}
          />
          <FilterRow onOpenFilters={() => setIsFiltersOpen(true)} />
          <SearchResultsHeader count={resultCount} query={query} onSortPress={() => setIsFiltersOpen(true)} />
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
  content: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 118 }
});
