import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { Deal } from "@/services/deals";
import { formatPrice } from "@/utils/formatPrice";

type ActiveDealCardProps = {
  deal: Deal;
  onPress: () => void;
};

export function ActiveDealCard({ deal, onPress }: ActiveDealCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Active deals</Text>
        <Pressable style={styles.viewButton} onPress={onPress}>
          <Text style={styles.viewText}>View</Text>
          <Ionicons name="chevron-forward" size={15} color={colors.muted} />
        </Pressable>
      </View>
      <View style={styles.content}>
        {deal.listingImageUrl ? <Image source={{ uri: deal.listingImageUrl }} style={styles.image} contentFit="cover" /> : <View style={styles.imagePlaceholder}><Ionicons name="image-outline" size={24} color={colors.primary} /></View>}
        <View style={styles.textWrap}>
          <Text style={styles.itemTitle} numberOfLines={2}>{deal.listingTitle}</Text>
          <Text style={styles.meta}>{formatPrice(deal.agreedPriceAmount, deal.currency)}</Text>
          <View style={styles.statusPill}><View style={styles.statusDot} /><Text style={styles.statusText}>{deal.status === "agreed" ? "Deal agreed" : deal.status}</Text></View>
        </View>
      </View>
      <Pressable style={styles.conversationButton} onPress={onPress}>
        <Text style={styles.conversationText}>View deal</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.muted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: 24, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 14 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { color: colors.text, fontSize: 16, fontWeight: "600", lineHeight: 20 },
  viewButton: { flexDirection: "row", alignItems: "center" },
  viewText: { color: "#5F655F", fontSize: 12, fontWeight: "500", marginRight: 4 },
  content: { marginTop: 16, flexDirection: "row" },
  image: { width: 116, height: 86, borderRadius: 12, backgroundColor: "#F7F2EB" },
  imagePlaceholder: { width: 116, height: 86, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#F7F2EB" },
  textWrap: { flex: 1, marginLeft: 14 },
  itemTitle: { color: colors.text, fontSize: 14.5, fontWeight: "700", lineHeight: 18 },
  meta: { marginTop: 5, color: colors.muted, fontSize: 12, fontWeight: "500" },
  statusPill: { height: 24, alignSelf: "flex-start", flexDirection: "row", alignItems: "center", borderRadius: 12, backgroundColor: "#F7F2EB", paddingHorizontal: 10, marginTop: 8 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#A77C3A", marginRight: 6 },
  statusText: { color: "#5F655F", fontSize: 11, fontWeight: "500", textTransform: "capitalize" },
  conversationButton: { height: 44, marginTop: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 14 },
  conversationText: { color: colors.text, fontSize: 13, fontWeight: "500" }
});
