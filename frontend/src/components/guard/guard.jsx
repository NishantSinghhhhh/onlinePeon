import React, { useState } from 'react';
import Navbar from './pages/navbar';
import { Box, Container, Flex, Heading, Text, useColorModeValue } from '@chakra-ui/react';

const Guard = () => {
  const [successLeaves, setSuccessLeaves] = useState(0);
  const [failureLeaves, setFailureLeaves] = useState(0);
  const [successOutpasses, setSuccessOutpasses] = useState(0);
  const [failureOutpasses, setFailureOutpasses] = useState(0);

  const backgroundColor = useColorModeValue('gray.50', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.200');
  const cardBgColor = useColorModeValue('white', 'gray.700');

  return (
    <div>
      <Navbar />
      <Container maxW="container.md" mt="6" mb="6">
        <Box p="6">
          <Heading as="h2" size="lg" mb="4" color={textColor}>
            Counts Overview
          </Heading>
          <Flex direction="column" gap="4">
            <Box
              bg={cardBgColor}
              p="4"
              borderRadius="md"
              boxShadow="md"
              textAlign="center"
            >
              <Text fontSize="lg" fontWeight="bold">
                Successful Leaves
              </Text>
              <Text fontSize="2xl" color="green.500">
                {successLeaves}
              </Text>
            </Box>
            <Box
              bg={cardBgColor}
              p="4"
              borderRadius="md"
              boxShadow="md"
              textAlign="center"
            >
              <Text fontSize="lg" fontWeight="bold">
                Failed Leaves
              </Text>
              <Text fontSize="2xl" color="red.500">
                {failureLeaves}
              </Text>
            </Box>
            <Box
              bg={cardBgColor}
              p="4"
              borderRadius="md"
              boxShadow="md"
              textAlign="center"
            >
              <Text fontSize="lg" fontWeight="bold">
                Successful Outpasses
              </Text>
              <Text fontSize="2xl" color="green.500">
                {successOutpasses}
              </Text>
            </Box>
            <Box
              bg={cardBgColor}
              p="4"
              borderRadius="md"
              boxShadow="md"
              textAlign="center"
            >
              <Text fontSize="lg" fontWeight="bold">
                Failed Outpasses
              </Text>
              <Text fontSize="2xl" color="red.500">
                {failureOutpasses}
              </Text>
            </Box>
          </Flex>
        </Box>
      </Container>
    </div>
  );
};

export default Guard;
