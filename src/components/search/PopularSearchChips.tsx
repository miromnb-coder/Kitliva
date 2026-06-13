import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { useI18n } from "@/i18n";

const popularSearches = [
  { labelKey: "explore.popular.cameraKit", query: "camera", icon: "camera-outline" as const },
  { labelKey: "explore.popular.skis", query: "skis", icon: "snow-outline" as const },
  { labelKey: "explore.popular.tent", query: "tent", icon: "triangle-outline" as const },
  { labelKey: "explore.popular.guitar", query: "guitar", icon: "musical-notes-outline" as const },
  { labelKey: "explore.popular.kidsGear", query: "kids", icon: "happy-outline" as const }
];

type PopularSearchChipsProps = {
  onSelectSearch: (query: string) => void;
};

export function PopularSearchChips({ onSelectSearch }: PopularSearchChipsProps) {
  const { t } = useI18n();

  return (
    <View style={styles.section}>
      <Text style={styles.title}>{t("explore.popular.title")}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>
        {popularSearches.map((search) => (
          <Pressable key={search.labelKey} style={styles.chip} onPress={() => onSelectSearch(search.query)}>
            <Ionicons name={search.icon} size={14} color={colors.text} style={styles.icon} />
            <Text style={styles.label}>{t(search.labelKey)}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 24
  },
  title: {
    marginBottom: 10,
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 18
  },
  content: {
    flexDirection: "row",
    gap: 8,
    paddingRight: 2
  },
  chip: {
    height: 34,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 12
  },
  icon: {
    marginRight: 6
  },
  label: {
    color: colors.text,
    fontSize: 11.5,
    fontWeight: "500"
  }
});
