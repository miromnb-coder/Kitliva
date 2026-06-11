import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

import { DetailsStep } from "@/components/sell/DetailsStep";
import { PhotosStep } from "@/components/sell/PhotosStep";
import { ReviewStep } from "@/components/sell/ReviewStep";
import { SellFlowActions } from "@/components/sell/SellFlowActions";
import { SellHeader } from "@/components/sell/SellHeader";
import { SellStep, SellStepIndicator } from "@/components/sell/SellStepIndicator";
import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";

export default function SellScreen() {
  const [currentStep, setCurrentStep] = useState<SellStep>("photos");

  function goToNextStep() {
    if (currentStep === "photos") {
      setCurrentStep("details");
      return;
    }

    if (currentStep === "details") {
      setCurrentStep("review");
    }
  }

  function goToPreviousStep() {
    if (currentStep === "review") {
      setCurrentStep("details");
      return;
    }

    if (currentStep === "details") {
      setCurrentStep("photos");
    }
  }

  function renderStepContent() {
    if (currentStep === "details") {
      return <DetailsStep />;
    }

    if (currentStep === "review") {
      return <ReviewStep />;
    }

    return <PhotosStep />;
  }

  function renderActions() {
    if (currentStep === "photos") {
      return <SellFlowActions primaryLabel="Continue to details" onPrimaryPress={goToNextStep} />;
    }

    if (currentStep === "details") {
      return (
        <SellFlowActions
          secondaryLabel="Back"
          onSecondaryPress={goToPreviousStep}
          primaryLabel="Continue to review"
          onPrimaryPress={goToNextStep}
        />
      );
    }

    return (
      <SellFlowActions
        secondaryLabel="Back"
        onSecondaryPress={goToPreviousStep}
        primaryLabel="Publish listing"
        onPrimaryPress={() => undefined}
      />
    );
  }

  return (
    <Screen noPadding>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SellHeader />
        <SellStepIndicator currentStep={currentStep} />
        {renderStepContent()}
        {renderActions()}
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
    paddingTop: 6,
    paddingBottom: 118
  }
});
