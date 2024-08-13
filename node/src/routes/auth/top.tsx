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
import SimpleTop from './-components/SimpleTop'

const fetchTagList = async () => {
  const res = await fetch(`/api/auth/tags`);
  if (res.ok) {
    const data = await res.json();
    return data.map((t) => t.name);
  }
};

const fetchRecipeList = async (param: SearchParam) => {
  const { page, pageSize, query, tag, rating } = param;
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

export const Route = createFileRoute("/auth/top")({
  component: Top,
  loader: async () => {
    return {
      recipeList: await fetchRecipeList({
        page: 1,
        pageSize: DEFAULT_PAGE_SIZE,
        query: "",
        tag: "",
        rating: 0,
      }),
      tagList: await fetchTagList(),
    };
  },
});

const DEFAULT_PAGE_SIZE = 5;

function Top() {
  const loadData = Route.useLoaderData();
  const initData = loadData.recipeList;
  const tagList = loadData.tagList;
  const [searchParam, setSearchParam] = useState<SearchParam>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    query: "",
    tag: "",
    rating: 0,
  });
  return (
    <SimpleTop
      tags={tagList}
      recipes={initData.recipeList}
      siteDescription={"madaaaaa desc"}
      onTagClick={() => console.log('mada')}
    />
  );
}
