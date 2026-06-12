import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { ProductGrid } from "@/components/home/ProductGrid";
import { ProductGridSkeleton } from "@/components/marketplace/ProductGridSkeleton";
import { EmptyStateCard } from "@/components/ui/EmptyStateCard";
import { useAuth } from "@/hooks/useAuth";
import { getFavoriteListingIds, setListingFavorite } from "@/services/favorites";
import { searchListings } from "@/services/listings";
import { Listing } from "@/types/listing";
import { SearchFilters } from "@/types/search";

type HomeListingFeedProps = {
  query: string;
  filters: SearchFilters;
};

export function HomeListingFeed({ query, filters }: HomeListingFeedProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadListings() {
      setIsLoading(true);
      setHasError(false);
      const favoriteIds = user ? await getFavoriteListingIds(user.id) : [];
      const nextListings = await searchListings(
        {
          query,
          categoryName: filters.categoryName,
          condition: filters.condition,
          minPrice: filters.minPrice ? Number(filters.minPrice) : null,
          maxPrice: filters.maxPrice ? Number(filters.maxPrice) : null,
          city: filters.city,
          sort: filters.sort
        },
        favoriteIds
      );

      if (isMounted) {
        setListings(nextListings);
        setIsLoading(false);
      }
    }

    loadListings().catch(() => {
      if (isMounted) {
        setListings([]);
        setHasError(true);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [filters, query, user]);

  async function handleFavoritePress(listing: Listing) {
    if (!user) {
      router.push("/auth/welcome");
      return;
    }

    const nextFavoriteState = !listing.isFavorite;
    setListings((items) => items.map((item) => (item.id === listing.id ? { ...item, isFavorite: nextFavoriteState } : item)));

    const result = await setListingFavorite({ userId: user.id, listingId: listing.id, shouldFavorite: nextFavoriteState });

    if (!result.success) {
      setListings((items) => items.map((item) => (item.id === listing.id ? { ...item, isFavorite: listing.isFavorite } : item)));
    }
  }

  if (isLoading) {
    return <ProductGridSkeleton />;
  }

  if (hasError) {
    return <View style={styles.emptyWrap}><EmptyStateCard icon="refresh-outline" title="Could not load items" body="Please try again in a moment." /></View>;
  }

  if (listings.length === 0) {
    return <View style={styles.emptyWrap}><EmptyStateCard icon="search-outline" title="No matching items" body="Try another search, category or sort option." /></View>;
  }

  return <ProductGrid listings={listings} onFavoritePress={handleFavoritePress} />;
}

const styles = StyleSheet.create({
  emptyWrap: {
    marginTop: 6
  }
});
