import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

type ExploreResultsHeaderProps = {
  count: number;
  onSortPress: () => void;
};

export function ExploreResultsHeader({ count, onSortPress }: ExploreResultsHeaderProps) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Browse all gear</Text>
        <Text style={styles.count}>{count} results</Text>
      </View>

      <Pressable style={styles.sortButton} onPress={onSortPress}>
        <Ionicons name="swap-vertical-outline" size={13} color="#A77C3A" style={styles.sortIcon} />
        <Text style={styles.sortText}>Sort: Recommended</Text>
        <Ionicons name="chevron-down" size={12} color={colors.muted} style={styles.chevron} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 12
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 19
  },
  count: {
    marginTop: 2,
    color: colors.muted,
    fontSize: 11,
    fontWeight: "400",
    lineHeight: 14
  },
  sortButton: {
    height: 34,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 12
  },
  sortIcon: {
    marginRight: 5
  },
  sortText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "500"
  },
  chevron: {
    marginLeft: 5
  }
});
