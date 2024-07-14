import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryClient } from "@tanstack/react-query";
import { GoogleLogin } from "@react-oauth/google";
import NoRecipeWebp from "@/assets/recipe_no_image.webp";
import styles from "./auth.recipe.module.css";

const fetchRecipe = async (id: number) => {
  const res = await fetch(`/api/auth/recipe/${id}`);
  if (res.ok) {
    const data = await res.json();
    return data;
  }
};

export const Route = createFileRoute("/auth/recipe/show/$recipeId")({
  component: Recipe,
  loader: async ({ params: { recipeId } }) => fetchRecipe(recipeId),
});

function Recipe() {
  const recipe = Route.useLoaderData();
  return (
    <div className={styles.container}>
      <div className={styles.recipeItem}>
        <h3>{recipe.title}</h3>
        <img
          src={
            recipe.images && recipe.images.length > 0
              ? recipe.images[0]
              : NoRecipeWebp
          }
          alt={recipe.title}
          className={styles.recipeImage}
        />

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
      </div>
      <div className="col-span-3 py-2 px-4">
        <Outlet />
      </div>
    </div>
  );
}
