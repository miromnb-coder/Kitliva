import { useEffect, useState } from "react";

import { ProductGrid } from "@/components/home/ProductGrid";
import { MarketplaceStateCard } from "@/components/marketplace/MarketplaceStateCard";
import { ProductGridSkeleton } from "@/components/marketplace/ProductGridSkeleton";
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
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadListings() {
      setIsLoading(true);
      setHasError(false);
      const nextListings = await searchListings({
        query,
        categoryName: filters.categoryName,
        condition: filters.condition,
        minPrice: parsePrice(filters.minPrice),
        maxPrice: parsePrice(filters.maxPrice),
        city: filters.city,
        sort: filters.sort
      });

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
  }, [filters, onCountChange, query]);

  if (isLoading) return <ProductGridSkeleton />;

  if (hasError) {
    return <MarketplaceStateCard icon="refresh-outline" title="Could not load results" message="Please check your connection and try again." />;
  }

  if (listings.length === 0) {
    return <MarketplaceStateCard icon="search-outline" title="No matching gear found" message="Try a different search or remove some filters." />;
  }

  return <ProductGrid listings={listings} />;
}
