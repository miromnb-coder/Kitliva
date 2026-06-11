import { ScrollView, StyleSheet, View } from "react-native";

import { AiConditionCheck } from "@/components/sell/AiConditionCheck";
import { AiPriceRecommendation } from "@/components/sell/AiPriceRecommendation";
import { AiTitleSuggestion } from "@/components/sell/AiTitleSuggestion";
import { AmountField } from "@/components/sell/AmountField";
import { ConditionSelector } from "@/components/sell/ConditionSelector";
import { PhotoUploadPreview } from "@/components/sell/PhotoUploadPreview";
import { SellContinueButton } from "@/components/sell/SellContinueButton";
import { SellHeader } from "@/components/sell/SellHeader";
import { SellStepIndicator } from "@/components/sell/SellStepIndicator";
import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";

export default function SellScreen() {
  return (
    <Screen noPadding>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SellHeader />
        <SellStepIndicator />
        <PhotoUploadPreview />
        <AiTitleSuggestion />
        <AiConditionCheck />
        <ConditionSelector />
        <AiPriceRecommendation />
        <AmountField />
        <SellContinueButton />
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 24
  },
  bottomSpacer: {
    height: 28
  }
});
