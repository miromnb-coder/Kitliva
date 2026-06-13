import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { useI18n } from "@/i18n";

type DraftStatusVariant = "saved" | "error";

type SellDraftStatusCardProps = {
  variant: DraftStatusVariant;
};

type SellDraftRestoreCardProps = {
  onContinue: () => void;
  onDiscard: () => void;
};

export function SellDraftStatusCard({ variant }: SellDraftStatusCardProps) {
  const { t } = useI18n();
  const isSaved = variant === "saved";

  return (
    <View style={[styles.statusCard, isSaved ? styles.savedStatusCard : styles.errorStatusCard]}>
      <View style={[styles.statusIconCircle, isSaved ? styles.savedIconCircle : styles.errorIconCircle]}>
        <Ionicons name={isSaved ? "checkmark-circle-outline" : "alert-circle-outline"} size={17} color={isSaved ? colors.primary : colors.danger} />
      </View>
      <View style={styles.statusContent}>
        <Text style={[styles.statusTitle, isSaved ? styles.savedTitle : styles.errorTitle]}>{isSaved ? t("sell.draftSavedTitle") : t("sell.draftErrorTitle")}</Text>
        <Text style={[styles.statusSubtext, !isSaved && styles.errorSubtext]}>{isSaved ? t("sell.draftSavedBody") : t("sell.draftErrorBody")}</Text>
      </View>
    </View>
  );
}

export function SellDraftRestoreCard({ onContinue, onDiscard }: SellDraftRestoreCardProps) {
  const { t } = useI18n();

  return (
    <View style={styles.restoreCard}>
      <View style={styles.restoreTopRow}>
        <View style={styles.restoreIconCircle}>
          <Ionicons name="document-text-outline" size={18} color={colors.accent} />
        </View>
        <View style={styles.restoreContent}>
          <Text style={styles.restoreTitle}>{t("sell.restoreTitle")}</Text>
          <Text style={styles.restoreBody}>{t("sell.restoreBody")}</Text>
        </View>
      </View>
      <View style={styles.restoreButtonRow}>
        <Pressable style={styles.continueButton} onPress={onContinue}>
          <Text style={styles.continueText}>{t("common.continue")}</Text>
        </Pressable>
        <Pressable style={styles.discardButton} onPress={onDiscard}>
          <Text style={styles.discardText}>{t("sell.discard")}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statusCard: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 11,
    marginTop: 14,
    marginBottom: 2
  },
  savedStatusCard: {
    borderColor: colors.successBorder,
    backgroundColor: colors.softGreen
  },
  errorStatusCard: {
    borderColor: colors.dangerBorder,
    backgroundColor: colors.dangerSurface
  },
  statusIconCircle: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    marginRight: 11
  },
  savedIconCircle: {
    backgroundColor: colors.surface
  },
  errorIconCircle: {
    backgroundColor: colors.surface
  },
  statusContent: {
    flex: 1
  },
  statusTitle: {
    fontSize: 13,
    fontWeight: "800"
  },
  savedTitle: {
    color: colors.primary
  },
  errorTitle: {
    color: colors.dangerText
  },
  statusSubtext: {
    marginTop: 3,
    color: colors.mutedStrong,
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16
  },
  errorSubtext: {
    color: colors.dangerText
  },
  restoreCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 14,
    marginTop: 14,
    marginBottom: 8
  },
  restoreTopRow: {
    flexDirection: "row",
    alignItems: "flex-start"
  },
  restoreIconCircle: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: colors.softGold,
    marginRight: 11
  },
  restoreContent: {
    flex: 1
  },
  restoreTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 19
  },
  restoreBody: {
    marginTop: 4,
    color: colors.mutedStrong,
    fontSize: 12.5,
    fontWeight: "500",
    lineHeight: 17
  },
  restoreButtonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 13
  },
  continueButton: {
    height: 44,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    backgroundColor: colors.buttonPrimary
  },
  continueText: {
    color: colors.buttonPrimaryText,
    fontSize: 13,
    fontWeight: "700"
  },
  discardButton: {
    width: 96,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  discardText: {
    color: colors.mutedStrong,
    fontSize: 13,
    fontWeight: "700"
  }
});
