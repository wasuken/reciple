import React, { useState } from "react";
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
  useToast,
} from "@chakra-ui/react";

import NoRecipeWebp from "@/assets/recipe_no_image.webp";
import { RecipeFormData } from "@/type";

interface CheckResult {
  message: string;
  result: boolean;
}

const TagListMaxSize = 5;
const TagMaxSize = 20;

const TitleMaxSize = 100;
const RecipeTextMaxSize = 1000;

function getCharacterCount(text: string, locale: string = "ja"): number {
  if (typeof Intl.Segmenter === "function") {
    const segmenter = new Intl.Segmenter(locale, { granularity: "grapheme" });
    const segments = Array.from(segmenter.segment(text));
    return segments.length;
  } else {
    // Fallback for environments that do not support Intl.Segmenter
    console.warn(
      "Intl.Segmenter is not supported in this environment. Falling back to basic length calculation."
    );
    return text.length;
  }
}

const tagsCheck = (tags: string[]): CheckResult => {
  if (tags.length > TagListMaxSize) {
    return {
      message: `タグが${TagListMaxSize}個より多く設定されています。`,
      result: false,
    };
  } else if (tags.filter((x) => getCharacterCount(x) > TagMaxSize).length > 0) {
    return {
      message: `${TagMaxSize}をこえた文字数のタグが存在します。`,
      result: false,
    };
  }
  return {
    message: "",
    result: true,
  };
};

const generateInputErrorToastParam = (description: string) => {
  return {
    title: "入力エラー",
    description: description,
    status: "error",
    duration: 3000,
    isClosable: true,
  };
};

interface RecipeFormProps {
  onSubmit: (data: RecipeFormData) => Promise<Request>;
}

export default function RecipeForm({ onSubmit }: RecipeFormProps) {
  const [title, setTitle] = useState("");
  const [recipeText, setRecipeText] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const toast = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title || !recipeText) {
      toast(
        generateInputErrorToastParam(
          "タイトルとレシピテキストを入力してください。"
        )
      );
      return;
    }
    if (getCharacterCount(title) > TitleMaxSize) {
      toast(
        generateInputErrorToastParam(
          `タイトルの最大文字数は${TitleMaxSize}文字です。`
        )
      );
      return;
    } else if (getCharacterCount(recipeText) > RecipeTextMaxSize) {
      toast(
        generateInputErrorToastParam(
          `レシピテキストの最大文字数は${RecipeTextMaxSize}文字です。`
        )
      );
      return;
    }
    const tagCheckResult = tagsCheck(tags);
    if (!tagCheckResult.result) {
      toast(generateInputErrorToastParam(tagCheckResult.message));
      return;
    }
    const data: RecipeFormData = {
      title,
      recipe_text: recipeText,
      images,
      tags,
    };
    try {
      const res = await onSubmit(data);
      toast({
        title: "レシピ投稿成功",
        description: "レシピが投稿されました。",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (e) {
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
    setTitle("");
    setRecipeText("");
    setImages([]);
    setImagePreviews([]);
    setTags([]);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setImages(files);
      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const handleTagAdd = () => {
    if (!tagInput) {
      toast(generateInputErrorToastParam("不正な入力です。"));
      return;
    } else if (tags.includes(tagInput)) {
      toast(generateInputErrorToastParam("すでに入力されているタグです"));
      return;
    }
    const ntags = [...tags, tagInput];
    const ntagsCheckResult = tagsCheck(ntags);
    if (!ntagsCheckResult.result) {
      toast(generateInputErrorToastParam(ntagsCheckResult.message));
      return;
    }
    setTags(ntags);
    setTagInput("");
  };

  const handleTagRemove = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
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
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), handleTagAdd())
            }
          />
          <Button onClick={handleTagAdd} mt={2}>
            タグを追加
          </Button>
          <Box mt={2}>
            {tags.map((tag, index) => (
              <Tag
                key={index}
                size="md"
                borderRadius="full"
                variant="solid"
                colorScheme="teal"
                m={1}
              >
                <TagLabel>{tag}</TagLabel>
                <TagCloseButton onClick={() => handleTagRemove(tag)} />
              </Tag>
            ))}
          </Box>
        </FormControl>
        <Button type="submit" colorScheme="teal" width="full">
          投稿する
        </Button>
      </form>
    </Box>
  );
}
