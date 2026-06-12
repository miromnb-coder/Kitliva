import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

export type SellStep = "photos" | "details" | "pricing" | "delivery" | "review";

const steps: { key: SellStep; label: string }[] = [
  { key: "photos", label: "Photos" },
  { key: "details", label: "Details" },
  { key: "pricing", label: "Price" },
  { key: "delivery", label: "Delivery" },
  { key: "review", label: "Review" }
];

function getStepIndex(step: SellStep) {
  return steps.findIndex((item) => item.key === step);
}

export function SellStepIndicator({ currentStep }: { currentStep: SellStep }) {
  const currentIndex = getStepIndex(currentStep);
  const currentLabel = steps[currentIndex]?.label ?? "Photos";
  const progressWidth = `${((currentIndex + 1) / steps.length) * 100}%` as `${number}%`;

  return (
    <View style={styles.container}>
      <Text style={styles.stepCount}>Step {currentIndex + 1} of {steps.length}</Text>
      <Text style={styles.activeTitle}>{currentLabel}</Text>
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
