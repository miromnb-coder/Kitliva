import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

import { DetailsStep } from "@/components/sell/DetailsStep";
import { PhotosStep } from "@/components/sell/PhotosStep";
import { PublishSuccessStep } from "@/components/sell/PublishSuccessStep";
import { ReviewStep } from "@/components/sell/ReviewStep";
import { SellFlowActions } from "@/components/sell/SellFlowActions";
import { SellHeader } from "@/components/sell/SellHeader";
import { SellStep, SellStepIndicator } from "@/components/sell/SellStepIndicator";
import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";

type SellFlowStep = SellStep | "success";

export default function SellScreen() {
  const [currentStep, setCurrentStep] = useState<SellFlowStep>("photos");

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

  function publishListing() {
    setCurrentStep("success");
  }

  function createAnotherListing() {
    setCurrentStep("photos");
  }

  function renderStepContent() {
    if (currentStep === "success") {
      return <PublishSuccessStep onCreateAnother={createAnotherListing} />;
    }

    if (currentStep === "details") {
      return <DetailsStep />;
    }

    if (currentStep === "review") {
      return <ReviewStep />;
    }

    return <PhotosStep />;
  }

  function renderActions() {
    if (currentStep === "success") {
      return null;
    }

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
        onPrimaryPress={publishListing}
      />
    );
  }

  const isSuccess = currentStep === "success";

  return (
    <Screen noPadding>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SellHeader showSaveDraft={!isSuccess} />
        {!isSuccess ? <SellStepIndicator currentStep={currentStep} /> : null}
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
