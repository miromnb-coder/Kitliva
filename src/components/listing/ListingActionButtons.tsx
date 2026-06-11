import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

type ListingActionButtonsProps = {
  onMessage?: () => void;
  onOffer?: () => void;
};

export function ListingActionButtons({ onMessage, onOffer }: ListingActionButtonsProps) {
  return (
    <View style={styles.container}>
      <Pressable style={styles.primaryButton} onPress={onMessage}>
        <Text style={styles.primaryText}>Message seller</Text>
      </Pressable>
      <Pressable style={styles.secondaryButton} onPress={onOffer}>
        <Text style={styles.secondaryText}>Make offer</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16
  },
  primaryButton: {
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 12,
    backgroundColor: "#171717"
  },
  primaryText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: "700"
  },
  secondaryButton: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    overflow: "hidden",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.text,
    backgroundColor: colors.surface
  },
  secondaryText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700"
  }
});
