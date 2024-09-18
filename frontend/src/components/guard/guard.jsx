import React, { useState, useEffect } from 'react';
import Navbar from './pages/navbar';
import { Box, Container, Flex, Heading, Text, Button, useColorModeValue } from '@chakra-ui/react';
import Scan from './pages/scan';
import axios from 'axios';

const Guard = () => {
  const [successLeaves, setSuccessLeaves] = useState(0);
  const [failureLeaves, setFailureLeaves] = useState(0);
  const [successOutpasses, setSuccessOutpasses] = useState(0);
  const [failureOutpasses, setFailureOutpasses] = useState(0);
  const [scannedObjectId, setScannedObjectId] = useState(null); // State to store the scanned object ID
  const [outpasses, setOutpasses] = useState([]); // State to store all outpasses
  const [filteredOutpass, setFilteredOutpass] = useState(null); // State to store the filtered outpass

  // Color mode values for better contrast
  const backgroundColor = useColorModeValue('gray.50', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.200');
  const cardBgColor = useColorModeValue('white', 'gray.700');

  // Function to fetch all outpasses
  const fetchAllOutpasses = async () => {
    try {
      const response = await axios.get('https://online-peon.vercel.app/fetchAll/fetchAllOutpasses');
      setOutpasses(response.data.data);
      console.log('Fetched Outpasses:', response.data.data); // Log the fetched outpasses
    } catch (error) {
      console.error('Error fetching outpasses:', error);
    }
  };

  // Filter the outpass based on the scanned object ID
  useEffect(() => {
    if (scannedObjectId && outpasses.length > 0) {
      const filtered = outpasses.find(outpass => outpass._id === scannedObjectId);
      setFilteredOutpass(filtered);
      console.log('Filtered Outpass:', filtered); // Log the filtered outpass
    }
  }, [scannedObjectId, outpasses]);

  // Fetch all outpasses when the component mounts
  useEffect(() => {
    fetchAllOutpasses();
  }, []);

  return (
    <div>
      <Navbar />
      <Scan
        setSuccessLeaves={setSuccessLeaves}
        setFailureLeaves={setFailureLeaves}
        setSuccessOutpasses={setSuccessOutpasses}
        setFailureOutpasses={setFailureOutpasses}
        setScannedObjectId={setScannedObjectId} // Pass the state setter function
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

          {/* Display Scanned Object ID */}
          {scannedObjectId && (
            <Box mt="6" p="4" bg={cardBgColor} borderRadius="md" boxShadow="md">
              <Text fontSize="lg" fontWeight="bold">Scanned Object ID</Text>
              <Text fontSize="2xl" color="blue.500">{scannedObjectId}</Text>
            </Box>
          )}

          {/* Display Filtered Outpass */}
          {filteredOutpass && (
            <Box mt="6" p="4" bg={cardBgColor} borderRadius="md" boxShadow="md">
              <Text fontSize="lg" fontWeight="bold">Filtered Outpass</Text>
              <Text fontSize="md" color="blue.500">{JSON.stringify(filteredOutpass, null, 2)}</Text>
            </Box>
          )}
        </Box>
      </Container>
    </div>
  );
};

export default Guard;
