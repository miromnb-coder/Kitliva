import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { ProfileSection as ProfileSectionType } from "@/data/mockProfile";

export function ProfileSection({ section }: { section: ProfileSectionType }) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>{section.title}</Text>
      <View style={styles.card}>
        {section.items.map((item, index) => (
          <View key={item.label}>
            <View style={styles.row}>
              <View style={styles.iconWrap}>
                <Ionicons name={item.icon} size={20} color={colors.text} />
              </View>

              <Text style={styles.label}>{item.label}</Text>

              {item.badge ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              ) : null}

              <Ionicons name="chevron-forward" size={18} color="#6F7E7E" />
            </View>

            {index < section.items.length - 1 ? <View style={styles.separator} /> : null}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 16
  },
  title: {
    marginBottom: 9,
    color: colors.text,
    fontSize: 16,
    fontWeight: "800"
  },
  card: {
    overflow: "hidden",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  row: {
    height: 43,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14
  },
  iconWrap: {
    width: 24,
    alignItems: "center",
    marginRight: 12
  },
  label: {
    flex: 1,
    color: colors.text,
    fontSize: 14.5,
    fontWeight: "600"
  },
  badge: {
    minWidth: 25,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12.5,
    backgroundColor: colors.mint,
    marginRight: 9,
    paddingHorizontal: 7
  },
  badgeText: {
    color: colors.primary,
    fontSize: 12.5,
    fontWeight: "800"
  },
  separator: {
    height: 1,
    marginLeft: 46,
    backgroundColor: colors.border
  }
});
