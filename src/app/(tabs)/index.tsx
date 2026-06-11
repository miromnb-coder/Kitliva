import { ScrollView, StyleSheet, View } from "react-native";

import { CategoryGrid } from "@/components/home/CategoryGrid";
import { HomeHeader } from "@/components/home/HomeHeader";
import { HomeSearchBar } from "@/components/home/HomeSearchBar";
import { ProductGrid } from "@/components/home/ProductGrid";
import { SectionHeader } from "@/components/home/SectionHeader";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { mockListings } from "@/data/mockListings";

export default function HomeScreen() {
  return (
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

      <ProductGrid listings={mockListings} />

      <View style={styles.bottomSpacer} />
    </ScrollView>
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
    paddingBottom: 24
  },
  searchWrap: {
    marginTop: 12
  },
  categoriesWrap: {
    marginTop: 18
  },
  sectionWrap: {
    marginTop: spacing.sm,
    marginBottom: 10
  },
  bottomSpacer: {
    height: 28
  }
});
