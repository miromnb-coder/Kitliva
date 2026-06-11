import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { CategoryGrid } from "@/components/home/CategoryGrid";
import { HomeHeader } from "@/components/home/HomeHeader";
import { HomeSearchBar } from "@/components/home/HomeSearchBar";
import { ProductGrid } from "@/components/home/ProductGrid";
import { SectionHeader } from "@/components/home/SectionHeader";
import { ProductGridSkeleton } from "@/components/marketplace/ProductGridSkeleton";
import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { useAuth } from "@/hooks/useAuth";
import { getFavoriteListingIds, setListingFavorite } from "@/services/favorites";
import { getActiveListings } from "@/services/listings";
import { Listing } from "@/types/listing";

export default function HomeScreen() {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadListings() {
      setIsLoading(true);
      const favoriteIds = user ? await getFavoriteListingIds(user.id) : [];
      const nextListings = await getActiveListings(favoriteIds);

      if (isMounted) {
        setListings(nextListings);
        setIsLoading(false);
      }
    }

    loadListings().catch(() => {
      if (isMounted) {
        setListings([]);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [user]);

  async function handleFavoritePress(listing: Listing) {
    if (!user) {
      return;
    }

    const nextFavoriteState = !listing.isFavorite;
    setListings((items) => items.map((item) => (item.id === listing.id ? { ...item, isFavorite: nextFavoriteState } : item)));
    await setListingFavorite({ userId: user.id, listingId: listing.id, shouldFavorite: nextFavoriteState });
  }

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

        {isLoading ? <ProductGridSkeleton /> : <ProductGrid listings={listings} onFavoritePress={handleFavoritePress} />}
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
