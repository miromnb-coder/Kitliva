import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

import { FilterRow } from "@/components/search/FilterRow";
import { BackendSearchResults } from "@/components/search/BackendSearchResults";
import { SearchCategoryIcons } from "@/components/search/SearchCategoryIcons";
import { SearchHeader } from "@/components/search/SearchHeader";
import { SearchInputBar } from "@/components/search/SearchInputBar";
import { SearchResultsHeader } from "@/components/search/SearchResultsHeader";
import { SuggestedSearches } from "@/components/search/SuggestedSearches";
import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";

export default function SearchScreen() {
  const [query, setQuery] = useState("");

  return (
    <Screen noPadding>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SearchHeader />
        <SearchInputBar value={query} onChangeText={setQuery} onClear={() => setQuery("")} />
        <SuggestedSearches />
        <SearchCategoryIcons />
        <FilterRow />
        <SearchResultsHeader />
        <BackendSearchResults query={query} />
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
