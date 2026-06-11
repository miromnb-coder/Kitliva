import { Ionicons } from "@expo/vector-icons";
import { Platform, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

const serifFont = Platform.select({ ios: "Georgia", android: "serif", default: undefined });

export function SellHeader({ showSaveDraft = true }: { showSaveDraft?: boolean }) {
  return (
    <View>
      <View style={styles.topRow}>
        <Text style={styles.logo}>Kitliva</Text>
        {showSaveDraft ? (
          <View style={styles.roundIcon}>
            <Ionicons name="options-outline" size={20} color="#A77C3A" />
          </View>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
      <Text style={styles.title}>Sell your gear</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: { height: 34, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  logo: { color: colors.text, fontFamily: serifFont, fontSize: 22, fontWeight: "500", letterSpacing: -0.2, lineHeight: 28 },
  roundIcon: { width: 38, height: 38, alignItems: "center", justifyContent: "center", borderRadius: 19, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  title: { marginTop: 22, color: colors.text, fontSize: 30, fontWeight: "600", letterSpacing: -0.5, lineHeight: 36 },
  placeholder: { width: 38, height: 38 }
});
