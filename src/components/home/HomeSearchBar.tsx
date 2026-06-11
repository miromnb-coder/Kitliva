import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

export function HomeSearchBar() {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={17} color={colors.muted} />
      <Text style={styles.placeholder}>Search gear, brands or hobbies</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 14
  },
  placeholder: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "500"
  }
});
