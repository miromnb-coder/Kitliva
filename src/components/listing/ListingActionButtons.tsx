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
        <Text style={styles.secondaryText}>Make an offer</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 18
  },
  primaryButton: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 12,
    backgroundColor: colors.primary
  },
  primaryText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: "800"
  },
  secondaryButton: {
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    overflow: "hidden",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  secondaryText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "800"
  }
});
