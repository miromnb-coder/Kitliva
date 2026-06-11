import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

type AuthTrustRowProps = {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  isLast?: boolean;
};

export function AuthTrustRow({ title, subtitle, icon, isLast = false }: AuthTrustRowProps) {
  return (
    <View>
      <View style={styles.row}>
        <View style={styles.iconCircle}>
          <Ionicons name={icon} size={22} color={colors.primary} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>
      {!isLast ? <View style={styles.separator} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center"
  },
  iconCircle: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 21,
    backgroundColor: colors.mint,
    marginRight: 12
  },
  content: {
    flex: 1
  },
  title: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800"
  },
  subtitle: {
    marginTop: 2,
    color: colors.muted,
    fontSize: 12.5,
    fontWeight: "500"
  },
  separator: {
    height: 1,
    marginLeft: 54,
    backgroundColor: colors.border
  }
});
