import { RecipeIncludeTagsAndImages } from "@/type";
import NoRecipeWebp from "@/assets/recipe_no_image.webp";
import styles from "./RecipeCard.module.css";
import { Box, Tag, TagLabel } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";

interface RecipeCardLink {
  to: string;
  params: Object;
}

interface RecipeCardProps {
  recipe: RecipeIncludeTagsAndImages;
  isLink?: boolean;
  link?: RecipeCardLink;
}

export default function RecipeCard({ recipe, isLink, link }: RecipeCardProps) {
  const genLink = isLink
    ? (el) => {
      console.log(<Link {...link}>{el}</Link>)
        return <Link {...link}>{el}</Link>;
      }
    : (el) => el;
  return (
    <div className={styles.recipeItem}>
      <h3>{genLink(recipe.title)}</h3>
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

      <p>{recipe.recipe_text}</p>
      <p>
        <strong>作成者ID:</strong> {recipe.user_id}
      </p>
      <p>
        <strong>ユニークID:</strong> {recipe.unique_string_id}
      </p>
      <Box mt={2}>
        <h4>Tags</h4>
        {recipe.tags &&
          recipe.tags.map((tag, index) => (
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
      {recipe.created_at && (
        <p>
          <strong>作成日:</strong> {recipe.created_at}
        </p>
      )}
    </div>
  );
}
