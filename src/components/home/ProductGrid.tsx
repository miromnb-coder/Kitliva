import { StyleSheet, View } from "react-native";

import { ProductCard } from "@/components/home/ProductCard";
import { Listing } from "@/types/listing";

type ProductGridProps = {
  listings: Listing[];
  onFavoritePress?: (listing: Listing) => void;
};

export function ProductGrid({ listings, onFavoritePress }: ProductGridProps) {
  return (
    <View style={styles.grid}>
      {listings.map((listing) => (
        <ProductCard key={listing.id} listing={listing} onFavoritePress={onFavoritePress} />
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
