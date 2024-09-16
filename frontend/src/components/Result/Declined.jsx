import React, { useEffect, useState } from 'react';
import { Box, Stack, Heading, Text, Flex, Badge } from '@chakra-ui/react';
import Navbar from '../navbar/navbar';
import { HashLoader } from 'react-spinners';
import { format } from 'date-fns';

const Declined = () => {
  const [outpasses, setOutpasses] = useState([]);
  const [plRequests, setPlRequests] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const fetchDeclinedData = async () => {
      const loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
      if (!loginInfo) {
        setError('No registration number found. Please log in again.');
        setLoading(false);
        setShowLoader(false);
        return;
      }

      const { registrationNumber } = loginInfo;

      try {
        const response = await fetch(`https://online-peon.vercel.app/fetch/fetchdeclined/${registrationNumber}`);
        const data = await response.json();

        if (response.ok) {
          setOutpasses(data.outpasses);
          setPlRequests(data.pls);
          setLeaves(data.leaves);
        } else {
          throw new Error(data.message || 'Failed to fetch declined requests');
        }
      } catch (err) {
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDeclinedData();

    // Ensure loader is shown for at least 2 seconds
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 2000);

    // Clear the timeout if the component unmounts before 2 seconds
    return () => clearTimeout(timer);
  }, []);

  if (loading || showLoader) {
    return (
      <Flex direction="column" align="center" justify="center" p={5} minH="100vh">
        <HashLoader color="#000000" loading={loading || showLoader} size={50} />
        <Text mt={4}>Loading...</Text>
      </Flex>
    );
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <>
      <Navbar />
      <Flex direction="column" align="center" justify="center" p={5}>
        {/* Render Declined Outpasses */}
        <Heading as="h2" size="lg" mb={4}>Declined Outpasses</Heading>
        {outpasses.length > 0 ? (
          <Stack spacing={4} maxW="md" w="full">
            {outpasses.map((card, index) => (
              <Box
                key={`outpass-${index}`}
                p={5}
                shadow="md"
                borderWidth="1px"
                borderRadius="md"
                bg="white"
              >
                <Flex align="center" mb={2}>
                  <Heading fontSize="lg" mr={2}>
                    {card.reason || 'Declined Outpass'}
                  </Heading>
                  <Badge colorScheme="red">Declined</Badge>
                </Flex>
                <Text mb={2}>{card.reason || 'Details about the declined outpass'}</Text>
                <Text fontWeight="bold">
                  From: {card.startHour || '00:00'} 
                  &nbsp; to &nbsp; 
                  {card.endHour || '00:00'}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <Text>No declined outpasses.</Text>
        )}

        {/* Render Declined PL Requests */}
        <Heading as="h2" size="lg" mt={8} mb={4}>Declined PL Requests</Heading>
        {plRequests.length > 0 ? (
          <Stack spacing={4} maxW="md" w="full">
            {plRequests.map((card, index) => (
              <Box
                key={`pl-${index}`}
                p={5}
                shadow="md"
                borderWidth="1px"
                borderRadius="md"
                bg="white"
              >
                <Flex align="center" mb={2}>
                  <Heading fontSize="lg" mr={2}>
                    {card.reason || 'Declined PL'}
                  </Heading>
                  <Badge colorScheme="red">Declined</Badge>
                </Flex>
                <Text mb={2}>{card.reason || 'Details about the declined PL'}</Text>
                <Text fontWeight="bold">
                  From: {format(new Date(card.startDate), 'yyyy-MM-dd')} 
                  &nbsp; to &nbsp; 
                  {format(new Date(card.endDate), 'yyyy-MM-dd')}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <Text>No declined PLs.</Text>
        )}

        {/* Render Declined Leaves */}
        <Heading as="h2" mt={8} size="lg" mb={4}>Declined Leaves</Heading>
        {leaves.length > 0 ? (
          <Stack spacing={4} maxW="md" w="full">
            {leaves.map((card, index) => (
              <Box
                key={`leave-${index}`}
                p={5}
                shadow="md"
                borderWidth="1px"
                borderRadius="md"
                bg="white"
              >
                <Flex align="center" mb={2}>
                  <Heading fontSize="lg" mr={2}>
                    {card.reason || 'Declined Leave'}
                  </Heading>
                  <Badge colorScheme="red">Declined</Badge>
                </Flex>
                <Text mb={2}>{card.reason || 'Details about the declined leave'}</Text>
                <Text fontWeight="bold">
                  From: {format(new Date(card.startDate), 'yyyy-MM-dd')} 
                  &nbsp; to &nbsp; 
                  {format(new Date(card.endDate), 'yyyy-MM-dd')}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <Text>No declined leaves.</Text>
        )}
      </Flex>
    </>
  );
};

export default Declined;
