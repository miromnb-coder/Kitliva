import { StyleSheet, Text, View } from "react-native";

import { SellOptionCard } from "@/components/sell/SellOptionCard";
import { SellTextField } from "@/components/sell/SellTextField";
import { colors } from "@/constants/colors";
import { useI18n } from "@/i18n";
import { SellFormDraft } from "@/types/sell";

type DeliveryStepProps = {
  form: SellFormDraft;
  error?: string | null;
  onChange: <Key extends keyof SellFormDraft>(key: Key, value: SellFormDraft[Key]) => void;
};

export function DeliveryStep({ form, error, onChange }: DeliveryStepProps) {
  const { t } = useI18n();

  return (
    <>
      <View style={styles.headerBlock}>
        <Text style={styles.screenTitle}>{t("sell.delivery.title")}</Text>
        <Text style={styles.screenSubtitle}>{t("sell.delivery.subtitle")}</Text>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.locationRow}>
        <View style={styles.locationItem}>
          <SellTextField label={t("sell.delivery.city")} value={form.locationCity} placeholder={t("sell.delivery.city")} onChangeText={(value) => onChange("locationCity", value)} />
        </View>
        <View style={styles.locationItem}>
          <SellTextField label={t("sell.delivery.country")} value={form.locationCountry} placeholder={t("sell.delivery.country")} onChangeText={(value) => onChange("locationCountry", value)} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>{t("sell.delivery.deliveryOptions")}</Text>
        <View style={styles.deliveryRow}>
          <View style={styles.deliveryItem}>
            <SellOptionCard title={t("sell.delivery.pickupTitle")} subtitle={t("sell.delivery.pickupSubtitle")} icon="location-outline" selected={form.allowPickup} onPress={() => onChange("allowPickup", !form.allowPickup)} />
          </View>
          <View style={styles.deliveryItem}>
            <SellOptionCard title={t("sell.delivery.shippingTitle")} subtitle={t("sell.delivery.shippingSubtitle")} icon="cube-outline" selected={form.allowShipping} onPress={() => onChange("allowShipping", !form.allowShipping)} />
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
