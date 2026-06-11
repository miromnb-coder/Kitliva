import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { mockInbox } from "@/data/mockInbox";

export function ContactAvatarRow() {
  return (
    <View style={styles.row}>
      {mockInbox.contacts.map((contact) => (
        <View key={contact.id} style={styles.item}>
          <View style={styles.avatarWrap}>
            {contact.type === "group" ? (
              <View style={styles.groupAvatar}>
                <Ionicons name="people-outline" size={25} color={colors.surface} />
              </View>
            ) : (
              <Image source={{ uri: contact.avatarUrl }} style={styles.avatar} contentFit="cover" transition={180} />
            )}

            {contact.unread ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{contact.unread}</Text>
              </View>
            ) : null}
          </View>

          <Text style={styles.label}>{contact.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 27
  },
  item: {
    width: 58,
    alignItems: "center"
  },
  avatarWrap: {
    width: 52,
    height: 52,
    marginBottom: 7
  },
  groupAvatar: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 26,
    backgroundColor: colors.primary
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#E8EDEC"
  },
  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "500"
  },
  badge: {
    position: "absolute",
    top: -4,
    right: 5,
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.background,
    backgroundColor: colors.primary
  },
  badgeText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: "800"
  }
});
