import { supabase } from "@/lib/supabase";
import { Category } from "@/types/category";

export async function getCategoryByName(name: string): Promise<Category | null> {
  const normalizedName = name.trim();

  if (!normalizedName) {
    return null;
  }

  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .eq("name", normalizedName)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as Category;
}
