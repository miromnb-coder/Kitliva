import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { KitlivaBottomSheet } from "@/components/sheets/KitlivaBottomSheet";
import { colors } from "@/constants/colors";
import { AIListingAssistantMode, AIListingSuggestion, getAIListingSuggestion } from "@/services/aiListingAssistant";
import { SellFormDraft } from "@/types/sell";

type AIListingAssistantCardProps = {
  mode: AIListingAssistantMode;
  form: SellFormDraft;
  onApply: (patch: Partial<SellFormDraft>) => void;
};

type SuggestionRowProps = {
  label: string;
  value: string | null;
  actionLabel?: string;
  onApply?: () => void;
};

function SuggestionRow({ label, value, actionLabel = "Apply", onApply }: SuggestionRowProps) {
  if (!value) return null;

  return (
    <View style={styles.suggestionRow}>
      <View style={styles.suggestionTextWrap}>
        <Text style={styles.suggestionLabel}>{label}</Text>
        <Text style={styles.suggestionValue}>{value}</Text>
      </View>
      {onApply ? (
        <Pressable style={styles.applyButton} onPress={onApply}>
          <Text style={styles.applyText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function formatPriceRange(suggestion: AIListingSuggestion | null) {
  if (!suggestion?.suggestedPriceMin || !suggestion.suggestedPriceMax) return null;
  return `€${suggestion.suggestedPriceMin}–€${suggestion.suggestedPriceMax}`;
}

export function AIListingAssistantCard({ mode, form, onApply }: AIListingAssistantCardProps) {
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<AIListingSuggestion | null>(null);

  async function openAssistant() {
    setVisible(true);
    setIsLoading(true);
    const nextSuggestion = await getAIListingSuggestion({ mode, form });
    setSuggestion(nextSuggestion);
    setIsLoading(false);
  }

  function applyPrice() {
    if (!suggestion?.suggestedPriceMin || !suggestion.suggestedPriceMax) return;
    const middlePrice = Math.round((suggestion.suggestedPriceMin + suggestion.suggestedPriceMax) / 2);
    onApply({ priceLabel: `€${middlePrice}` });
  }

  return (
    <>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Ionicons name="sparkles-outline" size={18} color={colors.primary} />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>AI Listing Assistant</Text>
          <Text style={styles.cardText}>{mode === "pricing" ? "Get a careful starting price suggestion." : "Get help writing a clearer listing."}</Text>
        </View>
        <Pressable style={styles.cardButton} onPress={openAssistant}>
          <Text style={styles.cardButtonText}>{mode === "pricing" ? "Suggest" : "Improve"}</Text>
        </Pressable>
      </View>

      <KitlivaBottomSheet
        visible={visible}
        title="AI Listing Assistant"
        subtitle="Review every suggestion before applying it. AI will not publish or change anything automatically."
        snapPoints={["78%"]}
        backdropOpacity={0.28}
        onClose={() => setVisible(false)}
      >
        {isLoading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loadingText}>Creating suggestions...</Text>
          </View>
        ) : (
          <View>
            {suggestion?.mock ? (
              <View style={styles.noticeCard}>
                <Ionicons name="information-circle-outline" size={17} color={colors.primary} />
                <Text style={styles.noticeText}>Mock suggestions are shown until the Edge Function has an AI key configured.</Text>
              </View>
            ) : null}

            <SuggestionRow label="Suggested title" value={suggestion?.suggestedTitle ?? null} onApply={() => suggestion?.suggestedTitle && onApply({ title: suggestion.suggestedTitle })} />
            <SuggestionRow label="Category" value={suggestion?.suggestedCategoryName ?? null} onApply={() => suggestion?.suggestedCategoryName && onApply({ categoryName: suggestion.suggestedCategoryName })} />
            <SuggestionRow label="Condition" value={suggestion?.suggestedConditionLabel ?? null} onApply={() => suggestion?.suggestedConditionLabel && onApply({ conditionLabel: suggestion.suggestedConditionLabel })} />
            <SuggestionRow label="Suggested description" value={suggestion?.suggestedDescription ?? null} actionLabel="Replace" onApply={() => suggestion?.suggestedDescription && onApply({ description: suggestion.suggestedDescription })} />
            <SuggestionRow label="Price guidance" value={formatPriceRange(suggestion)} actionLabel="Use mid" onApply={applyPrice} />

            {suggestion?.missingDetails?.length ? (
              <View style={styles.listCard}>
                <Text style={styles.listTitle}>Missing details</Text>
                {suggestion.missingDetails.map((item) => <Text key={item} style={styles.listItem}>• {item}</Text>)}
              </View>
            ) : null}

            {suggestion?.safetyNotes?.length ? (
              <View style={styles.listCard}>
                <Text style={styles.listTitle}>Safety notes</Text>
                {suggestion.safetyNotes.map((item) => <Text key={item} style={styles.listItem}>• {item}</Text>)}
              </View>
            ) : null}
          </View>
        )}
      </KitlivaBottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 14, marginBottom: 15 },
  iconCircle: { width: 36, height: 36, alignItems: "center", justifyContent: "center", borderRadius: 18, backgroundColor: colors.softGreen, marginRight: 11 },
  cardContent: { flex: 1, paddingRight: 10 },
  cardTitle: { color: colors.text, fontSize: 14, fontWeight: "800", lineHeight: 18 },
  cardText: { marginTop: 3, color: colors.mutedStrong, fontSize: 12.5, fontWeight: "500", lineHeight: 17 },
  cardButton: { minWidth: 78, height: 38, alignItems: "center", justifyContent: "center", borderRadius: 19, backgroundColor: colors.buttonPrimary, paddingHorizontal: 13 },
  cardButtonText: { color: colors.buttonPrimaryText, fontSize: 12.5, fontWeight: "800" },
  loadingCard: { minHeight: 118, alignItems: "center", justifyContent: "center", borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 18 },
  loadingText: { marginTop: 10, color: colors.mutedStrong, fontSize: 13, fontWeight: "600" },
  noticeCard: { flexDirection: "row", alignItems: "flex-start", borderRadius: 16, borderWidth: 1, borderColor: colors.successBorder, backgroundColor: colors.softGreen, padding: 12, marginBottom: 12 },
  noticeText: { flex: 1, marginLeft: 8, color: colors.primary, fontSize: 12.5, fontWeight: "600", lineHeight: 17 },
  suggestionRow: { flexDirection: "row", alignItems: "center", borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 13, marginBottom: 10 },
  suggestionTextWrap: { flex: 1, paddingRight: 10 },
  suggestionLabel: { color: colors.muted, fontSize: 12, fontWeight: "700" },
  suggestionValue: { marginTop: 4, color: colors.text, fontSize: 13, fontWeight: "700", lineHeight: 18 },
  applyButton: { height: 34, alignItems: "center", justifyContent: "center", borderRadius: 17, backgroundColor: colors.buttonPrimary, paddingHorizontal: 12 },
  applyText: { color: colors.buttonPrimaryText, fontSize: 12, fontWeight: "800" },
  listCard: { borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 13, marginTop: 4, marginBottom: 10 },
  listTitle: { color: colors.text, fontSize: 13.5, fontWeight: "800", marginBottom: 7 },
  listItem: { color: colors.mutedStrong, fontSize: 12.5, fontWeight: "500", lineHeight: 18, marginBottom: 3 }
});
