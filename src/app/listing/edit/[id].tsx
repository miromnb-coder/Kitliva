import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";

import { DetailsStep } from "@/components/sell/DetailsStep";
import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";
import { getOwnListingById, listingToSellForm, updateOwnListing, updateOwnListingStatus } from "@/services/myListings";
import { Listing } from "@/types/listing";
import { emptySellFormDraft, SellFormDraft } from "@/types/sell";

export default function EditListingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isLoading, user } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [form, setForm] = useState<SellFormDraft>(emptySellFormDraft);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      async function loadListing() {
        if (!isLoading && !user) {
          router.push("/auth/welcome");
          return;
        }

        if (!user || !id) return;
        setLoading(true);
        const nextListing = await getOwnListingById(user.id, id);

        if (isMounted) {
          setListing(nextListing);
          if (nextListing) setForm(listingToSellForm(nextListing));
          setLoading(false);
        }
      }

      loadListing().catch(() => {
        if (isMounted) {
          setListing(null);
          setLoading(false);
        }
      });

      return () => {
        isMounted = false;
      };
    }, [id, isLoading, router, user])
  );

  function updateForm<Key extends keyof SellFormDraft>(key: Key, value: SellFormDraft[Key]) {
    setMessage(null);
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function saveChanges() {
    if (!user || !id) return;
    setSaving(true);
    const result = await updateOwnListing(user.id, id, form);
    setSaving(false);
    setMessage(result.success ? "Changes saved" : result.message ?? "Could not save changes.");
  }

  async function changeStatus(nextStatus: "sold" | "archived") {
    if (!user || !id) return;
    setSaving(true);
    const result = await updateOwnListingStatus(user.id, id, nextStatus);
    setSaving(false);
    if (result.success) {
      setMessage(nextStatus === "sold" ? "Listing marked as sold" : "Listing archived");
      router.replace("/my-listings");
    } else {
      setMessage(result.message ?? "Could not update listing.");
    }
  }

  if (isLoading || loading) {
    return <Screen noPadding><View style={styles.screen} /></Screen>;
  }

  if (!listing) {
    return (
      <Screen noPadding>
        <View style={styles.centerScreen}>
          <Text style={styles.notFoundTitle}>Listing unavailable</Text>
          <Text style={styles.notFoundText}>This listing may have been removed or you may not have permission to edit it.</Text>
          <Pressable style={styles.primaryButton} onPress={() => router.replace("/my-listings")}><Text style={styles.primaryButtonText}>Back to my listings</Text></Pressable>
        </View>
      </Screen>
    );
  }

  return (
    <Screen noPadding>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable style={styles.roundButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </Pressable>
          <Text style={styles.title}>Edit listing</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusIcon}><Ionicons name="eye-outline" size={18} color={colors.primary} /></View>
          <View style={styles.statusTextWrap}>
            <Text style={styles.statusTitle}>{listing.status ?? "active"} listing</Text>
            <Text style={styles.statusSub}>Update the details buyers see.</Text>
          </View>
        </View>

        <View style={styles.photoCard}>
          {listing.imageUrl ? <Image source={{ uri: listing.imageUrl }} style={styles.photo} contentFit="cover" /> : <View style={styles.photoPlaceholder}><Ionicons name="image-outline" size={24} color={colors.primary} /></View>}
          <View style={styles.photoTextWrap}>
            <Text style={styles.photoTitle}>{listing.imageCount ?? 0} photos</Text>
            <Text style={styles.photoSub}>Photo editing coming soon.</Text>
          </View>
        </View>

        {message ? <View style={styles.messageCard}><Text style={styles.messageText}>{message}</Text></View> : null}

        <DetailsStep form={form} onChange={updateForm} />

        <Pressable style={[styles.saveButton, saving && styles.disabledButton]} onPress={saveChanges} disabled={saving}>
          <Text style={styles.saveButtonText}>{saving ? "Saving..." : "Save changes"}</Text>
        </Pressable>

        <View style={styles.actionsCard}>
          <Text style={styles.actionsTitle}>Listing actions</Text>
          <Pressable style={styles.actionRow} onPress={() => changeStatus("sold")}>
            <Ionicons name="checkmark-circle-outline" size={20} color={colors.primary} />
            <View style={styles.actionTextWrap}><Text style={styles.actionTitle}>Mark as sold</Text><Text style={styles.actionSub}>Move this item out of active search.</Text></View>
          </Pressable>
          <View style={styles.separator} />
          <Pressable style={styles.actionRow} onPress={() => changeStatus("archived")}>
            <Ionicons name="archive-outline" size={20} color={colors.primary} />
            <View style={styles.actionTextWrap}><Text style={styles.actionTitle}>Archive listing</Text><Text style={styles.actionSub}>Hide it from buyers without deleting it.</Text></View>
          </Pressable>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 118 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  roundButton: { width: 36, height: 36, alignItems: "center", justifyContent: "center", borderRadius: 18, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  title: { color: colors.text, fontSize: 22, fontWeight: "800" },
  headerSpacer: { width: 36 },
  statusCard: { minHeight: 64, flexDirection: "row", alignItems: "center", borderRadius: 15, borderWidth: 1, borderColor: "#BFE9DC", backgroundColor: colors.mint, padding: 12, marginBottom: 13 },
  statusIcon: { width: 34, height: 34, alignItems: "center", justifyContent: "center", borderRadius: 17, backgroundColor: colors.surface, marginRight: 11 },
  statusTextWrap: { flex: 1 },
  statusTitle: { color: colors.primary, fontSize: 13.5, fontWeight: "800", textTransform: "capitalize" },
  statusSub: { marginTop: 2, color: "#51706E", fontSize: 12, fontWeight: "500" },
  photoCard: { flexDirection: "row", alignItems: "center", borderRadius: 15, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 12, marginBottom: 14 },
  photo: { width: 54, height: 54, borderRadius: 12, marginRight: 12 },
  photoPlaceholder: { width: 54, height: 54, alignItems: "center", justifyContent: "center", borderRadius: 12, backgroundColor: colors.mint, marginRight: 12 },
  photoTextWrap: { flex: 1 },
  photoTitle: { color: colors.text, fontSize: 14, fontWeight: "800" },
  photoSub: { marginTop: 3, color: colors.muted, fontSize: 12, fontWeight: "500" },
  messageCard: { minHeight: 38, justifyContent: "center", borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 12, marginBottom: 14 },
  messageText: { color: colors.primary, fontSize: 12.5, fontWeight: "800" },
  saveButton: { height: 46, alignItems: "center", justifyContent: "center", borderRadius: 12, backgroundColor: colors.primary, marginTop: 4, marginBottom: 15 },
  disabledButton: { opacity: 0.7 },
  saveButtonText: { color: colors.surface, fontSize: 14, fontWeight: "800" },
  actionsCard: { borderRadius: 15, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 13 },
  actionsTitle: { color: colors.text, fontSize: 15, fontWeight: "800", marginBottom: 8 },
  actionRow: { flexDirection: "row", alignItems: "center", minHeight: 54 },
  actionTextWrap: { flex: 1, marginLeft: 10 },
  actionTitle: { color: colors.text, fontSize: 13.5, fontWeight: "800" },
  actionSub: { marginTop: 2, color: colors.muted, fontSize: 11.5, fontWeight: "500" },
  separator: { height: 1, backgroundColor: colors.border, marginVertical: 4 },
  centerScreen: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background, paddingHorizontal: 24 },
  notFoundTitle: { color: colors.text, fontSize: 20, fontWeight: "800" },
  notFoundText: { marginTop: 8, color: colors.muted, fontSize: 13, fontWeight: "500", textAlign: "center", lineHeight: 18 },
  primaryButton: { height: 42, justifyContent: "center", borderRadius: 21, backgroundColor: colors.primary, paddingHorizontal: 16, marginTop: 14 },
  primaryButtonText: { color: colors.surface, fontSize: 13, fontWeight: "800" }
});
