import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

type SearchResultsHeaderProps = {
  count: number;
  query: string;
  onSortPress: () => void;
};

export function SearchResultsHeader({ count, query, onSortPress }: SearchResultsHeaderProps) {
  const trimmedQuery = query.trim();
  const subtitle = trimmedQuery ? `${count} results for ${trimmedQuery}` : `${count} results`;

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>Recommended gear</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <Pressable style={styles.sortButton} onPress={onSortPress}>
        <Ionicons name="swap-vertical-outline" size={16} color={colors.primary} style={styles.sortIcon} />
        <Text style={styles.sortText}>Sort</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 10 },
  title: { color: colors.text, fontSize: 18, fontWeight: "800", letterSpacing: -0.2, lineHeight: 22 },
  subtitle: { marginTop: 1, color: "#6F8380", fontSize: 12.5, fontWeight: "500" },
  sortButton: { height: 36, flexDirection: "row", alignItems: "center", borderRadius: 18, borderWidth: 1, borderColor: "#D8E2DF", backgroundColor: colors.surface, paddingHorizontal: 13 },
  sortIcon: { marginRight: 6 },
  sortText: { color: colors.text, fontSize: 12.5, fontWeight: "800" }
});
