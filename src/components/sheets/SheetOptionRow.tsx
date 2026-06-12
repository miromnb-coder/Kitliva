import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

type SheetOptionRowProps = {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  selected?: boolean;
  onPress: () => void;
};

export function SheetOptionRow({ icon, title, subtitle, selected = false, onPress }: SheetOptionRowProps) {
  return (
    <Pressable style={[styles.row, selected && styles.selectedRow]} onPress={onPress}>
      {icon ? <View style={styles.iconWrap}><Ionicons name={icon} size={20} color={selected ? colors.accent : colors.text} /></View> : null}
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {selected ? <Ionicons name="checkmark-circle" size={20} color={colors.accent} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 9
  },
  selectedRow: {
    borderColor: colors.accent,
    backgroundColor: colors.softGold
  },
  iconWrap: {
    width: 30,
    alignItems: "flex-start",
    marginRight: 8
  },
  textWrap: {
    flex: 1
  },
  title: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 18
  },
  subtitle: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16
  }
});
