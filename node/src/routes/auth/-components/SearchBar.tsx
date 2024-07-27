import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Select,
  Input,
  Button,
  useBreakpointValue,
} from '@chakra-ui/react';

import { SearchIcon } from '@chakra-ui/icons';
import { SearchParam } from '@/type'

interface Props {
  tags: string[];
  onSubmit: (q: string, tag: string) => void;
  initParam?: SearchParam;
}

const SearchBar: React.FC = ({ tags, onSubmit, initParam }: Props) => {
  const [query, setQuery] = useState(initParam.query ?? '');
  const [selectedTag, setSelectedTag] = useState(initParam.tag ?? '');
  const flexDirection = useBreakpointValue({ base: 'column', md: 'row' });

  useEffect(() => {
    setQuery(initParam.query);
    setSelectedTag(initParam.Tag);
  }, [initParam])

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
        <Input
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button colorScheme="blue" onClick={() => onSubmit(query, selectedTag)}>
          <SearchIcon />
        </Button>
      </Flex>
    </Box>
  );
};

export default SearchBar;
