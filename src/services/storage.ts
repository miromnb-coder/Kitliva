import { supabase } from "@/lib/supabase";

const LISTING_IMAGES_BUCKET = "listing-images";

type UploadListingImageParams = {
  listingId: string;
  uri?: string | null;
  fileName?: string | null;
  mimeType?: string | null;
  sortOrder: number;
  isCover: boolean;
};

type UploadListingImageResult =
  | {
      success: true;
      storagePath: string;
      publicUrl: string;
    }
  | {
      success: false;
      message: string;
    };

function getFileExtension(params: UploadListingImageParams) {
  const fromName = params.fileName?.split(".").pop();

  if (fromName) {
    return fromName.toLowerCase();
  }

  const fromMime = params.mimeType?.split("/").pop();

  if (fromMime) {
    return fromMime.toLowerCase().replace("jpeg", "jpg");
  }

  const fromUri = params.uri?.split("?")[0]?.split(".").pop();

  if (fromUri && fromUri.length <= 5) {
    return fromUri.toLowerCase().replace("jpeg", "jpg");
  }

  return "jpg";
}

function getFriendlyStorageError(message?: string) {
  const normalized = message?.toLowerCase() ?? "";

  if (normalized.includes("bucket") || normalized.includes("storage")) {
    return "We couldn’t upload your photos. Please try again.";
  }

  if (normalized.includes("network") || normalized.includes("fetch")) {
    return "We couldn’t read one of your photos. Please choose it again.";
  }

  return "We couldn’t upload your photos. Please try again.";
}

export async function uploadListingImage(params: UploadListingImageParams): Promise<UploadListingImageResult> {
  try {
    if (!params.uri) {
      return { success: false, message: "One photo was missing. Please choose it again." };
    }

    const extension = getFileExtension(params);
    const storagePath = `${params.listingId}/${Date.now()}-${params.sortOrder}.${extension}`;
    const response = await fetch(params.uri);
    const arrayBuffer = await response.arrayBuffer();

    const { error: uploadError } = await supabase.storage.from(LISTING_IMAGES_BUCKET).upload(storagePath, arrayBuffer, {
      contentType: params.mimeType ?? "image/jpeg",
      upsert: false
    });

    if (uploadError) {
      return { success: false, message: getFriendlyStorageError(uploadError.message) };
    }

    const { data } = supabase.storage.from(LISTING_IMAGES_BUCKET).getPublicUrl(storagePath);
    const publicUrl = data.publicUrl;

    const { error: insertError } = await supabase.from("listing_images").insert({
      listing_id: params.listingId,
      storage_path: storagePath,
      public_url: publicUrl,
      sort_order: params.sortOrder,
      is_cover: params.isCover
    });

    if (insertError) {
      return { success: false, message: getFriendlyStorageError(insertError.message) };
    }

    return {
      success: true,
      storagePath,
      publicUrl
    };
  } catch (error) {
    return { success: false, message: getFriendlyStorageError(error instanceof Error ? error.message : undefined) };
  }
}
