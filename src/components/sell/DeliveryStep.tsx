import { StyleSheet, Text, View } from "react-native";

import { SellOptionCard } from "@/components/sell/SellOptionCard";
import { SellTextField } from "@/components/sell/SellTextField";
import { colors } from "@/constants/colors";
import { SellFormDraft } from "@/types/sell";

type DeliveryStepProps = {
  form: SellFormDraft;
  error?: string | null;
  onChange: <Key extends keyof SellFormDraft>(key: Key, value: SellFormDraft[Key]) => void;
};

export function DeliveryStep({ form, error, onChange }: DeliveryStepProps) {
  return (
    <>
      <View style={styles.headerBlock}>
        <Text style={styles.screenTitle}>Delivery and location</Text>
        <Text style={styles.screenSubtitle}>Tell buyers where the item is and how they can get it.</Text>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.locationRow}>
        <View style={styles.locationItem}>
          <SellTextField label="City" value={form.locationCity} placeholder="City" onChangeText={(value) => onChange("locationCity", value)} />
        </View>
        <View style={styles.locationItem}>
          <SellTextField label="Country" value={form.locationCountry} placeholder="Country" onChangeText={(value) => onChange("locationCountry", value)} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Delivery options</Text>
        <View style={styles.deliveryRow}>
          <View style={styles.deliveryItem}>
            <SellOptionCard title="Local pickup" subtitle="Buyer collects it" icon="location-outline" selected={form.allowPickup} onPress={() => onChange("allowPickup", !form.allowPickup)} />
          </View>
          <View style={styles.deliveryItem}>
            <SellOptionCard title="Shipping" subtitle="Arrange with buyer" icon="cube-outline" selected={form.allowShipping} onPress={() => onChange("allowShipping", !form.allowShipping)} />
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  headerBlock: { marginBottom: 14 },
  screenTitle: { color: colors.text, fontSize: 22, fontWeight: "800", letterSpacing: -0.3, lineHeight: 28 },
  screenSubtitle: { marginTop: 5, color: colors.mutedStrong, fontSize: 13, fontWeight: "500", lineHeight: 18 },
  errorText: { marginBottom: 10, color: colors.danger, fontSize: 12, fontWeight: "700", lineHeight: 16 },
  locationRow: { flexDirection: "row", gap: 9 },
  locationItem: { flex: 1 },
  section: { marginTop: 1, marginBottom: 15 },
  label: { marginBottom: 7, color: colors.text, fontSize: 14, fontWeight: "800" },
  deliveryRow: { flexDirection: "row", gap: 10 },
  deliveryItem: { flex: 1 }
});
