import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

export function AiTitleSuggestion() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>AI title suggestion</Text>
      <View style={styles.suggestionBox}>
        <Text style={styles.suggestionText}>MSR Hubba NX 2-Person Tent</Text>
        <Ionicons name="checkmark" size={18} color={colors.primary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18
  },
  label: {
    marginBottom: 8,
    color: colors.primary,
    fontSize: 13,
    fontWeight: "800"
  },
  suggestionBox: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#BFE9DC",
    backgroundColor: colors.mint,
    paddingHorizontal: 12
  },
  suggestionText: {
    flex: 1,
    color: colors.text,
    fontSize: 13,
    fontWeight: "700"
  }
});
