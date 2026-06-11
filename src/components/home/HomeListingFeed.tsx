import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

import { ProductGrid } from "@/components/home/ProductGrid";
import { ProductGridSkeleton } from "@/components/marketplace/ProductGridSkeleton";
import { useAuth } from "@/hooks/useAuth";
import { getFavoriteListingIds, setListingFavorite } from "@/services/favorites";
import { getActiveListings } from "@/services/listings";
import { Listing } from "@/types/listing";

export function HomeListingFeed() {
  const router = useRouter();
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
      const nextPath = ["", "auth", "welcome"].join("/");
      router.push(nextPath as never);
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

  return <ProductGrid listings={listings} onFavoritePress={handleFavoritePress} />;
}
