import { supabase } from "@/lib/supabase";
import { SellPhoto } from "@/types/sell";

const LISTING_IMAGES_BUCKET = "listing-images";

function getFileExtension(photo: SellPhoto) {
  const fromName = photo.fileName?.split(".").pop();

  if (fromName) {
    return fromName.toLowerCase();
  }

  const fromMime = photo.mimeType?.split("/").pop();

  if (fromMime) {
    return fromMime.toLowerCase().replace("jpeg", "jpg");
  }

  return "jpg";
}

export async function uploadListingImage(params: {
  listingId: string;
  sellerId: string;
  photo: SellPhoto;
  index: number;
}) {
  const extension = getFileExtension(params.photo);
  const storagePath = `${params.sellerId}/${params.listingId}/${Date.now()}-${params.index}.${extension}`;
  const response = await fetch(params.photo.uri);
  const arrayBuffer = await response.arrayBuffer();

  const { error } = await supabase.storage.from(LISTING_IMAGES_BUCKET).upload(storagePath, arrayBuffer, {
    contentType: params.photo.mimeType ?? "image/jpeg",
    upsert: false
  });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from(LISTING_IMAGES_BUCKET).getPublicUrl(storagePath);

  return {
    storagePath,
    publicUrl: data.publicUrl
  };
}
