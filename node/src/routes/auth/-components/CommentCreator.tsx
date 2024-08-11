import React, { useState } from "react";
import {
  Box,
  Button,
  Textarea,
  Flex,
  VStack,
  FormControl,
  FormLabel,
  useToast,
  HStack,
  Text,
  Icon,
} from "@chakra-ui/react";
import { RecipeRating } from "@/type";

import { StarIcon } from "@chakra-ui/icons";

interface CommentCreatorProps {
  onSubmit: (commentText: string, rating: number) => Promise<boolean>;
}

function CommentCreator({ onSubmit }: CommentCreatorProps) {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [commentText, setCommentText] = useState<string>("");
  const [rating, setRating] = useState<RecipeRating>(1);
  const toast = useToast();

  const handleStarClick = (index: number) => {
    setRating(index + 1);
  };

  const handleSubmit = async () => {
    const res = await onSubmit(commentText, rating);
    if (res) {
      toast({
        title: "成功",
        description: "コメントの投稿に成功しました",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "失敗",
        description: "コメントの投稿に失敗しました",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setCommentText("");
    setRating(0);
    setIsActive(false);
  };

  return (
    <Box mt={4}>
      {!isActive ? (
        <Button colorScheme="teal" onClick={() => setIsActive(true)}>
          コメントを投稿する
        </Button>
      ) : (
        <VStack align="stretch" spacing={4}>
          <FormControl>
            <FormLabel>Comment</FormLabel>
            <Textarea
              placeholder="コメントを入力..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
          </FormControl>
          <Flex align="center" mr={2}>
            <Text mr={2}>評価:</Text>
            <HStack spacing={1} mr={2}>
              {Array(5)
                .fill("")
                .map((_, index) => (
                  <Box
                    as="button"
                    key={index}
                    onClick={() => handleStarClick(index)}
                    color={index < rating ? "teal.500" : "gray.300"}
                    cursor="pointer"
                    aria-label={`Rate ${index + 1} stars`}
                  >
                    <Icon as={StarIcon} boxSize={6} />
                  </Box>
                ))}
            </HStack>
          </Flex>

          <Flex justifyContent="space-between">
            <Button colorScheme="teal" onClick={handleSubmit}>
              投稿
            </Button>
            <Button
              colorScheme="red"
              variant="outline"
              onClick={() => setIsActive(false)}
            >
              閉じる
            </Button>
          </Flex>
        </VStack>
      )}
    </Box>
  );
}

export default CommentCreator;
