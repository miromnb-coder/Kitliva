import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { mockInbox } from "@/data/mockInbox";

export function ActiveOrderCard() {
  const order = mockInbox.activeOrder;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Image source={{ uri: order.imageUrl }} style={styles.image} contentFit="cover" transition={180} />

        <View style={styles.content}>
          <Text style={styles.title}>{order.title}</Text>
          <Text style={styles.orderId}>{order.orderId}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{order.status}</Text>
          </View>
        </View>
      </View>

      <View style={styles.deliveryRow}>
        <Text style={styles.deliveryText}>{order.deliveryLabel}</Text>
        <Text style={styles.deliveryText}>{order.deliveryDate}</Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${order.progress * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 14,
    marginBottom: 17
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center"
  },
  image: {
    width: 82,
    height: 82,
    borderRadius: 11,
    backgroundColor: "#EDF2F0",
    marginRight: 14
  },
  content: {
    flex: 1
  },
  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "800",
    lineHeight: 21
  },
  orderId: {
    marginTop: 3,
    color: "#657575",
    fontSize: 13,
    fontWeight: "500"
  },
  statusBadge: {
    alignSelf: "flex-start",
    height: 26,
    justifyContent: "center",
    borderRadius: 13,
    backgroundColor: colors.mint,
    paddingHorizontal: 10,
    marginTop: 8
  },
  statusText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700"
  },
  deliveryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 13
  },
  deliveryText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "500"
  },
  progressTrack: {
    height: 7,
    overflow: "hidden",
    borderRadius: 3.5,
    backgroundColor: colors.border,
    marginTop: 14
  },
  progressFill: {
    height: "100%",
    borderRadius: 3.5,
    backgroundColor: colors.primary
  }
});
