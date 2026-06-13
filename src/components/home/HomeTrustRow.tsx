import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { useI18n } from "@/i18n";

const trustItems = [
  { labelKey: "home.trustVerified", icon: "shield-checkmark" as const },
  { labelKey: "home.trustPrices", icon: "pricetag-outline" as const },
  { labelKey: "home.trustChat", icon: "lock-closed-outline" as const }
];

export function HomeTrustRow() {
  const { t } = useI18n();

  return (
    <View style={styles.container}>
      {trustItems.map((item, index) => (
        <View key={item.labelKey} style={styles.itemWrap}>
          <View style={styles.item}>
            <Ionicons name={item.icon} size={10.5} color={colors.primary} />
            <Text style={styles.label} maxFontSizeMultiplier={1}>{t(item.labelKey)}</Text>
          </View>
          {index < trustItems.length - 1 ? <Text style={styles.dot}>•</Text> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { minHeight: 17, flexDirection: "row", alignItems: "center", marginTop: 11 },
  itemWrap: { flexDirection: "row", alignItems: "center" },
  item: { flexDirection: "row", alignItems: "center" },
  label: { marginLeft: 4, color: colors.mutedStrong, fontSize: 9.8, fontWeight: "500" },
  dot: { marginHorizontal: 10, color: "#B5A78F", fontSize: 10, fontWeight: "600" }
});
