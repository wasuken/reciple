import React from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";

import {RecipeInclude} from '@/type';
import NoRecipeWebp from "@/assets/recipe_no_image.webp";

interface RecipeListProps {
  recipes: RecipeInclude[];
}

function RecipeList({ recipes }: RecipeListProps) {
  console.log(recipes);
  if(!recipes) return <>no recipes.</>;
  return (
    <Box p={4} overflowX="auto">
      <Flex gap={4} w="max-content">
        {recipes.map((recipe) => (
          <Box
            key={recipe.id}
            borderWidth="1px"
            borderRadius="md"
            overflow="hidden"
            width="40vw"
            minHeight="300px"
          >
	    <Image
	      src={
		recipe.images && recipe.images.length > 0
		  ? recipe.images[0]
		  : NoRecipeWebp
	      }
	      alt={recipe.title}
              width="100%"
              height="150px"
              objectFit="cover"
	    />
            <Box p={2}>
              <Text fontWeight="bold" isTruncated>{recipe.title}</Text>
              <Text fontSize="sm" color="gray.500" isTruncated>
                作成者: {recipe.user_name}
              </Text>
              <Text fontSize="xs" color="gray.500" noOfLines={2} isTruncated>
                {recipe.tags.join(", ")}
              </Text>
              <Text fontSize="xs" color="gray.500" isTruncated>
                コメント数: {recipe.comment_count}
              </Text>
            </Box>
          </Box>
        ))}
      </Flex>
    </Box>
  );
}

export default RecipeList;
