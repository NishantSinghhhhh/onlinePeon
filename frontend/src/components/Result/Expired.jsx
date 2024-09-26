import React, { useEffect, useState } from 'react';
import { Box, Stack, Heading, Text, Flex, Badge } from '@chakra-ui/react';
import Navbar from '../navbar/navbar';
import { HashLoader } from 'react-spinners';

const Expired = () => {
  const [expiredItems, setExpiredItems] = useState([]);
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
          // Adding type field to each item
          const itemsWithType = [
            ...expiredData.outpasses.map(item => ({ ...item, type: 'Outpass' })),
            ...expiredData.pls.map(item => ({ ...item, type: 'PL' })),
            ...expiredData.leaves.map(item => ({ ...item, type: 'Leave' }))
          ];
          setExpiredItems(itemsWithType);
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (err) {
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
        // Ensure the loader is shown for at least 2 seconds
        setTimeout(() => setInitialLoading(false), 2000);
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
        {expiredItems.length > 0 ? (
          <Stack spacing={4} maxW="md" w="full">
            {expiredItems.map((item, index) => (
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
                    {item.reason || item.reasonForLeave || 'Expired Request'}
                  </Heading>
                  <Badge colorScheme="gray">Expired</Badge>
                </Flex>
                <Flex align="center" mb={2}>
                  <Badge colorScheme="blue">{item.type}</Badge>
                </Flex>
                <Text mb={2}>{item.reason || item.reasonForLeave || 'Details about the expired request'}</Text>
                <Text fontWeight="bold">
                  From: {new Date(item.startDate || item.date).toLocaleDateString()} 
                  &nbsp; to &nbsp; 
                  {new Date(item.endDate || item.date).toLocaleDateString()}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <Text>No expired requests.</Text>
        )}
      </Flex>
    </>
  );
};

export default Expired;
