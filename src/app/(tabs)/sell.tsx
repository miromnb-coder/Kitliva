import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";

import { DetailsStep } from "@/components/sell/DetailsStep";
import { PhotosStep } from "@/components/sell/PhotosStep";
import { PublishSuccessStep } from "@/components/sell/PublishSuccessStep";
import { ReviewStep } from "@/components/sell/ReviewStep";
import { SellFlowActions } from "@/components/sell/SellFlowActions";
import { SellHeader } from "@/components/sell/SellHeader";
import { SellStep, SellStepIndicator } from "@/components/sell/SellStepIndicator";
import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";
import { mockSellListing } from "@/data/mockSellListing";
import { useAuth } from "@/hooks/useAuth";
import { createListingWithoutImages } from "@/services/listings";
import { PublishedListing } from "@/types/listing";

type SellFlowStep = SellStep | "success";

export default function SellScreen() {
  const router = useRouter();
  const { isLoading, profile, user } = useAuth();
  const [currentStep, setCurrentStep] = useState<SellFlowStep>("photos");
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishedListing, setPublishedListing] = useState<PublishedListing | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (!isLoading && !user) {
        router.push("/auth/welcome");
      }
    }, [isLoading, router, user])
  );

  function goToNextStep() {
    setPublishError(null);

    if (currentStep === "photos") {
      setCurrentStep("details");
      return;
    }

    if (currentStep === "details") {
      setCurrentStep("review");
    }
  }

  function goToPreviousStep() {
    setPublishError(null);

    if (currentStep === "review") {
      setCurrentStep("details");
      return;
    }

    if (currentStep === "details") {
      setCurrentStep("photos");
    }
  }

  async function publishListing() {
    if (isPublishing) {
      return;
    }

    if (!user) {
      router.push("/auth/welcome");
      return;
    }

    setIsPublishing(true);
    setPublishError(null);

    const result = await createListingWithoutImages({
      sellerId: user.id,
      title: mockSellListing.title,
      description: mockSellListing.description,
      categoryName: mockSellListing.category,
      conditionLabel: mockSellListing.condition,
      priceLabel: mockSellListing.price,
      locationCity: profile?.location_city ?? mockSellListing.location,
      locationCountry: profile?.location_country ?? "Ireland"
    });

    setIsPublishing(false);

    if (!result.success) {
      setPublishError(result.message);
      return;
    }

    setPublishedListing(result.listing);
    setCurrentStep("success");
  }

  function createAnotherListing() {
    setPublishError(null);
    setPublishedListing(null);
    setCurrentStep("photos");
  }

  function renderStepContent() {
    if (currentStep === "success") {
      return <PublishSuccessStep listing={publishedListing} onCreateAnother={createAnotherListing} />;
    }

    if (currentStep === "details") {
      return <DetailsStep />;
    }

    if (currentStep === "review") {
      return <ReviewStep publishError={publishError} />;
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
        primaryLabel={isPublishing ? "Publishing..." : "Publish listing"}
        onPrimaryPress={publishListing}
        isPrimaryLoading={isPublishing}
        isSecondaryDisabled={isPublishing}
      />
    );
  }

  if (isLoading || !user) {
    return (
      <Screen noPadding>
        <View style={styles.screen} />
      </Screen>
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
