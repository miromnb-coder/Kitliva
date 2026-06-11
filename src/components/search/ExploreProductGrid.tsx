import { StyleSheet, View } from "react-native";

import { ExploreProductCard } from "@/components/search/ExploreProductCard";
import { Listing } from "@/types/listing";

type ExploreProductGridProps = {
  listings: Listing[];
  onFavoritePress?: (listing: Listing) => void;
};

export function ExploreProductGrid({ listings, onFavoritePress }: ExploreProductGridProps) {
  return (
    <View style={styles.grid}>
      {listings.map((listing) => (
        <ExploreProductCard key={listing.id} listing={listing} onFavoritePress={onFavoritePress} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10
  }
});
