import { Box, Tag, TagLabel } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";

import { RecipeInclude } from "@/type";
import NoRecipeWebp from "@/assets/recipe_no_image.webp";
import styles from "./RecipeCard.module.css";
import CommentCount from "@/components/CommentCount";
import CommentList from './CommentList';

interface RecipeCardLink {
  to: string;
  params: Object;
}

interface RecipeCardProps {
  recipe: RecipeInclude;
  isLink?: boolean;
  link?: RecipeCardLink;
}

export default function RecipeCard({ recipe, isLink, link }: RecipeCardProps) {
  console.log(recipe)
  const genLink = isLink
    ? (el) => {
        return <Link {...link}>{el}</Link>;
      }
    : (el) => el;
  return (
    <div className={styles.recipeItem}>
      <h3 className={styles.recipeTitle}>{genLink(recipe.title)}</h3>
      {genLink(
        <img
          src={
            recipe.images && recipe.images.length > 0
              ? recipe.images[0]
              : NoRecipeWebp
          }
          alt={recipe.title}
          className={styles.recipeImage}
        />
      )}

      <div className={styles.recipeMiddleArea}>
        <div className={styles.recipeBody}>{recipe.recipe_text}</div>
      </div>
      <p>
        <strong>作成者:</strong> {recipe.user_name}
      </p>
      <p>
        <strong>ユニークID:</strong> {recipe.unique_string_id}
      </p>
      <div className={styles.recipeFooter}>
        {recipe.tags && recipe.tags.length > 0 && (
          <Box mt={2}>
            <h4>Tags</h4>
            {recipe.tags.map((tag, index) => (
              <Tag
                key={index}
                size="md"
                borderRadius="full"
                variant="solid"
                colorScheme="teal"
                m={1}
              >
                <TagLabel>{tag}</TagLabel>
              </Tag>
            ))}
          </Box>
        )}
        <Box mt={2}>
          <CommentCount count={recipe.comment_count} />
        </Box>
        {recipe.created_at && (
          <p>
            <strong>作成日:</strong> {recipe.created_at}
          </p>
        )}
	{recipe.comments && (
	  <CommentList comments={recipe.comments} />
	)}
      </div>
    </div>
  );
}
