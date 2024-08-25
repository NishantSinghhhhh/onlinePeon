// pages/Declined.js
import React from 'react';
import { Box, Stack, Heading, Text, Flex, Badge } from '@chakra-ui/react';
import Navbar from '../navbar/navbar';

const Declined = () => {
  // Sample data for the declined cards
  const cardsData = [
    { 
      title: 'Declined Outpass', 
      description: 'Details about the declined outpass',
      startDate: '2024-08-01',
      endDate: '2024-08-03'
    },
    { 
      title: 'Declined PL', 
      description: 'Details about the declined PL',
      startDate: '2024-08-05',
      endDate: '2024-08-07'
    },
    { 
      title: 'Declined Leave', 
      description: 'Details about the declined leave',
      startDate: '2024-08-10',
      endDate: '2024-08-12'
    }
  ];

  return (
    <>
      <Navbar />
      <Flex
        direction="column"
        align="center"
        justify="center"
        p={5}
      >
        <Stack spacing={4} maxW="md" w="full">
          {cardsData.map((card, index) => (
            <Box
              key={index}
              p={5}
              shadow="md"
              borderWidth="1px"
              borderRadius="md"
              bg="white"
            >
              <Flex align="center" mb={2}>
                <Heading fontSize="lg" mr={2}>
                  {card.title}
                </Heading>
                <Badge colorScheme="red">Declined</Badge>
              </Flex>
              <Text mb={2}>{card.description}</Text>
              <Text fontWeight="bold">
                From: {new Date(card.startDate).toLocaleDateString()} 
                &nbsp; to &nbsp; 
                {new Date(card.endDate).toLocaleDateString()}
              </Text>
            </Box>
          ))}
        </Stack>
      </Flex>
    </>
  );
};

export default Declined;
