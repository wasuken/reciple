import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Select,
  Input,
  Button,
  HStack,
  Text,
  Icon,
  useBreakpointValue,
} from "@chakra-ui/react";

import { SearchIcon, StarIcon } from "@chakra-ui/icons";
import { SearchParam, RecipeRating } from "@/type";

interface Props {
  tags: string[];
  onSubmit: (q: string, tag: string, rating: number) => void;
  initParam?: SearchParam;
}

const SearchBar: React.FC = ({ tags, onSubmit, initParam }: Props) => {
  const [query, setQuery] = useState(initParam.query ?? "");
  const [selectedTag, setSelectedTag] = useState(initParam.tag ?? "");
  const [rating, setRating] = useState<RecipeRating>(1);
  const handleStarClick = (index: number) => {
    setRating(index + 1);
  };
  const flexDirection = useBreakpointValue({ base: "column", md: "row" });

  useEffect(() => {
    setQuery(initParam.query);
    setSelectedTag(initParam.tag);
  }, [initParam]);

  return (
    <Box p={4} w="100%" maxW="800px" mx="auto">
      <Flex direction={flexDirection} gap={2}>
        <Select
          placeholder="Select tag"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </Select>
        <Flex align="center" mr={2}>
          <Text mr={2}>最小平均評価:</Text>
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
        <Input
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button
          colorScheme="blue"
          onClick={() => onSubmit(query, selectedTag, rating)}
        >
          <SearchIcon />
        </Button>
      </Flex>
    </Box>
  );
};

export default SearchBar;
