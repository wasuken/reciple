import { Box, Text, Flex, Badge, VStack } from "@chakra-ui/react";

interface Comment {
  comment_id: number;
  user_name: string;
  comment_text: string;
  rating: number;
}

interface CommentListProps {
  comments: Comment[];
}

function CommentList({ comments }: CommentListProps) {
  console.log(comments)
  if(!comments) {
    return (
      <>No Comments.</>
    )
  }
  return (
    <VStack align="stretch" spacing={4} mt={4}>
      {comments.map((comment) => (
        <Box key={comment.comment_id} p={4} borderWidth="1px" borderRadius="md" shadow="sm">
          <Flex justify="space-between" align="center">
            <Text fontWeight="bold">{comment.user_name}</Text>
            <Badge colorScheme="green">{`Rating: ${comment.rating}`}</Badge>
          </Flex>
          <Text mt={2}>{comment.comment_text}</Text>
        </Box>
      ))}
    </VStack>
  );
}

export default CommentList;
