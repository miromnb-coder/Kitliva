import { PhotoUploadPreview } from "@/components/sell/PhotoUploadPreview";
import { SellPhoto } from "@/types/sell";

type PhotosStepProps = {
  photos: SellPhoto[];
  error?: string | null;
  onAddPhotos: (photos: SellPhoto[]) => void;
  onRemovePhoto: (photoId: string) => void;
};

export function PhotosStep({ photos, error, onAddPhotos, onRemovePhoto }: PhotosStepProps) {
  return <PhotoUploadPreview photos={photos} error={error} onAddPhotos={onAddPhotos} onRemovePhoto={onRemovePhoto} />;
}
