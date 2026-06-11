import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

export function AiTitleSuggestion() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Smart title suggestion</Text>
      <View style={styles.suggestionBox}>
        <Text style={styles.suggestionText}>MSR Hubba NX 2-Person Tent</Text>
        <Ionicons name="checkmark" size={17} color={colors.primary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15
  },
  label: {
    marginBottom: 7,
    color: colors.primary,
    fontSize: 12.5,
    fontWeight: "800"
  },
  suggestionBox: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#BFE9DC",
    backgroundColor: colors.mint,
    paddingHorizontal: 12
  },
  suggestionText: {
    flex: 1,
    color: colors.text,
    fontSize: 12.5,
    fontWeight: "700"
  }
});
