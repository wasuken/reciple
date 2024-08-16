import { useState } from "react";
import {
  createFileRoute,
  Outlet,
  ErrorComponent,
  ErrorComponentProps,
} from "@tanstack/react-router";
import styles from "./recipes.module.css";

import RecipeCard from "./-components/RecipeCard";
import SearchBar from "./-components/SearchBar";

import Pagination from "@/components/Pagination";
import { RecipeInclude, SearchParam } from "@/types";

const fetchTagList = async () => {
  const res = await fetch(`/api/auth/tags`);
  if (res.ok) {
    const data = await res.json();
    return data.map((t) => t.name);
  }
};

const fetchRecipeList = async (param: SearchParam) => {
  const { page, pageSize, query, tag, rating } = param;
  console.log(param);
  const res = await fetch(
    `/api/auth/recipes?page=${page}&pageSize=${pageSize}&query=${query}&tag=${tag}&rating=${rating}`
  );
  if (res.ok) {
    const data = await res.json();
    return data;
  } else {
    return false;
  }
};

function fetchErrorComponent({ error }: ErrorComponentProps) {
  return <ErrorComponent error={error} />;
}

export const Route = createFileRoute("/auth/recipes")({
  component: Recipes,
  errorComponent: fetchErrorComponent,
  validateSearch: (search: Record<string, unknown>): SearchParam => {
    // validate and parse the search params into a typed state
    return {
      page: search?.page ?? 1,
      pageSize: search?.pageSize ?? DEFAULT_PAGE_SIZE,
      query: search?.query ?? "",
      tag: search?.tag ?? "",
      rating: search?.rating ?? 1,
    };
  },
  notFoundComponent: () => {
    return <p>Post not found</p>;
  },
  loaderDeps: ({ search }) => {
    return search;
  },
  loader: async ({ deps }) => {
    return {
      recipeList: await fetchRecipeList(deps),
      tagList: await fetchTagList(),
    };
  },
});

const DEFAULT_PAGE_SIZE = 10;

function Recipes() {
  const loadData = Route.useLoaderData();
  const initData = loadData.recipeList;
  const tagList = loadData.tagList;
  const initSearchParam = Route.useSearch();
  // console.log(initSearchParam);
  const [searchParam, setSearchParam] = useState<SearchParam>(initSearchParam);
  const [totalPages, setTotalPages] = useState<number>(initData.totalPages);
  const [recipes, setRecipes] = useState<RecipeInclude[]>(initData.recipeList);

  const handleSubmit = async (q: string, t: string, r: number) => {
    const nparam = { ...searchParam, query: q, tag: t, rating: r };
    const res = await fetchRecipeList(nparam);
    if (res) {
      setRecipes(res.recipeList);
      setTotalPages(res.totalPages);
      setSearchParam(nparam);
    }
  };

  const onPageChange = async (page: number) => {
    const nparam = { ...searchParam, page };
    const data = await fetchRecipeList(nparam);
    setSearchParam(nparam);
    setRecipes(data.recipeList);
    setTotalPages(data.totalPages);
  };
  return (
    <>
      <Pagination
        totalPages={totalPages}
        currentPage={searchParam.page}
        onPageChange={onPageChange}
      />
      <SearchBar
        initParam={searchParam}
        onSubmit={handleSubmit}
        tags={tagList ?? []}
      />
      {recipes.length > 0 ? (
        <ul className={styles.recipeList}>
          {recipes.map((recipe) => (
            <li key={recipe.id} className={styles.recipeItem}>
              <RecipeCard
                recipe={recipe}
                isLink={true}
                link={{
                  to: "/auth/recipe/show/$recipeId",
                  params: { recipeId: recipe.id },
                }}
              />
            </li>
          ))}
        </ul>
      ) : (
        <>No Recipe_Images</>
      )}
      <Pagination
        totalPages={totalPages}
        currentPage={searchParam.page}
        onPageChange={onPageChange}
      />
      <div className="col-span-3 py-2 px-4">
        <Outlet />
      </div>
    </>
  );
}
