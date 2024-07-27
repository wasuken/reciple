export interface Recipe {
  id: number;
  user_name: number;
  unique_string_id: string;
  title: string;
  recipe_text: string;
  created_at: string;
}

export interface RecipeIncludeTagsAndImages extends Recipe {
  tags: string[];
  images: string[];
}

export interface RecipeFormData {
  title: string;
  recipe_text: string;
  images: File[];
  tags: string[];
}

export interface SearchParams {
  query: string;
  tag: string;
  page: number;
  pageSize: number;
}
