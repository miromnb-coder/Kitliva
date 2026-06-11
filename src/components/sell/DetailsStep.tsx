import { StyleSheet, Text, View } from "react-native";

import { AiPriceRecommendation } from "@/components/sell/AiPriceRecommendation";
import { AmountField } from "@/components/sell/AmountField";
import { ConditionSelector } from "@/components/sell/ConditionSelector";
import { SellOptionCard } from "@/components/sell/SellOptionCard";
import { SellTextField } from "@/components/sell/SellTextField";
import { colors } from "@/constants/colors";
import { mockSellListing } from "@/data/mockSellListing";

export function DetailsStep() {
  return (
    <>
      <SellTextField label="Title" value={mockSellListing.title} />

      <View style={styles.section}>
        <Text style={styles.label}>Category</Text>
        <SellOptionCard title={mockSellListing.category} subtitle="Camping, hiking and outdoor gear" icon="triangle-outline" showChevron />
      </View>

      <ConditionSelector />
      <AiPriceRecommendation />
      <AmountField />
      <SellTextField label="Description" value={mockSellListing.description} multiline />

      <View style={styles.section}>
        <Text style={styles.label}>Delivery options</Text>
        <View style={styles.deliveryRow}>
          <View style={styles.deliveryItem}>
            <SellOptionCard title="Local pickup" subtitle="Dublin" icon="location-outline" selected />
          </View>
          <View style={styles.deliveryItem}>
            <SellOptionCard title="Shipping" subtitle="1–3 days" icon="cube-outline" selected />
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 15
  },
  label: {
    marginBottom: 7,
    color: colors.text,
    fontSize: 14,
    fontWeight: "800"
  },
  deliveryRow: {
    flexDirection: "row",
    gap: 9
  },
  deliveryItem: {
    flex: 1
  }
});
