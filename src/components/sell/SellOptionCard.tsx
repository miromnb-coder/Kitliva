import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

type SellOptionCardProps = {
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  selected?: boolean;
  showChevron?: boolean;
  onPress?: () => void;
};

export function SellOptionCard({ title, subtitle, icon, selected = false, showChevron = false, onPress }: SellOptionCardProps) {
  return (
    <Pressable style={[styles.card, selected && styles.selectedCard]} onPress={onPress}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      {showChevron ? <Ionicons name="chevron-down" size={16} color={colors.muted} /> : null}
      {selected && !showChevron ? <Ionicons name="checkmark-circle" size={18} color={colors.primary} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 92,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  selectedCard: {
    borderColor: colors.buttonPrimary,
    backgroundColor: colors.softGreen
  },
  iconCircle: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
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
    marginTop: 3,
    color: colors.mutedStrong,
    fontSize: 11.5,
    fontWeight: "500",
    lineHeight: 15
  }
});
