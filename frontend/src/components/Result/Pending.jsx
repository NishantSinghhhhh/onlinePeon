import React, { useEffect, useState } from 'react';
import { Box, Stack, Heading, Text, Flex, Badge } from '@chakra-ui/react';
import Navbar from '../navbar/navbar';

const Pending = () => {
  const [cardsData, setCardsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPendingOutpasses = async () => {
      const loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
      if (!loginInfo) {
        setError('No registration number found. Please log in again.');
        setLoading(false);
        return;
      }

      const { registrationNumber } = loginInfo;

      try {
        const response = await fetch(`http://localhost:8000/fetch/fetchoutpasses/${registrationNumber}`);
        const data = await response.json();

        if (response.ok) {
          // Filter outpasses where the first number in extraDataArray is 0
          const filteredData = data.filter((item) => item.extraDataArray[0] === 0);
          setCardsData(filteredData);
        } else {
          throw new Error(data.message || 'Failed to fetch pending outpasses');
        }
      } catch (err) {
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPendingOutpasses();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <>
      <Navbar />
      <Flex
        direction="column"
        align="center"
        justify="center"
        p={5}
      >
        {cardsData.length > 0 ? (
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
                    {card.reason || 'Pending Request'}
                  </Heading>
                  <Badge colorScheme="yellow">Pending</Badge>
                </Flex>
                <Text mb={2}>{card.reason || 'Details about the pending request'}</Text>
                <Text fontWeight="bold">
                  From: {card.startHour || '00:00'} 
                  &nbsp; to &nbsp; 
                  {card.endHour || '00:00'}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <Text>You have no pending outpasses.</Text>
        )}
      </Flex>
    </>
  );
};

export default Pending;
