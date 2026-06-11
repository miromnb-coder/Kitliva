import { AiConditionCheck } from "@/components/sell/AiConditionCheck";
import { AiTitleSuggestion } from "@/components/sell/AiTitleSuggestion";
import { PhotoUploadPreview } from "@/components/sell/PhotoUploadPreview";

export function PhotosStep() {
  return (
    <>
      <PhotoUploadPreview />
      <AiTitleSuggestion />
      <AiConditionCheck />
    </>
  );
}
