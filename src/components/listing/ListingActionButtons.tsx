import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { useI18n } from "@/i18n";

type ListingActionButtonsProps = {
  onMessage?: () => void;
  onOffer?: () => void;
};

export function ListingActionButtons({ onMessage, onOffer }: ListingActionButtonsProps) {
  const { t } = useI18n();

  return (
    <View style={styles.container}>
      <Pressable style={styles.primaryButton} onPress={onMessage}>
        <Text style={styles.primaryText}>{t("listing.messageSeller")}</Text>
      </Pressable>
      <Pressable style={styles.secondaryButton} onPress={onOffer}>
        <Text style={styles.secondaryText}>{t("listing.makeOffer")}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 16 },
  primaryButton: { height: 52, alignItems: "center", justifyContent: "center", overflow: "hidden", borderRadius: 12, backgroundColor: colors.buttonPrimary },
  primaryText: { color: colors.surface, fontSize: 15, fontWeight: "700" },
  secondaryButton: { height: 50, alignItems: "center", justifyContent: "center", marginTop: 10, overflow: "hidden", borderRadius: 12, borderWidth: 1, borderColor: colors.text, backgroundColor: colors.surface },
  secondaryText: { color: colors.text, fontSize: 15, fontWeight: "700" }
});
