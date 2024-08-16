import React from "react";
import { Box, Grid, Image, Text, Flex, Button, HStack } from "@chakra-ui/react";

import RecipeList from "./RecipeList";
import { RecipeInclude } from "@/type";

interface TopPageProps {
  tags: string[];
  onTagClick: (tagName: string) => void;
  siteDescription: string;
  recipes: RecipeInclude[];
}

function SimpleTop({
  tags,
  onTagClick,
  siteDescription,
  recipes,
}: TopPageProps) {
  return (
    <Box p={4}>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        タグ一覧
      </Text>
      <Flex justify="flex-start" mb={4}>
        <HStack spacing={2}>
          {tags.map((tag) => (
            <Button
              key={tag}
              onClick={() => onTagClick(tag)}
              variant="outline"
              colorScheme="teal"
            >
              {tag}
            </Button>
          ))}
        </HStack>
      </Flex>

      <Box mb={6}>
        <Text fontSize="lg" fontWeight="bold" mb={2}>
          サイトの説明
        </Text>
        <Text>{siteDescription}</Text>
      </Box>

      <RecipeList recipes={recipes} />
    </Box>
  );
}

export default SimpleTop;
