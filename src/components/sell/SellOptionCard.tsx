import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

type SellOptionCardProps = {
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  selected?: boolean;
  showChevron?: boolean;
};

export function SellOptionCard({ title, subtitle, icon, selected = false, showChevron = false }: SellOptionCardProps) {
  return (
    <View style={[styles.card, selected && styles.selectedCard]}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      {showChevron ? <Ionicons name="chevron-down" size={16} color={colors.muted} /> : null}
      {selected && !showChevron ? <Ionicons name="checkmark-circle" size={18} color={colors.primary} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  selectedCard: {
    borderColor: "#BFE9DC",
    backgroundColor: colors.surface
  },
  iconCircle: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: colors.mint,
    marginRight: 10
  },
  content: {
    flex: 1
  },
  title: {
    color: colors.text,
    fontSize: 13.5,
    fontWeight: "800"
  },
  subtitle: {
    marginTop: 2,
    color: colors.muted,
    fontSize: 11.5,
    fontWeight: "500"
  }
});
