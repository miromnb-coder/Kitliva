import { useEffect, useState } from "react";

import { ProductGrid } from "@/components/home/ProductGrid";
import { ProductGridSkeleton } from "@/components/marketplace/ProductGridSkeleton";
import { getActiveListings } from "@/services/listings";
import { Listing } from "@/types/listing";

type BackendSearchResultsProps = {
  query: string;
};

export function BackendSearchResults({ query }: BackendSearchResultsProps) {
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const normalizedQuery = query.trim().toLowerCase();
  const listings = normalizedQuery
    ? allListings.filter((item) => [item.title, item.subtitle, item.conditionLabel].join(" ").toLowerCase().includes(normalizedQuery))
    : allListings;

  useEffect(() => {
    let isMounted = true;

    getActiveListings()
      .then((items) => {
        if (isMounted) {
          setAllListings(items);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setAllListings([]);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return <ProductGridSkeleton />;
  }

  return <ProductGrid listings={listings} />;
}
