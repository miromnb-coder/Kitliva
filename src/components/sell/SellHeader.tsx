import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { useI18n } from "@/i18n";

const serifFont = Platform.select({ ios: "Georgia", android: "serif", default: undefined });

export type DraftSaveState = "idle" | "saving" | "saved" | "error";

type SellHeaderProps = {
  showSaveDraft?: boolean;
  draftSaveState?: DraftSaveState;
  onSaveDraft?: () => void;
};

function getDraftButtonLabelKey(state: DraftSaveState) {
  if (state === "saving") return "sell.saving";
  if (state === "saved") return "sell.saved";
  if (state === "error") return "sell.retry";
  return "sell.saveDraft";
}

function getDraftButtonIcon(state: DraftSaveState) {
  if (state === "saved") return "checkmark-circle-outline";
  if (state === "error") return "alert-circle-outline";
  return "document-text-outline";
}

export function SellHeader({ showSaveDraft = true, draftSaveState = "idle", onSaveDraft }: SellHeaderProps) {
  const { t } = useI18n();
  const isSaving = draftSaveState === "saving";
  const canSave = Boolean(showSaveDraft && onSaveDraft);

  return (
    <View>
      <View style={styles.topRow}>
        <Text style={styles.logo}>Kitliva</Text>
        {canSave ? (
          <Pressable
            style={[
              styles.draftButton,
              draftSaveState === "saved" && styles.savedDraftButton,
              draftSaveState === "error" && styles.errorDraftButton,
              (draftSaveState === "idle" || draftSaveState === "saving") && styles.defaultDraftButton,
              draftSaveState === "saved" && styles.savedDraftButtonWidth,
              draftSaveState === "error" && styles.errorDraftButtonWidth
            ]}
            onPress={onSaveDraft}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={colors.accent} />
            ) : (
              <Ionicons
                name={getDraftButtonIcon(draftSaveState)}
                size={16}
                color={draftSaveState === "saved" ? colors.primary : draftSaveState === "error" ? colors.danger : colors.accent}
              />
            )}
            <Text style={[styles.draftButtonText, draftSaveState === "saved" && styles.savedDraftText, draftSaveState === "error" && styles.errorDraftText]}>{t(getDraftButtonLabelKey(draftSaveState))}</Text>
          </Pressable>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
      <Text style={styles.title}>{t("sell.title")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: { height: 38, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  logo: { color: colors.text, fontFamily: serifFont, fontSize: 22, fontWeight: "500", letterSpacing: -0.2, lineHeight: 28 },
  draftButton: { height: 38, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 19, borderWidth: 1, paddingHorizontal: 12 },
  defaultDraftButton: { width: 116, borderColor: colors.border, backgroundColor: colors.surface },
  savedDraftButton: { borderColor: colors.successBorder, backgroundColor: colors.softGreen },
  errorDraftButton: { borderColor: colors.dangerBorder, backgroundColor: colors.dangerSurface },
  savedDraftButtonWidth: { width: 104 },
  errorDraftButtonWidth: { width: 116 },
  draftButtonText: { color: colors.text, fontSize: 12.5, fontWeight: "700" },
  savedDraftText: { color: colors.primary },
  errorDraftText: { color: colors.danger },
  title: { marginTop: 22, color: colors.text, fontSize: 30, fontWeight: "600", letterSpacing: -0.5, lineHeight: 36 },
  placeholder: { width: 38, height: 38 }
});
