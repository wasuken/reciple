import { useState } from "react";
import {
  createFileRoute,
  Outlet,
  Link,
  ErrorComponent,
  ErrorComponentProps,
} from "@tanstack/react-router";
import { Tag, TagLabel, Box } from "@chakra-ui/react";
import { GoogleLogin } from "@react-oauth/google";

import NoRecipeWebp from "@/assets/recipe_no_image.webp";
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
  const { page, pageSize, query, tag } = param;
  const res = await fetch(
    `/api/auth/recipes?page=${page}&pageSize=${pageSize}&query=${query}&tag=${tag}`
  );
  if (res.ok) {
    const data = await res.json();
    return data;
  } else {
    return false;
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
  loader: async () => {
    return {
      recipeList: await fetchRecipeList({
        page: 1,
        pageSize: 10,
        query: "",
        tag: "",
      }),
      tagList: await fetchTagList(),
    };
  },
});

function Recipes() {
  const loadData = Route.useLoaderData();
  const initData = loadData.recipeList;
  const tagList = loadData.tagList;
  const [searchParam, setSearchParam] = useState<SearchParam>({
    page: 1,
    pageSize: 10,
    query: "",
    tag: "",
  });
  const [totalPages, setTotalPages] = useState<number>(initData.totalPages);
  const [recipes, setRecipes] = useState<RecipeInclude[]>(initData.recipeList);
  const pageSize = 10;

  const handleSubmit = async (q: string, t: string) => {
    const nparam = { ...searchParam, query: q, tag: t };
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
