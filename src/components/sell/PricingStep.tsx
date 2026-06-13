import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { SellTextField } from "@/components/sell/SellTextField";
import { colors } from "@/constants/colors";
import { useI18n } from "@/i18n";
import { SellFormDraft } from "@/types/sell";

type PricingStepProps = {
  form: SellFormDraft;
  error?: string | null;
  onChange: <Key extends keyof SellFormDraft>(key: Key, value: SellFormDraft[Key]) => void;
};

export function PricingStep({ form, error, onChange }: PricingStepProps) {
  const { t } = useI18n();

  return (
    <>
      <View style={styles.headerBlock}>
        <Text style={styles.screenTitle}>{t("sell.pricing.title")}</Text>
        <Text style={styles.screenSubtitle}>{t("sell.pricing.subtitle")}</Text>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.priceCard}>
        <SellTextField label={t("sell.pricing.price")} value={form.priceLabel} placeholder="€220" keyboardType="decimal-pad" onChangeText={(value) => onChange("priceLabel", value)} />
        <Text style={styles.helperText}>{t("sell.pricing.helper")}</Text>
      </View>

      <View style={styles.tipCard}>
        <View style={styles.tipIconCircle}>
          <Ionicons name="pricetag-outline" size={16} color={colors.primary} />
        </View>
        <View style={styles.tipContent}>
          <Text style={styles.tipTitle}>{t("sell.pricing.tipTitle")}</Text>
          <Text style={styles.tipText}>{t("sell.pricing.tipBody")}</Text>
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
  priceCard: { borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 16, marginBottom: 15 },
  helperText: { marginTop: -3, color: colors.mutedStrong, fontSize: 12.5, fontWeight: "500", lineHeight: 17 },
  tipCard: { flexDirection: "row", alignItems: "flex-start", borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 14 },
  tipIconCircle: { width: 32, height: 32, alignItems: "center", justifyContent: "center", borderRadius: 16, backgroundColor: colors.softGreen, marginRight: 11 },
  tipContent: { flex: 1 },
  tipTitle: { color: colors.text, fontSize: 14, fontWeight: "800", lineHeight: 18 },
  tipText: { marginTop: 4, color: colors.mutedStrong, fontSize: 12.5, fontWeight: "500", lineHeight: 17 }
});
