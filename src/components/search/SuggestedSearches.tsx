import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

type SuggestedSearch = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const suggestedSearches: SuggestedSearch[] = [
  { label: "Camera kit", icon: "camera-outline" },
  { label: "Skis", icon: "snow-outline" },
  { label: "Tent", icon: "triangle-outline" },
  { label: "Guitar", icon: "musical-notes-outline" },
  { label: "Padel racket", icon: "tennisball-outline" },
  { label: "Kids skates", icon: "snow-outline" }
];

export function SuggestedSearches() {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Suggested searches</Text>
      <View style={styles.chips}>
        {suggestedSearches.map((item) => (
          <View key={item.label} style={styles.chip}>
            <Ionicons name={item.icon} size={15} color={colors.primary} style={styles.chipIcon} />
            <Text style={styles.chipText}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 19
  },
  title: {
    marginBottom: 9,
    color: colors.text,
    fontSize: 14,
    fontWeight: "800"
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  chip: {
    height: 32,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D8E2DF",
    backgroundColor: colors.surface,
    paddingHorizontal: 11
  },
  chipIcon: {
    marginRight: 6
  },
  chipText: {
    color: colors.text,
    fontSize: 12.5,
    fontWeight: "700"
  }
});
