export type SellPhoto = {
  id: string;
  uri: string;
  fileName?: string | null;
  mimeType?: string | null;
};

export type SellFormDraft = {
  title: string;
  categoryName: string;
  conditionLabel: string;
  brand: string;
  model: string;
  priceLabel: string;
  description: string;
  locationCity: string;
  locationCountry: string;
  allowPickup: boolean;
  allowShipping: boolean;
};

export const emptySellFormDraft: SellFormDraft = {
  title: "",
  categoryName: "",
  conditionLabel: "Good",
  brand: "",
  model: "",
  priceLabel: "",
  description: "",
  locationCity: "",
  locationCountry: "",
  allowPickup: true,
  allowShipping: false
};
