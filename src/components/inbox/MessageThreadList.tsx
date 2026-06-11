import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { mockInbox } from "@/data/mockInbox";

export function MessageThreadList() {
  return (
    <View>
      {mockInbox.threads.map((thread, index) => (
        <View key={thread.id}>
          <View style={styles.row}>
            <Image source={{ uri: thread.avatarUrl }} style={styles.avatar} contentFit="cover" transition={180} />

            <View style={styles.content}>
              <Text style={styles.name}>{thread.name}</Text>
              <Text style={styles.message} numberOfLines={1}>
                {thread.message}
              </Text>
            </View>

            <View style={styles.meta}>
              <Text style={styles.time}>{thread.time}</Text>
              {thread.unread ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{thread.unread}</Text>
                </View>
              ) : null}
            </View>
          </View>

          {index < mockInbox.threads.length - 1 ? <View style={styles.separator} /> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 76,
    flexDirection: "row",
    alignItems: "center"
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E8EDEC",
    marginRight: 13
  },
  content: {
    flex: 1,
    paddingRight: 8
  },
  name: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 19
  },
  message: {
    marginTop: 5,
    color: "#657575",
    fontSize: 13.5,
    fontWeight: "500",
    lineHeight: 18
  },
  meta: {
    width: 62,
    alignItems: "flex-end"
  },
  time: {
    color: "#657575",
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 8
  },
  badge: {
    width: 25,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12.5,
    backgroundColor: colors.primary
  },
  badgeText: {
    color: colors.surface,
    fontSize: 12.5,
    fontWeight: "800"
  },
  separator: {
    height: 1,
    marginLeft: 61,
    backgroundColor: colors.border
  }
});
