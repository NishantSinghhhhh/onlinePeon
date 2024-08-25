// pages/Approved.js
import React from 'react';
import { Box, Stack, Heading, Text, Flex, Badge } from '@chakra-ui/react';
import Navbar from '../navbar/navbar';

const Approved = () => {
  // Sample data for the cards with date information
  const cardsData = [
    { 
      title: 'Approved Outpass', 
      description: 'Details about the approved outpass',
      startDate: '2024-08-01',
      endDate: '2024-08-03'
    },
    { 
      title: 'Approved PL', 
      description: 'Details about the approved PL',
      startDate: '2024-08-05',
      endDate: '2024-08-07'
    },
    { 
      title: 'Approved Leave', 
      description: 'Details about the approved leave',
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
                <Badge colorScheme="green">Approved</Badge>
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

export default Approved;
