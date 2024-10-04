import React, { useEffect, useState } from 'react';
import { Box, Stack, Heading, Text, Flex, Badge } from '@chakra-ui/react';
import Navbar from '../navbar/navbar';
import { HashLoader } from 'react-spinners';

const Expired = () => {
  const [expiredOutpasses, setExpiredOutpasses] = useState([]);
  const [expiredLeaves, setExpiredLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true); // Added initialLoading state
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExpiredData = async () => {
      const loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
      if (!loginInfo) {
        setError('No registration number found. Please log in again.');
        setLoading(false);
        setInitialLoading(false); // Set initialLoading to false when loginInfo is missing
        return;
      }

      const { registrationNumber } = loginInfo;

      try {
        const expiredResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/fetch/fetchexpired/${registrationNumber}`);
        const expiredData = await expiredResponse.json();

        console.log('Expired data:', expiredData); // Log the data to verify structure

        if (expiredResponse.ok) {
          // Separate and filter expired Outpasses and Leaves
          const filteredOutpasses = expiredData.outpasses
            .filter((item) => item.extraValidation && item.extraValidation.toString() === '1,1')
            .map(item => ({ ...item, type: 'Outpass' }));

          const filteredLeaves = expiredData.leaves
            .filter((item) => item.extraValidation && item.extraValidation.toString() === '1,1')
            .map(item => ({ ...item, type: 'Leave' }));

          setExpiredOutpasses(filteredOutpasses);
          setExpiredLeaves(filteredLeaves);
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (err) {
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
        // Ensure the loader is shown for at least 2 seconds
        setTimeout(() => setInitialLoading(false), 1000);
      }
    };

    fetchExpiredData();
  }, []);

  // Display loader for at least 2 seconds
  if (loading || initialLoading) {
    return (
      <Flex direction="column" align="center" justify="center" p={5} minH="100vh">
        <HashLoader color="#000000" loading={loading || initialLoading} size={50} />
        <Text mt={4}>Loading...</Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex direction="column" align="center" justify="center" p={5} minH="100vh">
        <Text color="red.500">{error}</Text>
      </Flex>
    );
  }

  return (
    <>
      <Navbar />
      <Flex direction="column" align="center" justify="center" p={5}>
        {/* Section for Expired Outpasses */}
        {expiredOutpasses.length > 0 && (
          <>
            <Heading size="md" mb={4}>Expired Outpasses</Heading>
            <Stack spacing={4} maxW="md" w="full">
              {expiredOutpasses.map((item, index) => (
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
                      {item.reason || 'Expired Outpass'}
                    </Heading>
                    <Badge colorScheme="blue">Expired</Badge>
                  </Flex>
                  <Text mb={2}>{item.reason || 'Details about the expired request'}</Text>
                  <Text fontWeight="bold">
                    From: {new Date(item.startDate).toLocaleDateString()} 
                    &nbsp; to &nbsp; 
                    {new Date(item.endDate).toLocaleDateString()}
                  </Text>
                </Box>
              ))}
            </Stack>
          </>
        )}

        {/* Section for Expired Leaves */}
        {expiredLeaves.length > 0 && (
          <>
            <Heading size="md" mb={4}>Expired Leaves</Heading>
            <Stack spacing={4} maxW="md" w="full">
              {expiredLeaves.map((item, index) => (
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
                      {item.reasonForLeave || 'Expired Leave'}
                    </Heading>
                    <Badge colorScheme="blue">Expired</Badge>
                  </Flex>
                  <Text mb={2}>{item.reasonForLeave || 'Details about the expired leave'}</Text>
                  <Text fontWeight="bold">
                    From: {new Date(item.startDate).toLocaleDateString()} 
                    &nbsp; to &nbsp; 
                    {new Date(item.endDate).toLocaleDateString()}
                  </Text>
                </Box>
              ))}
            </Stack>
          </>
        )}

        {/* If no expired requests */}
        {expiredOutpasses.length === 0 && expiredLeaves.length === 0 && (
          <Text>No expired requests.</Text>
        )}
      </Flex>
    </>
  );
};

export default Expired;
