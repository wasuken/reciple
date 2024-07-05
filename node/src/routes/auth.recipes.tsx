import { useState } from 'react'
import {
  createFileRoute,
  Outlet,
  Link,
  ErrorComponent,
  ErrorComponentProps,
} from "@tanstack/react-router";
import { GoogleLogin } from "@react-oauth/google";
import NoRecipeWebp from "@/assets/recipe_no_image.webp";
import styles from "./auth.recipes.module.css";

import Pagination from '@/components/Pagination';
import { RecipeIncludeTagsAndImages } from '@/types'

const fetchRecipeList = async (page = 1, pageSize = 10) => {
  const res = await fetch(`/api/auth/recipes?page=${page}&pageSize=${pageSize}`);
  if (res.ok) {
    const data = await res.json();
    return data;
  }
};

export function fetchErrorComponent({ error }: ErrorComponentProps) {
  return <ErrorComponent error={error} />;
}

export const Route = createFileRoute("/auth/recipes")({
  component: Recipes,
  errorComponent: fetchErrorComponent,
  notFoundComponent: () => {
    return <p>Post not found</p>;
  },
  loader: () => fetchRecipeList(),
});

function Recipes() {
  const initData = Route.useLoaderData();
  const [totalPages, setTotalPages] = useState<number>(initData.totalPages);
  const [currentPage, setCurrentPage] = useState(1);
  const [recipes, setRecipes] = useState<RecipeIncludeTagsAndImages[]>(initData.recipeList);
  const pageSize = 10;

  const onPageChange = async (page: number) => {
    const data = await fetchRecipeList(page, pageSize);
    setCurrentPage(page);
    setRecipes(data.recipeList);
    setTotalPages(data.totalPages);
  };
  return (
    <>
      <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={onPageChange} />
      <ul className={styles.recipeList}>
        {recipes.map((recipe) => (
          <li key={recipe.id} className={styles.recipeItem}>
            <h3>
              <Link
                to="/auth/recipe/$recipeId"
                params={{ recipeId: recipe.id }}
              >
                {recipe.title}
              </Link>
            </h3>
            <Link to="/auth/recipe/$recipeId" params={{ recipeId: recipe.id }}>
              <img
                src={
                  recipe.images && recipe.images.length > 0
                    ? recipe.images[0]
                    : NoRecipeWebp
                }
                alt={recipe.title}
                className={styles.recipeImage}
              />
            </Link>

            <p>{recipe.recipe_text}</p>
            <p>
              <strong>作成者ID:</strong> {recipe.user_id}
            </p>
            <p>
              <strong>ユニークID:</strong> {recipe.unique_string_id}
            </p>
            {recipe.created_at && (
              <p>
                <strong>作成日:</strong> {recipe.created_at}
              </p>
            )}
          </li>
        ))}
      </ul>
      <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={onPageChange} />
      <div className="col-span-3 py-2 px-4">
        <Outlet />
      </div>
    </>
  );
}
