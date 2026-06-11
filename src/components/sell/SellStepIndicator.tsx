import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

export type SellStep = "photos" | "details" | "review";

const steps: { key: SellStep; label: string }[] = [
  { key: "photos", label: "Photos" },
  { key: "details", label: "Details" },
  { key: "review", label: "Review" }
];

function getStepIndex(step: SellStep) {
  return steps.findIndex((item) => item.key === step);
}

export function SellStepIndicator({ currentStep }: { currentStep: SellStep }) {
  const currentIndex = getStepIndex(currentStep);

  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isActive = index === currentIndex;
        const isCompleted = index < currentIndex;

        return (
          <View key={step.key} style={styles.stepWrap}>
            <View style={styles.stepContent}>
              <View style={[styles.circle, isActive || isCompleted ? styles.activeCircle : styles.inactiveCircle]}>
                {isCompleted ? (
                  <Ionicons name="checkmark" size={13} color={colors.surface} />
                ) : (
                  <Text style={[styles.number, isActive ? styles.activeNumber : styles.inactiveNumber]}>{index + 1}</Text>
                )}
              </View>
              <Text style={[styles.label, isActive ? styles.activeLabel : styles.inactiveLabel]}>{step.label}</Text>
            </View>
            {index < steps.length - 1 ? <View style={[styles.line, isCompleted && styles.activeLine]} /> : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 54,
    marginTop: 22,
    flexDirection: "row",
    alignItems: "flex-start"
  },
  stepWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start"
  },
  stepContent: {
    width: 72,
    alignItems: "center"
  },
  circle: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17
  },
  activeCircle: {
    backgroundColor: "#171717"
  },
  inactiveCircle: {
    borderWidth: 1,
    borderColor: "#D8D1C7",
    backgroundColor: colors.background
  },
  number: {
    fontSize: 13,
    fontWeight: "700"
  },
  activeNumber: {
    color: colors.surface
  },
  inactiveNumber: {
    color: colors.muted
  },
  label: {
    marginTop: 7,
    fontSize: 11.5,
    fontWeight: "500",
    lineHeight: 14
  },
  activeLabel: {
    color: colors.text
  },
  inactiveLabel: {
    color: colors.muted
  },
  line: {
    flex: 1,
    height: 1,
    marginTop: 17,
    marginHorizontal: 8,
    backgroundColor: "#D8D1C7"
  },
  activeLine: {
    backgroundColor: "#171717"
  }
});
