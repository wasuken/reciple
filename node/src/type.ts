export interface Recipe {
  id: number;
  user_id: number;
  unique_string_id: string;
  title: string;
  recipe_text: string;
  created_at: string;
}

export interface RecipeIncludeTagsAndImages extends Recipe {
  tags: string[];
  images: string[];
}
