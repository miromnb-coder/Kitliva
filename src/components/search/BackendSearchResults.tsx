import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

import { MarketplaceStateCard } from "@/components/marketplace/MarketplaceStateCard";
import { ProductGridSkeleton } from "@/components/marketplace/ProductGridSkeleton";
import { ExploreProductGrid } from "@/components/search/ExploreProductGrid";
import { useAuth } from "@/hooks/useAuth";
import { getFavoriteListingIds, setListingFavorite } from "@/services/favorites";
import { searchListings } from "@/services/listings";
import { Listing } from "@/types/listing";
import { SearchFilters } from "@/types/search";

type BackendSearchResultsProps = {
  query: string;
  filters: SearchFilters;
  onCountChange: (count: number) => void;
};

function parsePrice(value: string) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

export function BackendSearchResults({ query, filters, onCountChange }: BackendSearchResultsProps) {
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
      const nextListings = await searchListings({
        query,
        categoryName: filters.categoryName,
        condition: filters.condition,
        minPrice: parsePrice(filters.minPrice),
        maxPrice: parsePrice(filters.maxPrice),
        city: filters.city,
        sort: filters.sort
      }, favoriteIds);

      if (isMounted) {
        setListings(nextListings);
        onCountChange(nextListings.length);
        setIsLoading(false);
      }
    }

    const timeout = setTimeout(() => {
      loadListings().catch(() => {
        if (isMounted) {
          setListings([]);
          onCountChange(0);
          setHasError(true);
          setIsLoading(false);
        }
      });
    }, 320);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [filters, onCountChange, query, user]);

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

  if (isLoading) return <ProductGridSkeleton />;

  if (hasError) {
    return <MarketplaceStateCard icon="refresh-outline" title="Could not load gear" message="Please try again in a moment." />;
  }

  if (listings.length === 0) {
    return <MarketplaceStateCard icon="search-outline" title="No gear found" message="Try changing your filters or search terms." />;
  }

  return <ExploreProductGrid listings={listings} onFavoritePress={handleFavoritePress} />;
}
