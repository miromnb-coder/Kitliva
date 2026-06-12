import { Ionicons } from "@expo/vector-icons";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

const serifFont = Platform.select({ ios: "Georgia", android: "serif", default: undefined });

type ProfileHeaderProps = {
  onSettingsPress?: () => void;
};

export function ProfileHeader({ onSettingsPress }: ProfileHeaderProps) {
  return (
    <View>
      <View style={styles.headerRow}>
        <Text style={styles.logo}>Kitliva</Text>
        <Pressable style={styles.settingsButton} onPress={onSettingsPress}>
          <Ionicons name="settings-outline" size={23} color={colors.text} />
        </Pressable>
      </View>
      <Text style={styles.title}>Account</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    height: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  logo: {
    color: colors.text,
    fontFamily: serifFont,
    fontSize: 22,
    fontWeight: "500",
    letterSpacing: -0.2,
    lineHeight: 28
  },
  settingsButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 19
  },
  title: {
    marginTop: 22,
    color: colors.text,
    fontSize: 34,
    fontWeight: "600",
    letterSpacing: -0.8,
    lineHeight: 40
  }
});
