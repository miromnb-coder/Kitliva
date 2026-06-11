import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";

import { colors } from "@/constants/colors";

type ExploreSearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
};

export function ExploreSearchBar({ value, onChangeText }: ExploreSearchBarProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={17} color="#8C908A" style={styles.icon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Search gear, brands or hobbies"
        placeholderTextColor="#8C908A"
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 14
  },
  icon: {
    marginRight: 10
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 12.5,
    fontWeight: "400",
    paddingVertical: 0
  }
});
