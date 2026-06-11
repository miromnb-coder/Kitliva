import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";

import { colors } from "@/constants/colors";

export function SearchInputBar() {
  return (
    <View style={styles.searchBar}>
      <Ionicons name="search-outline" size={18} color="#6E8080" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="Search gear, brands or hobbies"
        placeholderTextColor={colors.muted}
        editable={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 21,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    marginBottom: 17
  },
  icon: {
    marginRight: 9
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    color: colors.text,
    fontSize: 13.5,
    fontWeight: "500"
  }
});
