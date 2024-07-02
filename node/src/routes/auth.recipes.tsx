import {
	createFileRoute,
	Outlet,
	Link,
	ErrorComponent,
	ErrorComponentProps,
} from "@tanstack/react-router";
import { useSuspenseQuery, queryClient } from "@tanstack/react-query";
import { GoogleLogin } from "@react-oauth/google";

const fetchRecipeList = async () => {
	const res = await fetch(`/api/auth/recipes`);
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
	loader: fetchRecipeList,
});

function Recipes() {
	const recipes = Route.useLoaderData();
	return (
		<>
			<ul>
				{recipes.map((recipe, i) => (
					<li key={i}>
						<Link to="/auth/recipes/$recipeId" params={{ recipeId: recipe.id }}>
							{recipe.title}
						</Link>
					</li>
				))}
			</ul>
			<div className="col-span-3 py-2 px-4">
				<Outlet />
			</div>
		</>
	);
}
