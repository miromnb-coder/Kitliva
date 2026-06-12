import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

type SheetActionCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  selected?: boolean;
  onPress: () => void;
};

export function SheetActionCard({ icon, title, subtitle, selected = false, onPress }: SheetActionCardProps) {
  return (
    <Pressable style={[styles.card, selected && styles.selectedCard]} onPress={onPress}>
      <View style={[styles.iconCircle, selected && styles.selectedIconCircle]}>
        <Ionicons name={icon} size={22} color={selected ? colors.surface : colors.text} />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {selected ? <Ionicons name="checkmark-circle" size={19} color="#A77C3A" /> : <Ionicons name="chevron-forward" size={17} color={colors.muted} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 74,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 14,
    marginBottom: 10
  },
  selectedCard: {
    borderColor: "#A77C3A",
    backgroundColor: "#F7F2EB"
  },
  iconCircle: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 21,
    backgroundColor: "#F7F2EB",
    marginRight: 12
  },
  selectedIconCircle: {
    backgroundColor: "#171717"
  },
  textWrap: {
    flex: 1
  },
  title: {
    color: colors.text,
    fontSize: 14.5,
    fontWeight: "700"
  },
  subtitle: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 12.5,
    fontWeight: "400",
    lineHeight: 17
  }
});
