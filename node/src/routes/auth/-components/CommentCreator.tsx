import React, { useState } from "react";
import {
  Box,
  Button,
  Textarea,
  Input,
  Flex,
  VStack,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
} from "@chakra-ui/react";

interface CommentCreatorProps {
  onSubmit: (commentText: string, rating: number) => Promise<boolean>;
}

function CommentCreator({ onSubmit }: CommentCreatorProps) {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [commentText, setCommentText] = useState<string>("");
  const [rating, setRating] = useState(0);
  const toast = useToast();

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
          <FormControl>
            <FormLabel>Rating</FormLabel>
            <NumberInput
              max={5}
              min={0}
              step={1}
              value={rating}
              onChange={(valueString) => setRating(parseFloat(valueString))}
            >
              <NumberInputField placeholder="評価を入力 (0 - 5)" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

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
