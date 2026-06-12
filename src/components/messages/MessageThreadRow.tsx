import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { ConversationSummary } from "@/services/conversations";

type MessageThreadRowProps = {
  conversation: ConversationSummary;
  isLast: boolean;
  onPress: () => void;
};

function formatMessageTime(value: string | null) {
  if (!value) return "New";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recent";
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
  if (diffDays <= 0) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export function MessageThreadRow({ conversation, isLast, onPress }: MessageThreadRowProps) {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.row}>
        {conversation.listingImageUrl ? (
          <Image source={{ uri: conversation.listingImageUrl }} style={styles.avatarImage} contentFit="cover" />
        ) : (
          <View style={styles.avatar}><Text style={styles.avatarText}>{conversation.otherInitial}</Text></View>
        )}
        <View style={styles.textWrap}>
          <Text style={styles.title} numberOfLines={1}>{conversation.listingTitle}</Text>
          <Text style={styles.preview} numberOfLines={1}>{conversation.lastMessageText}</Text>
        </View>
        <View style={styles.metaWrap}>
          <Text style={styles.time}>{formatMessageTime(conversation.lastMessageAt)}</Text>
        </View>
      </View>
      {!isLast ? <View style={styles.separator} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 72,
    flexDirection: "row",
    alignItems: "center"
  },
  avatar: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    backgroundColor: colors.mint
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F7F2EB"
  },
  avatarText: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: "700"
  },
  textWrap: {
    flex: 1,
    marginLeft: 14
  },
  title: {
    color: colors.text,
    fontSize: 14.5,
    fontWeight: "700",
    lineHeight: 18
  },
  preview: {
    marginTop: 5,
    color: "#5F655F",
    fontSize: 12.5,
    fontWeight: "400",
    lineHeight: 16
  },
  metaWrap: {
    alignItems: "flex-end",
    marginLeft: 10
  },
  time: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "400"
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 64
  }
});
