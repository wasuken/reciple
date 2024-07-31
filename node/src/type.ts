export interface Recipe {
  id: number;
  user_name: number;
  unique_string_id: string;
  title: string;
  recipe_text: string;
  created_at: string;
}

interface Comment {
  comment_id:
  user_name: string;
  comment_text: string;
}

export interface RecipeInclude extends Recipe {
  tags: string[];
  images: string[];
  comment_count: number;
  // 一覧表示では利用しない
  comments?: Comment[];
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
