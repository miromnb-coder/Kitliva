import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";

import { EmptyStateCard } from "@/components/ui/EmptyStateCard";
import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";
import { updateOfferStatus } from "@/services/offers";
import { getSellerDashboard, SellerDashboardData, SellerDashboardOffer } from "@/services/sellerDashboard";
import { Listing } from "@/types/listing";
import { formatPrice } from "@/utils/formatPrice";

const emptyDashboard: SellerDashboardData = {
  activeListingsCount: 0,
  pendingOffersCount: 0,
  activeDealsCount: 0,
  totalSaves: 0,
  activeListingsPreview: [],
  pendingOffersPreview: [],
  activeDealsPreview: []
};

export default function SellerDashboardScreen() {
  const router = useRouter();
  const { isLoading, user } = useAuth();
  const [dashboard, setDashboard] = useState<SellerDashboardData>(emptyDashboard);
  const [loading, setLoading] = useState(true);
  const [updatingOfferId, setUpdatingOfferId] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const nextDashboard = await getSellerDashboard(user.id);
    setDashboard(nextDashboard);
    setLoading(false);
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      if (!isLoading && !user) {
        router.push("/auth/welcome");
        return;
      }

      loadDashboard().catch(() => {
        setDashboard(emptyDashboard);
        setLoading(false);
      });
    }, [isLoading, loadDashboard, router, user])
  );

  async function respondToOffer(offerId: string, status: "accepted" | "declined") {
    if (!user || updatingOfferId) return;
    setUpdatingOfferId(offerId);
    await updateOfferStatus({ offerId, sellerId: user.id, status });
    setUpdatingOfferId(null);
    loadDashboard();
  }

  if (isLoading || !user) return <Screen noPadding><View style={styles.screen} /></Screen>;

  const hasActivity = dashboard.activeListingsCount + dashboard.pendingOffersCount + dashboard.activeDealsCount > 0;

  return (
    <Screen noPadding>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable style={styles.backButton} onPress={() => router.back()}><Ionicons name="arrow-back" size={22} color={colors.text} /></Pressable>
        <Text style={styles.title}>Seller dashboard</Text>
        <Text style={styles.subtitle}>Track listings, offers and active deals.</Text>

        <View style={styles.summaryCard}>
          <Stat icon="pricetag-outline" value={dashboard.activeListingsCount} label="Listings" />
          <View style={styles.statSeparator} />
          <Stat icon="mail-unread-outline" value={dashboard.pendingOffersCount} label="Offers" />
          <View style={styles.statSeparator} />
          <Stat icon="briefcase-outline" value={dashboard.activeDealsCount} label="Deals" />
          <View style={styles.statSeparator} />
          <Stat icon="heart-outline" value={dashboard.totalSaves} label="Saves" />
        </View>

        <View style={styles.quickRow}>
          <QuickCard icon="add-circle-outline" title="Create listing" subtitle="Sell unused gear" onPress={() => router.push("/sell")} />
          <QuickCard icon="pricetag-outline" title="My listings" subtitle="Manage active gear" onPress={() => router.push("/my-listings")} />
        </View>

        {loading ? (
          <View style={styles.loadingWrap}><EmptyStateCard icon="analytics-outline" title="Loading dashboard..." body="Your seller activity will appear here in a moment." /></View>
        ) : !hasActivity ? (
          <View style={styles.loadingWrap}><EmptyStateCard icon="storefront-outline" title="Start selling on Kitliva" body="Create your first listing and manage offers from here." primaryLabel="Create listing" onPrimaryPress={() => router.push("/sell")} /></View>
        ) : (
          <>
            <SectionHeader title="Active listings" action="View all" onPress={() => router.push("/my-listings")} />
            {dashboard.activeListingsPreview.length === 0 ? <EmptyStateCard icon="pricetag-outline" title="No active listings" body="Create your first listing to start selling." primaryLabel="Create listing" onPrimaryPress={() => router.push("/sell")} /> : <View style={styles.previewCard}>{dashboard.activeListingsPreview.map((listing, index) => <ListingRow key={listing.id} listing={listing} isLast={index === dashboard.activeListingsPreview.length - 1} onPress={() => router.push(`/listing/${listing.id}`)} />)}</View>}

            <SectionHeader title="Pending offers" />
            {dashboard.pendingOffersPreview.length === 0 ? <EmptyStateCard icon="mail-unread-outline" title="No pending offers" body="Buyer offers will appear here when they arrive." /> : <View style={styles.previewCard}>{dashboard.pendingOffersPreview.map((offer, index) => <OfferRow key={offer.id} offer={offer} isLast={index === dashboard.pendingOffersPreview.length - 1} isUpdating={updatingOfferId === offer.id} onAccept={() => respondToOffer(offer.id, "accepted")} onDecline={() => respondToOffer(offer.id, "declined")} />)}</View>}

            <SectionHeader title="Active deals" />
            {dashboard.activeDealsPreview.length === 0 ? <EmptyStateCard icon="briefcase-outline" title="No active deals" body="Accepted offers will appear here as active deals." /> : <View style={styles.previewCard}>{dashboard.activeDealsPreview.map((deal, index) => <DealRow key={deal.id} title={deal.listingTitle} price={formatPrice(deal.agreedPriceAmount, deal.currency)} imageUrl={deal.listingImageUrl} isLast={index === dashboard.activeDealsPreview.length - 1} onPress={() => router.push(`/deal/${deal.id}`)} />)}</View>}
          </>
        )}

        <View style={styles.tipsCard}>
          <View style={styles.tipsIcon}><Ionicons name="bulb-outline" size={21} color="#A77C3A" /></View>
          <View style={styles.tipsTextWrap}>
            <Text style={styles.tipsTitle}>Sell faster</Text>
            <Text style={styles.tipsBody}>Add clear photos, honest condition details and a fair price.</Text>
          </View>
          <Pressable style={styles.tipsButton} onPress={() => router.push("/safety")}><Text style={styles.tipsButtonText}>Tips</Text></Pressable>
        </View>
      </ScrollView>
    </Screen>
  );
}

