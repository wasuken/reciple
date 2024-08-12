import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import RecipeCard from "./-components/RecipeCard";
import styles from "./recipe.module.css";

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
  const router = useRouter();
  const recipe = Route.useLoaderData();
  const handleCommentSubmit = async (comment_text: string, rating: number) => {
    const recipeCommentData = {
      recipe_id: recipe.id,
      rating,
      comment_text,
    };
    const res = await fetch(`/api/auth/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipeCommentData),
    });
    router.invalidate();
    return res.ok;
  };
  return (
    <div className={styles.container}>
      <RecipeCard recipe={recipe} onCommentSubmit={handleCommentSubmit} />
      <div className="col-span-3 py-2 px-4">
        <Outlet />
      </div>
    </div>
  );
}
