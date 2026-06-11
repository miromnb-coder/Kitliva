import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

export function ProfileHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.settingsButton}>
        <Ionicons name="settings-outline" size={24} color={colors.text} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12
  },
  title: {
    color: colors.text,
    fontSize: 27,
    fontWeight: "800",
    letterSpacing: -0.35,
    lineHeight: 32
  },
  settingsButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 19
  }
});
