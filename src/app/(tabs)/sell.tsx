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
import { useAuth } from "@/hooks/useAuth";
import { createListingWithImages } from "@/services/listings";
import { PublishedListing } from "@/types/listing";
import { emptySellFormDraft, SellFormDraft, SellPhoto } from "@/types/sell";

type SellFlowStep = SellStep | "success";

export default function SellScreen() {
  const router = useRouter();
  const { isLoading, user } = useAuth();
  const [currentStep, setCurrentStep] = useState<SellFlowStep>("photos");
  const [form, setForm] = useState<SellFormDraft>(emptySellFormDraft);
  const [selectedPhotos, setSelectedPhotos] = useState<SellPhoto[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishedListing, setPublishedListing] = useState<PublishedListing | null>(null);

  useFocusEffect(useCallback(() => { if (!isLoading && !user) router.push("/auth/welcome"); }, [isLoading, router, user]));

  function updateForm<Key extends keyof SellFormDraft>(key: Key, value: SellFormDraft[Key]) {
    setPublishError(null);
    setPhotoError(null);
    setForm((currentForm) => ({ ...currentForm, [key]: value }));
  }

  function getPhotosError() {
    if (selectedPhotos.length === 0) return "Add at least one photo.";
    if (!form.title.trim()) return "Add a title.";
    if (!form.conditionLabel.trim()) return "Choose a condition.";
    if (!form.priceLabel.trim()) return "Set a valid price.";
    return null;
  }

  function getDetailsError() {
    if (!form.title.trim()) return "Please add a title before continuing.";
    if (!form.categoryName.trim()) return "Please choose a category before continuing.";
    if (!form.conditionLabel.trim()) return "Please choose the item condition before continuing.";
    if (!form.priceLabel.trim()) return "Please add a price before continuing.";
    if (!form.description.trim()) return "Please add a short description before continuing.";
    if (!form.locationCity.trim()) return "Please add a city before continuing.";
    if (!form.locationCountry.trim()) return "Please add a country before continuing.";
    if (!form.allowPickup && !form.allowShipping) return "Please choose at least one delivery option.";
    return null;
  }

  function goToNextStep() {
    setPublishError(null);
    if (currentStep === "photos") {
      const error = getPhotosError();
      if (error) { setPhotoError(error); return; }
      setCurrentStep("details");
      return;
    }
    if (currentStep === "details") {
      const detailsError = getDetailsError();
      if (detailsError) { setPublishError(detailsError); return; }
      setCurrentStep("review");
    }
  }

  function goToPreviousStep() {
    setPublishError(null);
    if (currentStep === "review") { setCurrentStep("details"); return; }
    if (currentStep === "details") setCurrentStep("photos");
  }

  async function publishListing() {
    if (isPublishing) return;
    if (!user) { router.push("/auth/welcome"); return; }
    const detailsError = getDetailsError();
    if (detailsError) { setPublishError(detailsError); setCurrentStep("details"); return; }
    setIsPublishing(true);
    setPublishError(null);
    const result = await createListingWithImages({ sellerId: user.id, title: form.title, description: form.description, categoryName: form.categoryName, conditionLabel: form.conditionLabel, priceLabel: form.priceLabel, locationCity: form.locationCity, locationCountry: form.locationCountry }, selectedPhotos);
    setIsPublishing(false);
    if (!result.success) { setPublishError(result.message); return; }
    setPublishedListing(result.listing);
    setCurrentStep("success");
  }

  function createAnotherListing() {
    setForm(emptySellFormDraft);
    setPhotoError(null);
    setSelectedPhotos([]);
    setPublishError(null);
    setPublishedListing(null);
    setCurrentStep("photos");
  }

  function renderStepContent() {
    if (currentStep === "success") return <PublishSuccessStep listing={publishedListing} onCreateAnother={createAnotherListing} onViewListing={() => publishedListing && router.push(`/listing/${publishedListing.id}`)} />;
    if (currentStep === "details") return <DetailsStep form={form} onChange={updateForm} />;
    if (currentStep === "review") return <ReviewStep form={form} photos={selectedPhotos} publishError={publishError} />;
    return <PhotosStep photos={selectedPhotos} form={form} error={photoError} onChange={updateForm} onAddPhotos={(photos) => { setPhotoError(null); setSelectedPhotos((current) => [...current, ...photos].slice(0, 6)); }} onRemovePhoto={(photoId) => setSelectedPhotos((current) => current.filter((photo) => photo.id !== photoId))} />;
  }

  function renderActions() {
    if (currentStep === "success") return null;
    if (currentStep === "photos") return <SellFlowActions primaryLabel="Continue" onPrimaryPress={goToNextStep} />;
    if (currentStep === "details") return <SellFlowActions secondaryLabel="Back" onSecondaryPress={goToPreviousStep} primaryLabel="Continue to review" onPrimaryPress={goToNextStep} />;
    return <SellFlowActions secondaryLabel="Back" onSecondaryPress={goToPreviousStep} primaryLabel={isPublishing ? "Publishing..." : "Publish listing"} onPrimaryPress={publishListing} isPrimaryLoading={isPublishing} isSecondaryDisabled={isPublishing} />;
  }

  if (isLoading || !user) return <Screen noPadding><View style={styles.screen} /></Screen>;
  const isSuccess = currentStep === "success";

  return (
    <Screen noPadding>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SellHeader showSaveDraft={!isSuccess} />
        {!isSuccess ? <SellStepIndicator currentStep={currentStep} /> : null}
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
