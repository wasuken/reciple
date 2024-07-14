import React, { useState } from "react";
import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryClient } from "@tanstack/react-query";
import { GoogleLogin } from "@react-oauth/google";
import NoRecipeWebp from "@/assets/recipe_no_image.webp";
import styles from "./auth.recipe.module.css";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";

export const Route = createFileRoute("/auth/recipe/new")({
  component: RecipeForm,
});

function RecipeForm() {
  const [title, setTitle] = useState("");
  const [recipeText, setRecipeText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const toast = useToast();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title || !recipeText) {
      toast({
        title: "入力エラー",
        description: "タイトルとレシピテキストを入力してください。",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    // レシピ投稿処理をここに追加
    console.log({
      title,
      recipeText,
      image,
    });
    toast({
      title: "レシピ投稿成功",
      description: "レシピが投稿されました。",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    // フォームのリセット
    setTitle("");
    setRecipeText("");
    setImage(null);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setImage(event.target.files[0]);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={5} p={5} borderWidth="1px" borderRadius="lg">
      <form onSubmit={handleSubmit}>
        <FormControl id="title" mb={4}>
          <FormLabel>レシピタイトル</FormLabel>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormControl>
        <FormControl id="recipeText" mb={4}>
          <FormLabel>レシピテキスト</FormLabel>
          <Textarea
            value={recipeText}
            onChange={(e) => setRecipeText(e.target.value)}
          />
        </FormControl>
        <FormControl id="image" mb={4}>
          <FormLabel>レシピ画像</FormLabel>
          <Input type="file" accept="image/*" onChange={handleImageChange} />
        </FormControl>
        <Button type="submit" colorScheme="teal" width="full">
          投稿する
        </Button>
      </form>
    </Box>
  );
}
