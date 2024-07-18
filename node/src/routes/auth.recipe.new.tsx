import React, { useState } from "react";
import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryClient } from "@tanstack/react-query";
import { GoogleLogin } from "@react-oauth/google";
import NoRecipeWebp from "@/assets/recipe_no_image.webp";
import styles from "./auth.recipe.module.css";

import { RecipeIncludeTagsAndImages } from '@/type';

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Tag,
  TagLabel,
  TagCloseButton,
  Image,
  useToast
} from '@chakra-ui/react';

export const Route = createFileRoute("/auth/recipe/new")({
  component: RecipeForm,
});

interface RecipeFormData {
  title: string;
  recipeText: string;
  images: File[];
  tags: string[];
}

const postRecipe = async (data: RecipeFormData) => {
  const imageUploads = await Promise.allSettled(data.images.map(async (image) => {
    const formData = new FormData();
    formData.append('file', image);
    // アップロードAPIのエンドポイントにリクエストを送る
    const response = await fetch('/api/auth/recipe/image', {
      method: 'POST',
      body: formData
    });
    if(!response.ok){
      throw new Error('画像アップロードに失敗しました。');
    }
    const result = await response.json();
    return result.imageUrl;
  }));
  const successfulUploads = imageUploads
    .filter(result => result.status === 'fulfilled')
    .map(result => (result as PromiseFulfilledResult<string>).value);
  const recipeData = {
    ...data,
    images: successfulUploads
  };

  const res = await fetch(`/api/auth/recipe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(recipeData)
  });
  if (res.ok) {
    const data = await res.json();
    return data;
  }else{
    throw new Error('Recipeアップロードに失敗しました。');
  }
}

function RecipeForm() {
  const [title, setTitle] = useState('');
  const [recipeText, setRecipeText] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const toast = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
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
    const data: RecipeFormData = { title, recipeText, images, tags };
    const res = await postRecipe(data);
    if(res.ok){
      toast({
	title: "レシピ投稿成功",
	description: "レシピが投稿されました。",
	status: "success",
	duration: 3000,
	isClosable: true,
      });
    }else{
      toast({
        title: "登録エラー",
        description: "登録内容に不備があります",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // フォームのリセット
    setTitle('');
    setRecipeText('');
    setImages([]);
    setImagePreviews([]);
    setTags([]);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setImages(files);
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const handleTagAdd = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
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
        <FormControl id="images" mb={4}>
          <FormLabel>レシピ画像</FormLabel>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
          <Box mt={4} display="flex" flexWrap="wrap">
            {imagePreviews.map((src, index) => (
              <Image
                key={index}
                src={src}
                alt={`Preview ${index}`}
                boxSize="100px"
                objectFit="cover"
                mr={2}
                mb={2}
                borderRadius="md"
              />
            ))}
          </Box>
        </FormControl>
        <FormControl id="tags" mb={4}>
          <FormLabel>タグ</FormLabel>
          <Input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
          />
          <Button onClick={handleTagAdd} mt={2}>タグを追加</Button>
          <Box mt={2}>
            {tags.map((tag, index) => (
              <Tag key={index} size="md" borderRadius="full" variant="solid" colorScheme="teal" m={1}>
                <TagLabel>{tag}</TagLabel>
                <TagCloseButton onClick={() => handleTagRemove(tag)} />
              </Tag>
            ))}
          </Box>
        </FormControl>
        <Button type="submit" colorScheme="teal" width="full">投稿する</Button>
      </form>
    </Box>
  );
};
