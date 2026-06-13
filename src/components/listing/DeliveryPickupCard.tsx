import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { useI18n } from "@/i18n";
import { Listing } from "@/types/listing";

type DeliveryPickupCardProps = {
  listing: Listing;
};

export function DeliveryPickupCard({ listing }: DeliveryPickupCardProps) {
  const { t } = useI18n();
  const location = listing.sellerLocation && listing.sellerLocation !== "Location not set" ? t("listing.meetIn", { location: listing.sellerLocation }) : t("listing.agreePickup");

  return (
    <View style={styles.container}>
      <View style={styles.infoCard}>
        <View style={styles.column}>
          <Ionicons name="location-outline" size={18} color="#7B623C" />
          <Text style={styles.title}>{t("listing.localPickup")}</Text>
          <Text style={styles.subtitle}>{location}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.column}>
          <Ionicons name="cube-outline" size={18} color="#7B623C" />
          <Text style={styles.title}>{t("listing.delivery")}</Text>
          <Text style={styles.subtitle}>{t("listing.agreeSeller")}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.column}>
          <Ionicons name="lock-closed-outline" size={18} color="#7B623C" />
          <Text style={styles.title}>{t("listing.safeChat")}</Text>
          <Text style={styles.subtitle}>{t("listing.keepOnKitliva")}</Text>
        </View>
      </View>

      <View style={styles.trustNote}>
        <Ionicons name="shield-checkmark" size={14} color={colors.primary} />
        <Text style={styles.trustText}>{t("listing.staySafe")}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 16 },
  infoCard: { height: 78, overflow: "hidden", flexDirection: "row", borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  column: { flex: 1, justifyContent: "center", paddingHorizontal: 10 },
  divider: { width: 1, height: 46, alignSelf: "center", backgroundColor: colors.border },
  title: { marginTop: 6, color: colors.text, fontSize: 11, fontWeight: "700" },
  subtitle: { marginTop: 3, color: colors.muted, fontSize: 9.5, fontWeight: "400", lineHeight: 13 },
  trustNote: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 16 },
  trustText: { marginLeft: 7, color: colors.mutedStrong, fontSize: 11, fontWeight: "500" }
});
