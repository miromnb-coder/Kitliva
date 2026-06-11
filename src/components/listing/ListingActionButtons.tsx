import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

type ListingActionButtonsProps = {
  onMessage?: () => void;
  onOffer?: () => void;
};

export function ListingActionButtons({ onMessage, onOffer }: ListingActionButtonsProps) {
  return (
    <View style={styles.container}>
      <Text onPress={onMessage} style={styles.primaryButton}>
        Message seller
      </Text>
      <Text onPress={onOffer} style={styles.secondaryButton}>
        Make an offer
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 18
  },
  primaryButton: {
    height: 48,
    overflow: "hidden",
    borderRadius: 12,
    backgroundColor: colors.primary,
    color: colors.surface,
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 48,
    textAlign: "center"
  },
  secondaryButton: {
    height: 46,
    marginTop: 10,
    overflow: "hidden",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.primary,
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 46,
    textAlign: "center"
  }
});
