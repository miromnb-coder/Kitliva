import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";

import { colors } from "@/constants/colors";

export function SearchInputBar() {
  return (
    <View style={styles.searchBar}>
      <Ionicons name="search-outline" size={17} color="#6E8080" style={styles.icon} />
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
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 13,
    marginBottom: 14
  },
  icon: {
    marginRight: 8
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    color: colors.text,
    fontSize: 13,
    fontWeight: "500"
  }
});
