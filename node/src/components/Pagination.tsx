import React from 'react';
import { Box, Button, HStack } from '@chakra-ui/react';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
  const createPageNumbers = () => {
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <Button
          key={i}
          onClick={() => onPageChange(i)}
          colorScheme={i === currentPage ? 'teal' : 'gray'}
          variant={i === currentPage ? 'solid' : 'outline'}
        >
          {i}
        </Button>
      );
    }
    return pages;
  };
  const onClick = (i: number) => {
    const np = currentPage + i;
    if(np > 0 && np <= totalPages) onPageChange(currentPage + i);
  }

  return (
    <HStack spacing={2}>
      <Button onClick={() => onClick(-1)} disabled={currentPage === 1}>
        Previous
      </Button>
      {createPageNumbers()}
      <Button onClick={() => onClick(1)} disabled={currentPage === totalPages}>
        Next
      </Button>
    </HStack>
  );
};

export default Pagination;
