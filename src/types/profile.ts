export type Profile = {
  id: string;
  display_name: string;
  username: string | null;
  avatar_url: string | null;
  location_city: string | null;
  location_country: string | null;
  bio: string | null;
  rating_average: number;
  rating_count: number;
  is_verified: boolean;
  is_trusted_seller: boolean;
  created_at: string;
  updated_at: string;
};
