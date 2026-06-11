import { ScrollView, StyleSheet } from "react-native";

import { ProductGrid } from "@/components/home/ProductGrid";
import { FilterRow } from "@/components/search/FilterRow";
import { SearchCategoryIcons } from "@/components/search/SearchCategoryIcons";
import { SearchHeader } from "@/components/search/SearchHeader";
import { SearchInputBar } from "@/components/search/SearchInputBar";
import { SearchResultsHeader } from "@/components/search/SearchResultsHeader";
import { SuggestedSearches } from "@/components/search/SuggestedSearches";
import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";
import { mockListings } from "@/data/mockListings";

export default function SearchScreen() {
  return (
    <Screen noPadding>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SearchHeader />
        <SearchInputBar />
        <SuggestedSearches />
        <SearchCategoryIcons />
        <FilterRow />
        <SearchResultsHeader />
        <ProductGrid listings={mockListings} />
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
