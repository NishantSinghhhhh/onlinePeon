import React, { useState } from 'react';
import Navbar from './pages/navbar';
import { Box, Container, Flex, Heading, Text, Button, useColorModeValue } from '@chakra-ui/react';
import Scan from './pages/scan';
import axios from 'axios';

const Guard = () => {
  const [successLeaves, setSuccessLeaves] = useState(0);
  const [failureLeaves, setFailureLeaves] = useState(0);
  const [successOutpasses, setSuccessOutpasses] = useState(0);
  const [failureOutpasses, setFailureOutpasses] = useState(0);

  // Color mode values for better contrast
  const backgroundColor = useColorModeValue('gray.50', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.200');
  const cardBgColor = useColorModeValue('white', 'gray.700');

  // Function to handle download CSV
  const handleDownload = async () => {
    try {
      const response = await axios.get('/downloadOutpassesCsv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'outpasses.csv'); // File name for the CSV
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading CSV:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <Scan
        setSuccessLeaves={setSuccessLeaves}
        setFailureLeaves={setFailureLeaves}
        setSuccessOutpasses={setSuccessOutpasses}
        setFailureOutpasses={setFailureOutpasses}
      />
      <Container maxW="container.md" mt="6" mb="6">
        <Box p="6">
          <Heading as="h2" size="lg" mb="4" color={textColor}>Counts Overview</Heading>
          <Flex direction="column" gap="4">
            <Box
              bg={cardBgColor}
              p="4"
              borderRadius="md"
              boxShadow="md"
              textAlign="center"
            >
              <Text fontSize="lg" fontWeight="bold">Successful Leaves</Text>
              <Text fontSize="2xl" color="green.500">{successLeaves}</Text>
            </Box>
            <Box
              bg={cardBgColor}
              p="4"
              borderRadius="md"
              boxShadow="md"
              textAlign="center"
            >
              <Text fontSize="lg" fontWeight="bold">Failed Leaves</Text>
              <Text fontSize="2xl" color="red.500">{failureLeaves}</Text>
            </Box>
            <Box
              bg={cardBgColor}
              p="4"
              borderRadius="md"
              boxShadow="md"
              textAlign="center"
            >
              <Text fontSize="lg" fontWeight="bold">Successful Outpasses</Text>
              <Text fontSize="2xl" color="green.500">{successOutpasses}</Text>
            </Box>
            <Box
              bg={cardBgColor}
              p="4"
              borderRadius="md"
              boxShadow="md"
              textAlign="center"
            >
              <Text fontSize="lg" fontWeight="bold">Failed Outpasses</Text>
              <Text fontSize="2xl" color="red.500">{failureOutpasses}</Text>
            </Box>
          </Flex>

          {/* Download Button */}
          <Button
            mt="6"
            colorScheme="blue"
            onClick={handleDownload}
          >
            Download Outpasses CSV
          </Button>
        </Box>
      </Container>
    </div>
  );
};

export default Guard;
