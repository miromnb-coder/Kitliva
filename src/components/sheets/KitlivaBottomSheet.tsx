import { Ionicons } from "@expo/vector-icons";
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { ReactNode, useCallback, useEffect, useMemo, useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "@/constants/colors";

type KitlivaBottomSheetProps = {
  visible: boolean;
  title: string;
  subtitle?: string;
  children: ReactNode;
  snapPoints?: string[];
  showHandle?: boolean;
  showCloseButton?: boolean;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimaryPress?: () => void;
  onSecondaryPress?: () => void;
  onClose: () => void;
  isPrimaryDisabled?: boolean;
  isLoading?: boolean;
};

export function KitlivaBottomSheet({
  visible,
  title,
  subtitle,
  children,
  snapPoints = ["62%"],
  showHandle = true,
  showCloseButton = true,
  primaryLabel,
  secondaryLabel,
  onPrimaryPress,
  onSecondaryPress,
  onClose,
  isPrimaryDisabled = false,
  isLoading = false
}: KitlivaBottomSheetProps) {
  const sheetRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();
  const memoizedSnapPoints = useMemo(() => snapPoints, [snapPoints]);

  useEffect(() => {
    if (visible) sheetRef.current?.present();
    else sheetRef.current?.dismiss();
  }, [visible]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.24} pressBehavior="close" />
    ),
    []
  );

  const hasFooter = Boolean(primaryLabel || secondaryLabel);

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={0}
      snapPoints={memoizedSnapPoints}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      backgroundStyle={styles.sheetBackground}
      handleComponent={showHandle ? undefined : null}
      handleIndicatorStyle={styles.handle}
      onDismiss={onClose}
    >
      <BottomSheetScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerTextWrap}>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
          {showCloseButton ? (
            <Pressable style={styles.closeButton} onPress={() => sheetRef.current?.dismiss()}>
              <Ionicons name="close" size={20} color={colors.text} />
            </Pressable>
          ) : null}
        </View>
        {children}
      </BottomSheetScrollView>

      {hasFooter ? (
        <View style={[styles.footer, { paddingBottom: insets.bottom + 8 }]}>
          {secondaryLabel && onSecondaryPress ? (
            <Pressable style={styles.secondaryButton} onPress={onSecondaryPress}>
              <Text style={styles.secondaryText}>{secondaryLabel}</Text>
            </Pressable>
          ) : null}
          {primaryLabel && onPrimaryPress ? (
            <Pressable style={[styles.primaryButton, !secondaryLabel && styles.fullButton, isPrimaryDisabled && styles.disabledButton]} onPress={onPrimaryPress} disabled={isPrimaryDisabled || isLoading}>
              <Text style={styles.primaryText}>{isLoading ? "Loading..." : primaryLabel}</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28
  },
  handle: {
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.sheetHandle
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 18
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16
  },
  headerTextWrap: {
    flex: 1,
    paddingRight: 14
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "600",
    letterSpacing: -0.5,
    lineHeight: 32
  },
  subtitle: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 13.5,
    fontWeight: "400",
    lineHeight: 19
  },
  closeButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 21,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  footer: {
    flexDirection: "row",
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 14
  },
  secondaryButton: {
    height: 50,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  secondaryText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700"
  },
  primaryButton: {
    height: 50,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: colors.buttonPrimary
  },
  fullButton: {
    flex: 0,
    width: "100%"
  },
  disabledButton: {
    opacity: 0.55
  },
  primaryText: {
    color: colors.buttonPrimaryText,
    fontSize: 14,
    fontWeight: "700"
  }
});
