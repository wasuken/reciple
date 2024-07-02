import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryClient } from "@tanstack/react-query";
import { GoogleLogin } from "@react-oauth/google";

const fetchRecipe = async (id: number) => {
	const res = await fetch(`/api/auth/recipe/${id}`);
	if (res.ok) {
		const data = await res.json();
		console.log(data);
		return data;
	}
};

export const Route = createFileRoute("/auth/recipes/$recipeId")({
	component: Recipe,
	loader: async ({ params: { recipeId } }) => fetchRecipe(recipeId),
});

function Recipe() {
	const recipe = Route.useLoaderData();
	return (
		<>
			<h2>{recipe.title}</h2>
			<div className="col-span-3 py-2 px-4">
				<Outlet />
			</div>
		</>
	);
}
