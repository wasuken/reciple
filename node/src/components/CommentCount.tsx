import React from 'react';
import { Box, Icon, Text } from '@chakra-ui/react';
import { ChatIcon } from '@chakra-ui/icons';

interface CommentCountProps {
  count: number;
}

const CommentCount: React.FC<CommentCountProps> = ({ count }) => {
  return (
    <Box position="relative" display="inline-block">
      <Icon as={ChatIcon} w={6} h={6} />
      {count > 0 && (
        <Box
          position="absolute"
          top="-10px"
          right="-10px"
          bg="red.500"
          borderRadius="full"
          width="20px"
          height="20px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="white"
          fontSize="sm"
        >
          <Text>{count}</Text>
        </Box>
      )}
    </Box>
  );
};

export default CommentCount;
