import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";

import { AIListingAssistantCard } from "@/components/sell/AIListingAssistantCard";
import { DeliveryStep } from "@/components/sell/DeliveryStep";
import { DetailsStep } from "@/components/sell/DetailsStep";
import { PhotosStep } from "@/components/sell/PhotosStep";
import { PricingStep } from "@/components/sell/PricingStep";
import { PublishSuccessStep } from "@/components/sell/PublishSuccessStep";
import { ReviewStep } from "@/components/sell/ReviewStep";
import { SellFlowActions } from "@/components/sell/SellFlowActions";
import { SellHeader } from "@/components/sell/SellHeader";
import { SellStep, SellStepIndicator } from "@/components/sell/SellStepIndicator";
import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";
import { createListingWithImages } from "@/services/listings";
import { PublishedListing } from "@/types/listing";
import { emptySellFormDraft, SellFormDraft, SellPhoto } from "@/types/sell";

type SellFlowStep = SellStep | "success";

const orderedSteps: SellStep[] = ["photos", "details", "pricing", "delivery", "review"];

function parsePriceAmount(priceLabel: string) {
  const normalized = priceLabel.replace(/[^0-9.,]/g, "").replace(",", ".");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export default function SellScreen() {
  const router = useRouter();
  const { isLoading, user } = useAuth();
  const [currentStep, setCurrentStep] = useState<SellFlowStep>("photos");
  const [form, setForm] = useState<SellFormDraft>(emptySellFormDraft);
  const [selectedPhotos, setSelectedPhotos] = useState<SellPhoto[]>([]);
  const [flowError, setFlowError] = useState<string | null>(null);
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

  function updateForm<Key extends keyof SellFormDraft>(key: Key, value: SellFormDraft[Key]) {
    setPublishError(null);
    setFlowError(null);
    setForm((currentForm) => ({ ...currentForm, [key]: value }));
  }

  function applyAIChanges(patch: Partial<SellFormDraft>) {
    setPublishError(null);
    setFlowError(null);
    setForm((currentForm) => ({ ...currentForm, ...patch }));
  }

  function getPhotosError() {
    if (selectedPhotos.length === 0) return "Add at least one photo.";
    return null;
  }

  function getDetailsError() {
    if (!form.title.trim()) return "Please add a title before continuing.";
    if (!form.categoryName.trim()) return "Please choose a category before continuing.";
    if (!form.conditionLabel.trim()) return "Please choose the item condition before continuing.";
    if (!form.description.trim()) return "Please add a short description before continuing.";
    return null;
  }

  function getPricingError() {
    if (!form.priceLabel.trim()) return "Please add a price before continuing.";
    if (!parsePriceAmount(form.priceLabel)) return "Please enter a valid price before continuing.";
    return null;
  }

  function getDeliveryError() {
    if (!form.locationCity.trim()) return "Please add a city before continuing.";
    if (!form.locationCountry.trim()) return "Please add a country before continuing.";
    if (!form.allowPickup && !form.allowShipping) return "Please choose at least one delivery option.";
    return null;
  }

  function getCurrentStepError(step: SellStep) {
    if (step === "photos") return getPhotosError();
    if (step === "details") return getDetailsError();
    if (step === "pricing") return getPricingError();
    if (step === "delivery") return getDeliveryError();
    return null;
  }

  function goToNextStep() {
    setPublishError(null);
    if (currentStep === "success" || currentStep === "review") return;
    const error = getCurrentStepError(currentStep);
    if (error) {
      setFlowError(error);
      return;
    }
    const currentIndex = orderedSteps.indexOf(currentStep);
    const nextStep = orderedSteps[currentIndex + 1];
    if (nextStep) {
      setFlowError(null);
      setCurrentStep(nextStep);
    }
  }

  function goToPreviousStep() {
    setPublishError(null);
    setFlowError(null);
    if (currentStep === "success" || currentStep === "photos") return;
    const currentIndex = orderedSteps.indexOf(currentStep);
    const previousStep = orderedSteps[Math.max(0, currentIndex - 1)];
    setCurrentStep(previousStep);
  }

  async function publishListing() {
    if (isPublishing) return;
    if (!user) {
      router.push("/auth/welcome");
      return;
    }

    const validations: { step: SellStep; error: string | null }[] = [
      { step: "photos", error: getPhotosError() },
      { step: "details", error: getDetailsError() },
      { step: "pricing", error: getPricingError() },
      { step: "delivery", error: getDeliveryError() }
    ];
    const failedValidation = validations.find((item) => item.error);
    if (failedValidation) {
      setFlowError(failedValidation.error);
      setPublishError(null);
      setCurrentStep(failedValidation.step);
      return;
    }

    setIsPublishing(true);
    setPublishError(null);
    const result = await createListingWithImages(
      {
        sellerId: user.id,
        title: form.title,
        description: form.description,
        categoryName: form.categoryName,
        conditionLabel: form.conditionLabel,
        priceLabel: form.priceLabel,
        locationCity: form.locationCity,
        locationCountry: form.locationCountry,
        brand: form.brand,
        model: form.model
      },
      selectedPhotos
    );
    setIsPublishing(false);

    if (!result.success) {
      setPublishError(result.message);
      return;
    }

    setPublishedListing(result.listing);
    setCurrentStep("success");
  }

  function createAnotherListing() {
    setForm(emptySellFormDraft);
    setFlowError(null);
    setSelectedPhotos([]);
    setPublishError(null);
    setPublishedListing(null);
    setCurrentStep("photos");
  }

  function viewPublishedListing() {
    if (publishedListing) router.push(`/listing/${publishedListing.id}`);
  }

  function renderStepContent() {
    if (currentStep === "success") {
      return <PublishSuccessStep listing={publishedListing} onCreateAnother={createAnotherListing} onViewListing={viewPublishedListing} />;
    }

    if (currentStep === "details") {
      return (
        <>
          <AIListingAssistantCard mode="details" form={form} onApply={applyAIChanges} />
          <DetailsStep form={form} error={flowError} onChange={updateForm} />
        </>
      );
    }

    if (currentStep === "pricing") {
      return (
        <>
          <AIListingAssistantCard mode="pricing" form={form} onApply={applyAIChanges} />
          <PricingStep form={form} error={flowError} onChange={updateForm} />
        </>
      );
    }

    if (currentStep === "delivery") return <DeliveryStep form={form} error={flowError} onChange={updateForm} />;
    if (currentStep === "review") return <ReviewStep form={form} photos={selectedPhotos} publishError={publishError} />;

    return (
      <PhotosStep
        photos={selectedPhotos}
        error={flowError}
        onAddPhotos={(photos) => {
          setFlowError(null);
          setSelectedPhotos((current) => [...current, ...photos].slice(0, 6));
        }}
        onRemovePhoto={(photoId) => setSelectedPhotos((current) => current.filter((photo) => photo.id !== photoId))}
      />
    );
  }

  function renderActions() {
    if (currentStep === "success") return null;
    if (currentStep === "photos") return <SellFlowActions primaryLabel="Continue" onPrimaryPress={goToNextStep} />;
    if (currentStep === "details" || currentStep === "pricing") return <SellFlowActions secondaryLabel="Back" onSecondaryPress={goToPreviousStep} primaryLabel="Continue" onPrimaryPress={goToNextStep} />;
    if (currentStep === "delivery") return <SellFlowActions secondaryLabel="Back" onSecondaryPress={goToPreviousStep} primaryLabel="Continue to review" onPrimaryPress={goToNextStep} />;
    return <SellFlowActions secondaryLabel="Back" onSecondaryPress={goToPreviousStep} primaryLabel={isPublishing ? "Publishing..." : "Publish listing"} onPrimaryPress={publishListing} isPrimaryLoading={isPublishing} isSecondaryDisabled={isPublishing} />;
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
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SellHeader showSaveDraft={!isSuccess} />
        {currentStep !== "success" ? <SellStepIndicator currentStep={currentStep} /> : null}
        {renderStepContent()}
        {renderActions()}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 112 }
});
