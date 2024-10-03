import React from 'react';
import Navbar from './pages/navbar';
import { Box, Container, Flex, Heading, Text, useColorModeValue } from '@chakra-ui/react';
import { useLeave } from '../../context/LeaveNumContext'; // Import the useLeave hook

const Guard = () => {
  const { successLeaves, failureLeaves } = useLeave(); // Get the leave counts

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
                {successLeaves} {/* Display successful leaves count */}
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
                {failureLeaves} {/* Display failed leaves count */}
              </Text>
            </Box>
          </Flex>
        </Box>
      </Container>
    </div>
  );
};

export default Guard;
