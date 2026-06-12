import { useCallback, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { BackendSearchResults } from "@/components/search/BackendSearchResults";
import { ExploreFilterRow } from "@/components/search/ExploreFilterRow";
import { ExploreHeader } from "@/components/search/ExploreHeader";
import { ExploreResultsHeader } from "@/components/search/ExploreResultsHeader";
import { ExploreSearchBar } from "@/components/search/ExploreSearchBar";
import { PopularSearchChips } from "@/components/search/PopularSearchChips";
import { SearchFilterSheetType, SearchFiltersSheet } from "@/components/search/SearchFiltersSheet";
import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";
import { getAISearchResult } from "@/services/aiSearch";
import { defaultSearchFilters, SearchFilters } from "@/types/search";

const aiExampleChips = ["Weekend hiking setup", "Beginner camera for travel", "Winter gear under €150", "Affordable cycling gear"];

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [resultsQuery, setResultsQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>(defaultSearchFilters);
  const [activeSheet, setActiveSheet] = useState<SearchFilterSheetType | null>(null);
  const [resultCount, setResultCount] = useState(0);
  const [isAISearchEnabled, setIsAISearchEnabled] = useState(false);
  const [isAISearchLoading, setIsAISearchLoading] = useState(false);
  const [aiSearchSummary, setAISearchSummary] = useState<string | null>(null);
  const [aiSearchError, setAISearchError] = useState<string | null>(null);

  const handleCountChange = useCallback((count: number) => {
    setResultCount(count);
  }, []);

  function updateQuery(value: string) {
    setQuery(value);
    setAISearchError(null);
    if (!isAISearchEnabled) {
      setResultsQuery(value);
      setAISearchSummary(null);
    }
  }

  function clearFilters() {
    setFilters(defaultSearchFilters);
    setQuery("");
    setResultsQuery("");
    setAISearchSummary(null);
    setAISearchError(null);
  }

  function clearSingleFilter(filter: SearchFilterSheetType) {
    if (filter === "category") setFilters((current) => ({ ...current, categoryName: "All" }));
    if (filter === "price") setFilters((current) => ({ ...current, minPrice: "", maxPrice: "" }));
    if (filter === "condition") setFilters((current) => ({ ...current, condition: "any" }));
    if (filter === "location") setFilters((current) => ({ ...current, city: "" }));
    if (filter === "shipping") setFilters((current) => ({ ...current, deliveryOption: "any" }));
    if (filter === "sort") setFilters((current) => ({ ...current, sort: "recommended" }));
  }

  function enableAISearch() {
    setIsAISearchEnabled(true);
    setAISearchError(null);
  }

  function closeAISearch() {
    setIsAISearchEnabled(false);
    setAISearchError(null);
  }

  function clearAISearch() {
    setIsAISearchEnabled(false);
    setAISearchSummary(null);
    setAISearchError(null);
    setFilters(defaultSearchFilters);
    setResultsQuery(query);
  }

  async function submitSearch() {
    const trimmedQuery = query.trim();

    if (!isAISearchEnabled) {
      setResultsQuery(trimmedQuery);
      return;
    }

    if (!trimmedQuery) {
      setAISearchError("Write what you are looking for first.");
      return;
    }

    setIsAISearchLoading(true);
    setAISearchError(null);

    try {
      const result = await getAISearchResult({ query: trimmedQuery, currentFilters: filters });
      setResultsQuery(result.query || trimmedQuery);
      setFilters((current) => ({
        ...current,
        categoryName: result.categoryName ?? "All",
        condition: result.condition,
        minPrice: result.minPrice ? String(result.minPrice) : "",
        maxPrice: result.maxPrice ? String(result.maxPrice) : "",
        sort: result.sort
      }));
      setAISearchSummary(result.chips.length ? `AI search applied: ${result.chips.join(" · ")}` : result.explanation);
      if (result.mock) setAISearchError("AI used a lightweight fallback. Showing interpreted results.");
    } catch {
      setResultsQuery(trimmedQuery);
      setAISearchError("AI search is unavailable. Showing regular results.");
    } finally {
      setIsAISearchLoading(false);
    }
  }

  function selectPopularSearch(value: string) {
    setQuery(value);
    if (!isAISearchEnabled) setResultsQuery(value);
  }

  function selectAIExample(value: string) {
    setQuery(value);
    setAISearchError(null);
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
            <ExploreSearchBar value={query} onChangeText={updateQuery} onSubmit={submitSearch} isAIEnabled={isAISearchEnabled} isAILoading={isAISearchLoading} onToggleAI={enableAISearch} onCloseAI={closeAISearch} />
            {isAISearchEnabled ? (
              <View style={styles.aiHelperRow}>
                <Ionicons name="information-circle-outline" size={14} color={colors.primary} />
                <Text style={styles.aiHelperText}>{isAISearchLoading ? "Understanding your search..." : aiSearchError ?? "AI will turn this into smarter search filters."}</Text>
              </View>
            ) : null}
            {isAISearchEnabled && !query.trim() ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.aiChipRow}>
                {aiExampleChips.map((chip) => (
                  <Pressable key={chip} style={styles.aiExampleChip} onPress={() => selectAIExample(chip)}>
                    <Text style={styles.aiExampleText}>{chip}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            ) : null}
            {aiSearchSummary ? (
              <View style={styles.aiAppliedPill}>
                <Ionicons name="sparkles-outline" size={14} color={colors.primary} />
                <Text style={styles.aiAppliedText} numberOfLines={1}>{aiSearchSummary}</Text>
                <Pressable style={styles.aiAppliedClear} onPress={clearAISearch} hitSlop={8}>
                  <Ionicons name="close" size={14} color={colors.primary} />
                </Pressable>
              </View>
            ) : null}
          </View>
          <ExploreFilterRow filters={filters} onOpenFilter={setActiveSheet} onClearFilter={clearSingleFilter} />
          <PopularSearchChips onSelectSearch={selectPopularSearch} />
          <ExploreResultsHeader count={resultCount} sort={filters.sort} onSortPress={() => setActiveSheet("sort")} />
          <BackendSearchResults query={resultsQuery} filters={filters} onCountChange={handleCountChange} />
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
  },
  aiHelperRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 2
  },
  aiHelperText: {
    flex: 1,
    color: colors.mutedStrong,
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 16
  },
  aiChipRow: {
    gap: 8,
    paddingTop: 10,
    paddingRight: 2
  },
  aiExampleChip: {
    height: 32,
    justifyContent: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 12
  },
  aiExampleText: {
    color: colors.mutedStrong,
    fontSize: 12,
    fontWeight: "700"
  },
  aiAppliedPill: {
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.successBorder,
    backgroundColor: colors.softGreen,
    paddingLeft: 11,
    paddingRight: 7,
    marginTop: 10
  },
  aiAppliedText: {
    flex: 1,
    marginLeft: 6,
    color: colors.primary,
    fontSize: 12.5,
    fontWeight: "800"
  },
  aiAppliedClear: {
    width: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13
  }
});
