import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

const steps = ["Photos", "Details", "Review"];

export function SellStepIndicator() {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isActive = index === 0;
        return (
          <View key={step} style={styles.stepWrap}>
            <View style={styles.stepContent}>
              <View style={[styles.circle, isActive ? styles.activeCircle : styles.inactiveCircle]}>
                <Text style={[styles.number, isActive ? styles.activeNumber : styles.inactiveNumber]}>{index + 1}</Text>
              </View>
              <Text style={[styles.label, isActive ? styles.activeLabel : styles.inactiveLabel]}>{step}</Text>
            </View>
            {index < steps.length - 1 ? <View style={styles.line} /> : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 24,
    marginTop: 10,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center"
  },
  stepWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  stepContent: {
    flexDirection: "row",
    alignItems: "center"
  },
  circle: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10
  },
  activeCircle: {
    backgroundColor: colors.primary
  },
  inactiveCircle: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  number: {
    fontSize: 10,
    fontWeight: "800"
  },
  activeNumber: {
    color: colors.surface
  },
  inactiveNumber: {
    color: colors.muted
  },
  label: {
    marginLeft: 5,
    fontSize: 11.5,
    fontWeight: "700"
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
    marginHorizontal: 7,
    backgroundColor: colors.border
  }
});
