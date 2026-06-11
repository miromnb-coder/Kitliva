import { Pressable, StyleSheet, Text, View } from "react-native";

import { AmountField } from "@/components/sell/AmountField";
import { ConditionSelector } from "@/components/sell/ConditionSelector";
import { SellOptionCard } from "@/components/sell/SellOptionCard";
import { SellTextField } from "@/components/sell/SellTextField";
import { colors } from "@/constants/colors";
import { SellFormDraft } from "@/types/sell";

const categories = ["Cycling", "Winter", "Outdoor", "Music", "Cameras", "Fitness", "Gaming", "Kids’ Gear"];

type DetailsStepProps = {
  form: SellFormDraft;
  onChange: <Key extends keyof SellFormDraft>(key: Key, value: SellFormDraft[Key]) => void;
};

export function DetailsStep({ form, onChange }: DetailsStepProps) {
  return (
    <>
      <SellTextField
        label="Title"
        value={form.title}
        placeholder="Example: Sony A7 III camera kit"
        onChangeText={(value) => onChange("title", value)}
      />

      <View style={styles.section}>
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryGrid}>
          {categories.map((category) => {
            const selected = form.categoryName === category;
            return (
              <Pressable key={category} style={[styles.categoryChip, selected && styles.selectedCategoryChip]} onPress={() => onChange("categoryName", category)}>
                <Text style={[styles.categoryText, selected && styles.selectedCategoryText]}>{category}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <ConditionSelector value={form.conditionLabel} onChange={(value) => onChange("conditionLabel", value)} />
      <AmountField value={form.priceLabel} onChangeText={(value) => onChange("priceLabel", value)} />
      <SellTextField
        label="Description"
        value={form.description}
        placeholder="Tell buyers what is included, how much it has been used and why you are selling it."
        multiline
        onChangeText={(value) => onChange("description", value)}
      />

      <View style={styles.locationRow}>
        <View style={styles.locationItem}>
          <SellTextField
            label="City"
            value={form.locationCity}
            placeholder="City"
            onChangeText={(value) => onChange("locationCity", value)}
          />
        </View>
        <View style={styles.locationItem}>
          <SellTextField
            label="Country"
            value={form.locationCountry}
            placeholder="Country"
            onChangeText={(value) => onChange("locationCountry", value)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Delivery options</Text>
        <View style={styles.deliveryRow}>
          <View style={styles.deliveryItem}>
            <SellOptionCard
              title="Local pickup"
              subtitle="Buyer collects it"
              icon="location-outline"
              selected={form.allowPickup}
              onPress={() => onChange("allowPickup", !form.allowPickup)}
            />
          </View>
          <View style={styles.deliveryItem}>
            <SellOptionCard
              title="Shipping"
              subtitle="Arrange with buyer"
              icon="cube-outline"
              selected={form.allowShipping}
              onPress={() => onChange("allowShipping", !form.allowShipping)}
            />
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
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  categoryChip: {
    minHeight: 34,
    justifyContent: "center",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 12
  },
  selectedCategoryChip: {
    borderColor: colors.primary,
    backgroundColor: colors.primary
  },
  categoryText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800"
  },
  selectedCategoryText: {
    color: colors.surface
  },
  locationRow: {
    flexDirection: "row",
    gap: 9
  },
  locationItem: {
    flex: 1
  },
  deliveryRow: {
    flexDirection: "row",
    gap: 9
  },
  deliveryItem: {
    flex: 1
  }
});