function Stat({ icon, value, label }: { icon: keyof typeof Ionicons.glyphMap; value: number; label: string }) {
  return <View style={styles.stat}><Ionicons name={icon} size={20} color={colors.text} /><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>;
}

function QuickCard({ icon, title, subtitle, onPress }: { icon: keyof typeof Ionicons.glyphMap; title: string; subtitle: string; onPress: () => void }) {
  return <Pressable style={styles.quickCard} onPress={onPress}><Ionicons name={icon} size={24} color={colors.text} /><Text style={styles.quickTitle}>{title}</Text><Text style={styles.quickSub}>{subtitle}</Text><Ionicons name="chevron-forward" size={18} color={colors.text} style={styles.quickChevron} /></Pressable>;
}

function SectionHeader({ title, action, onPress }: { title: string; action?: string; onPress?: () => void }) {
  return <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>{title}</Text>{action && onPress ? <Pressable onPress={onPress}><Text style={styles.sectionAction}>{action}</Text></Pressable> : null}</View>;
}

function ListingRow({ listing, isLast, onPress }: { listing: Listing; isLast: boolean; onPress: () => void }) {
  return <Pressable style={[styles.row, !isLast && styles.rowBorder]} onPress={onPress}>{listing.imageUrl ? <Image source={{ uri: listing.imageUrl }} style={styles.rowImage} contentFit="cover" /> : <View style={styles.rowImagePlaceholder}><Ionicons name="image-outline" size={20} color={colors.primary} /></View>}<View style={styles.rowText}><Text style={styles.rowTitle} numberOfLines={1}>{listing.title}</Text><Text style={styles.rowMeta}>{formatPrice(listing.price, listing.currency)}</Text><Text style={styles.rowSmall}>{listing.viewCount ?? 0} views · {listing.favoriteCount ?? 0} saves</Text></View><Ionicons name="chevron-forward" size={17} color={colors.muted} /></Pressable>;
}

function OfferRow({ offer, isLast, isUpdating, onAccept, onDecline }: { offer: SellerDashboardOffer; isLast: boolean; isUpdating: boolean; onAccept: () => void; onDecline: () => void }) {
  return <View style={[styles.offerRow, !isLast && styles.rowBorder]}><View style={styles.buyerAvatar}><Text style={styles.buyerInitial}>B</Text></View><View style={styles.rowText}><Text style={styles.rowTitle} numberOfLines={1}>{offer.listingTitle}</Text><Text style={styles.rowMeta}>{formatPrice(offer.amount, offer.currency)}</Text><Text style={styles.rowSmall} numberOfLines={1}>{offer.message || "Buyer sent an offer"}</Text><View style={styles.offerActions}><Pressable style={styles.acceptButton} onPress={onAccept} disabled={isUpdating}><Text style={styles.acceptText}>{isUpdating ? "..." : "Accept"}</Text></Pressable><Pressable style={styles.declineButton} onPress={onDecline} disabled={isUpdating}><Text style={styles.declineText}>Decline</Text></Pressable></View></View></View>;
}

