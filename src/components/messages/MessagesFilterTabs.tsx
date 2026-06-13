import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { useI18n } from "@/i18n";

export type MessageFilter = "all" | "buying" | "selling" | "support";

const filters: { key: MessageFilter; labelKey: string; icon?: keyof typeof Ionicons.glyphMap }[] = [
  { key: "all", labelKey: "messages.all" },
  { key: "buying", labelKey: "messages.buying", icon: "pricetag-outline" },
  { key: "selling", labelKey: "messages.selling", icon: "bag-handle-outline" },
  { key: "support", labelKey: "messages.support", icon: "headset-outline" }
];

type MessagesFilterTabsProps = {
  activeFilter: MessageFilter;
  onChange: (filter: MessageFilter) => void;
};

export function MessagesFilterTabs({ activeFilter, onChange }: MessagesFilterTabsProps) {
  const { t } = useI18n();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {filters.map((filter) => {
        const selected = activeFilter === filter.key;
        return (
          <Pressable key={filter.key} style={[styles.chip, selected && styles.activeChip]} onPress={() => onChange(filter.key)}>
            {filter.icon ? <Ionicons name={filter.icon} size={15} color={colors.mutedStrong} style={styles.icon} /> : null}
            <Text style={styles.label}>{t(filter.labelKey)}</Text>
            {selected ? <View style={styles.activeDot} /> : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 8, paddingRight: 2, marginTop: 24 },
  chip: { height: 36, flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 16 },
  activeChip: { borderColor: "#E7D8C8", backgroundColor: colors.softGold },
  icon: { marginRight: 6 },
  label: { color: colors.text, fontSize: 12, fontWeight: "500" },
  activeDot: { position: "absolute", bottom: 4, width: 5, height: 5, borderRadius: 2.5, backgroundColor: colors.accent }
});
