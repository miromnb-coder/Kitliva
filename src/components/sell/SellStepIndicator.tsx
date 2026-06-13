import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { useI18n } from "@/i18n";

export type SellStep = "photos" | "details" | "pricing" | "delivery" | "review";

const steps: { key: SellStep; labelKey: string }[] = [
  { key: "photos", labelKey: "sell.steps.photos" },
  { key: "details", labelKey: "sell.steps.details" },
  { key: "pricing", labelKey: "sell.steps.pricing" },
  { key: "delivery", labelKey: "sell.steps.delivery" },
  { key: "review", labelKey: "sell.steps.review" }
];

function getStepIndex(step: SellStep) {
  return steps.findIndex((item) => item.key === step);
}

export function SellStepIndicator({ currentStep }: { currentStep: SellStep }) {
  const { t } = useI18n();
  const currentIndex = getStepIndex(currentStep);
  const currentLabelKey = steps[currentIndex]?.labelKey ?? "sell.steps.photos";
  const progressWidth = `${((currentIndex + 1) / steps.length) * 100}%` as `${number}%`;

  return (
    <View style={styles.container}>
      <Text style={styles.stepCount}>{t("sell.steps.count", { current: currentIndex + 1, total: steps.length })}</Text>
      <Text style={styles.activeTitle}>{t(currentLabelKey)}</Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: progressWidth }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 22,
    marginBottom: 18
  },
  stepCount: {
    color: colors.mutedStrong,
    fontSize: 12.5,
    fontWeight: "700",
    lineHeight: 16
  },
  activeTitle: {
    marginTop: 3,
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.2,
    lineHeight: 23
  },
  progressTrack: {
    height: 5,
    overflow: "hidden",
    borderRadius: 999,
    backgroundColor: colors.border,
    marginTop: 10
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.buttonPrimary
  }
});