function DealRow({ title, price, imageUrl, isLast, onPress }: { title: string; price: string; imageUrl: string | null; isLast: boolean; onPress: () => void }) {
  return <Pressable style={[styles.row, !isLast && styles.rowBorder]} onPress={onPress}>{imageUrl ? <Image source={{ uri: imageUrl }} style={styles.rowImage} contentFit="cover" /> : <View style={styles.rowImagePlaceholder}><Ionicons name="image-outline" size={20} color={colors.primary} /></View>}<View style={styles.rowText}><Text style={styles.rowTitle} numberOfLines={1}>{title}</Text><Text style={styles.rowMeta}>{price}</Text><View style={styles.statusPill}><View style={styles.statusDot} /><Text style={styles.statusText}>Agreed</Text></View></View><Ionicons name="chevron-forward" size={17} color={colors.muted} /></Pressable>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 128 },
  backButton: { width: 46, height: 46, alignItems: "center", justifyContent: "center", borderRadius: 23, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  title: { marginTop: 24, color: colors.text, fontSize: 34, fontWeight: "600", letterSpacing: -0.8, lineHeight: 40 },
  subtitle: { marginTop: 6, color: "#4F5752", fontSize: 14.5, lineHeight: 21 },
  summaryCard: { height: 104, flexDirection: "row", alignItems: "center", borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, marginTop: 20 },
  stat: { flex: 1, alignItems: "center", justifyContent: "center" },
  statValue: { marginTop: 6, color: colors.text, fontSize: 22, fontWeight: "700" },
  statLabel: { marginTop: 2, color: colors.muted, fontSize: 11.5, fontWeight: "400" },
  statSeparator: { width: 1, height: 48, backgroundColor: colors.border },
  quickRow: { flexDirection: "row", gap: 12, marginTop: 14 },
  quickCard: { flex: 1, height: 104, borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 16 },
  quickTitle: { marginTop: 13, paddingRight: 18, color: colors.text, fontSize: 14.5, fontWeight: "700" },
  quickSub: { marginTop: 5, paddingRight: 12, color: colors.muted, fontSize: 12, lineHeight: 16 },
  quickChevron: { position: "absolute", right: 14, top: 43 },
  loadingWrap: { marginTop: 18 },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 24, marginBottom: 9 },
  sectionTitle: { color: colors.text, fontSize: 20, fontWeight: "600", letterSpacing: -0.3 },
  sectionAction: { color: "#7B623C", fontSize: 12.5, fontWeight: "700" },
  previewCard: { overflow: "hidden", borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  row: { minHeight: 78, flexDirection: "row", alignItems: "center", padding: 12 },
  offerRow: { minHeight: 116, flexDirection: "row", padding: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  rowImage: { width: 58, height: 58, borderRadius: 13, marginRight: 12, backgroundColor: "#F7F2EB" },
  rowImagePlaceholder: { width: 58, height: 58, alignItems: "center", justifyContent: "center", borderRadius: 13, marginRight: 12, backgroundColor: "#F7F2EB" },
  rowText: { flex: 1 },
  rowTitle: { color: colors.text, fontSize: 14, fontWeight: "700" },
  rowMeta: { marginTop: 4, color: colors.text, fontSize: 13, fontWeight: "700" },
  rowSmall: { marginTop: 3, color: colors.muted, fontSize: 11.5, lineHeight: 15 },
  buyerAvatar: { width: 38, height: 38, alignItems: "center", justifyContent: "center", borderRadius: 19, backgroundColor: "#F7F2EB", marginRight: 12, marginTop: 2 },
  buyerInitial: { color: colors.primary, fontSize: 14, fontWeight: "700" },
  offerActions: { flexDirection: "row", gap: 8, marginTop: 10 },
  acceptButton: { height: 32, justifyContent: "center", borderRadius: 16, backgroundColor: "#171717", paddingHorizontal: 14 },
  acceptText: { color: colors.surface, fontSize: 12, fontWeight: "700" },
  declineButton: { height: 32, justifyContent: "center", borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 14 },
  declineText: { color: colors.text, fontSize: 12, fontWeight: "700" },
  statusPill: { height: 24, alignSelf: "flex-start", flexDirection: "row", alignItems: "center", borderRadius: 12, backgroundColor: "#F7F2EB", paddingHorizontal: 10, marginTop: 7 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#A77C3A", marginRight: 6 },
  statusText: { color: "#5F655F", fontSize: 11, fontWeight: "500" },
  tipsCard: { minHeight: 76, flexDirection: "row", alignItems: "center", borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: "#F7F2EB", padding: 14, marginTop: 20 },
  tipsIcon: { width: 42, height: 42, alignItems: "center", justifyContent: "center", borderRadius: 21, backgroundColor: colors.surface, marginRight: 12 },
  tipsTextWrap: { flex: 1 },
  tipsTitle: { color: colors.text, fontSize: 14.5, fontWeight: "700" },
  tipsBody: { marginTop: 3, color: "#5F655F", fontSize: 12, lineHeight: 16 },
  tipsButton: { height: 34, justifyContent: "center", borderRadius: 17, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 13, marginLeft: 10 },
  tipsButtonText: { color: "#7B623C", fontSize: 12, fontWeight: "700" }
});
