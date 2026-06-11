import { StyleSheet, View } from "react-native";

import { ProductCard } from "@/components/home/ProductCard";
import { Listing } from "@/types/listing";

export function ProductGrid({ listings }: { listings: Listing[] }) {
  return (
    <View style={styles.grid}>
      {listings.map((listing) => (
        <ProductCard key={listing.id} listing={listing} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12
  }
});
