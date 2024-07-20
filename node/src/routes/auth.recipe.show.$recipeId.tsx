import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import RecipeCard from "@/components/RecipeCard";
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
      <RecipeCard recipe={recipe} />
      <div className="col-span-3 py-2 px-4">
        <Outlet />
      </div>
    </div>
  );
}
