import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { PhotoUploadPreview } from "@/components/sell/PhotoUploadPreview";
import { colors } from "@/constants/colors";
import { SellFormDraft, SellPhoto } from "@/types/sell";

type PhotosStepProps = {
  photos: SellPhoto[];
  form: SellFormDraft;
  error?: string | null;
  onChange: <Key extends keyof SellFormDraft>(key: Key, value: SellFormDraft[Key]) => void;
  onAddPhotos: (photos: SellPhoto[]) => void;
  onRemovePhoto: (photoId: string) => void;
};

const conditions = ["New", "Like new", "Good", "Fair", "Poor"];

export function PhotosStep({ photos, form, error, onChange, onAddPhotos, onRemovePhoto }: PhotosStepProps) {
  const selectedCondition = form.conditionLabel || "Good";

  return (
    <>
      <PhotoUploadPreview photos={photos} error={error} onAddPhotos={onAddPhotos} onRemovePhoto={onRemovePhoto} />

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="sparkles-outline" size={16} color="#A77C3A" />
          <Text style={styles.cardTitle}>Smart title suggestion</Text>
        </View>
        <View style={styles.inputRow}>
          <TextInput style={styles.titleInput} value={form.title} onChangeText={(value) => onChange("title", value)} placeholder="Example: MSR Hubba NX 2-Person Tent" placeholderTextColor={colors.muted} />
          <Ionicons name="create-outline" size={18} color={colors.muted} />
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Condition analysis</Text>
          <Ionicons name="information-circle-outline" size={14} color={colors.muted} />
        </View>
        <View style={styles.conditionBody}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreText}>83%</Text>
            <Text style={styles.scoreSub}>condition{"\n"}score</Text>
          </View>
          <View style={styles.analysisTextWrap}>
            <Text style={styles.analysisTitle}>Looks great</Text>
            <Text style={styles.analysisText}>Choose the condition that best matches your item.</Text>
            <View style={styles.conditionChips}>
              {conditions.map((condition) => {
                const selected = selectedCondition === condition;
                return (
                  <Pressable key={condition} style={[styles.conditionChip, selected && styles.selectedChip]} onPress={() => onChange("conditionLabel", condition)}>
                    <Text style={[styles.conditionText, selected && styles.selectedText]}>{condition}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Fair price recommendation</Text>
          <Ionicons name="information-circle-outline" size={14} color={colors.muted} />
        </View>
        <View style={styles.priceBody}>
          <View style={styles.priceLeft}>
            <Text style={styles.priceRange}>Suggested range</Text>
            <Text style={styles.priceSub}>Based on category and condition.</Text>
          </View>
          <View style={styles.demandCard}>
            <Ionicons name="trending-up-outline" size={20} color={colors.text} />
            <View style={styles.demandTextWrap}>
              <Text style={styles.demandTitle}>High demand</Text>
              <Text style={styles.demandSub}>Great time to sell.</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.priceInputCard}>
        <Text style={styles.priceLabel}>Set your price</Text>
        <TextInput style={styles.priceInput} value={form.priceLabel} onChangeText={(value) => onChange("priceLabel", value)} placeholder="€220" placeholderTextColor={colors.muted} keyboardType="numeric" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: 14, borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 14 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  cardTitle: { color: colors.text, fontSize: 14, fontWeight: "600", lineHeight: 18 },
  inputRow: { height: 44, marginTop: 12, flexDirection: "row", alignItems: "center", borderRadius: 10, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 13 },
  titleInput: { flex: 1, color: colors.text, fontSize: 14, fontWeight: "500", paddingVertical: 0 },
  conditionBody: { marginTop: 14, flexDirection: "row", alignItems: "center" },
  scoreCircle: { width: 78, height: 78, alignItems: "center", justifyContent: "center", borderRadius: 39, borderWidth: 7, borderColor: "#C69A54", backgroundColor: colors.surface },
  scoreText: { color: colors.text, fontSize: 22, fontWeight: "500" },
  scoreSub: { color: "#5F655F", fontSize: 9.5, lineHeight: 12, textAlign: "center" },
  analysisTextWrap: { flex: 1, marginLeft: 18 },
  analysisTitle: { color: colors.text, fontSize: 14, fontWeight: "700" },
  analysisText: { marginTop: 4, color: "#5F655F", fontSize: 11.5, lineHeight: 15 },
  conditionChips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 14 },
  conditionChip: { height: 32, justifyContent: "center", borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 14 },
  selectedChip: { borderColor: "#171717", backgroundColor: "#171717" },
  conditionText: { color: colors.text, fontSize: 12, fontWeight: "500" },
  selectedText: { color: colors.surface },
  priceBody: { marginTop: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  priceLeft: { flex: 1 },
  priceRange: { color: colors.text, fontSize: 28, fontWeight: "400", letterSpacing: -0.4, lineHeight: 34 },
  priceSub: { marginTop: 6, color: "#5F655F", fontSize: 11, lineHeight: 15 },
  demandCard: { width: 158, height: 56, flexDirection: "row", alignItems: "center", borderRadius: 12, backgroundColor: "#F7F2EB", paddingHorizontal: 12 },
  demandTextWrap: { marginLeft: 9 },
  demandTitle: { color: colors.text, fontSize: 12, fontWeight: "700" },
  demandSub: { marginTop: 2, color: "#5F655F", fontSize: 10.5 },
  priceInputCard: { height: 58, marginTop: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 14 },
  priceLabel: { color: colors.text, fontSize: 14, fontWeight: "600" },
  priceInput: { width: 166, height: 42, borderRadius: 10, borderWidth: 1, borderColor: colors.border, color: colors.text, fontSize: 14, fontWeight: "500", paddingHorizontal: 14, paddingVertical: 0 }
});
