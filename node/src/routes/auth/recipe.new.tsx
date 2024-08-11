import React from "react";
import { createFileRoute } from "@tanstack/react-router";

import RecipeForm from "./-components/RecipeForm";
import { RecipeFormData } from "@/type";

export const Route = createFileRoute("/auth/recipe/new")({
  component: Component,
});

const postRecipe = async (data: RecipeFormData) => {
  const imageUploads = await Promise.allSettled(
    data.images.map(async (image) => {
      const formData = new FormData();
      formData.append("file", image);
      // アップロードAPIのエンドポイントにリクエストを送る
      const response = await fetch("/api/auth/recipe/image", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("画像アップロードに失敗しました。");
      }
      const result = await response.json();
      return result.imageUrl;
    })
  );
  const successfulUploads = imageUploads
    .filter((result) => result.status === "fulfilled")
    .map((result) => (result as PromiseFulfilledResult<string>).value);
  const recipeData = {
    ...data,
    images: successfulUploads,
  };

  const res = await fetch(`/api/auth/recipe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recipeData),
  });
  if (res.ok) {
    const data = await res.json();
    return data;
  } else {
    throw new Error("Recipeアップロードに失敗しました。");
  }
};

function Component() {
  return <RecipeForm onSubmit={postRecipe} />;
}
