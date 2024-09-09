import React, { useEffect, useState } from 'react';
import { Box, Stack, Heading, Text, Flex, Alert, AlertIcon, Button } from '@chakra-ui/react';
import HodNavbar from './navbar';
import OutpassCard from '../../cards/outpassCard';
import { HashLoader } from 'react-spinners';
import axios from 'axios';

const OutpassPage = () => {
  const [outpasses, setOutpasses] = useState([]);
  const [filteredOutpasses, setFilteredOutpasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLoader, setShowLoader] = useState(true);

  const fetchOutpasses = async () => {
    try {
      const response = await fetch('http://localhost:8000/fetchAll/fetchAllOutpasses');
      if (!response.ok) throw new Error('Failed to fetch outpasses');
      const result = await response.json();

      if (result.success) {
        setOutpasses(result.data);
        console.log('All Outpasses:', result.data);
        filterAndSortOutpasses(result.data);
      } else {
        throw new Error('Failed to fetch outpasses');
      }
    } catch (error) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
      setShowLoader(false);
    }
  };

  const filterAndSortOutpasses = (outpasses) => {
    const loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
    
    if (!loginInfo) {
      setError('No login information found. Please log in again.');
      return;
    }
    const { branchAssigned } = loginInfo || {};

    // const { branchAssigned } = loginInfo;

    if (!branchAssigned) {
      setError('Branch assigned information is missing.');
      return;
    }

    const filtered = outpasses.filter(outpass =>
      outpass.className.includes(branchAssigned)
    );

    const sorted = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    setFilteredOutpasses(sorted);
  };

  useEffect(() => {
    fetchOutpasses();

    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleStatusChange = async (outpassId, status) => {
    try {
      const position = 1;

      const response = await axios.put(`http://localhost:8000/update/updateOutpass/${outpassId}`, {
        status,
        position,
      });

      if (response.data.success) {
        console.log('Outpass updated successfully:', response.data);
        setFilteredOutpasses(prevOutpasses =>
          prevOutpasses.map(outpass =>
            outpass._id === outpassId ? { ...outpass, status } : outpass
          )
        );
      } else {
        console.error('Failed to update:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating outpass:', error.message);
    }
  };

  if (loading || showLoader) {
    return (
      <Flex direction="column" align="center" justify="center" p={5} minH="100vh">
        <HashLoader color="#000000" loading={loading || showLoader} size={50} />
        <Text mt={4}>Loading...</Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex direction="column" align="center" justify="center" p={5} minH="100vh">
        <Alert status="error" variant="left-accent" borderRadius="md" boxShadow="lg" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
        <Button colorScheme="teal" onClick={() => window.location.reload()}>Try Again</Button>
      </Flex>
    );
  }

  return (
    <>
      <HodNavbar />
      <Flex direction="column" align="center" justify="center" p={5}>
        <Heading as="h2" size="lg" mb={4}>Outpass Requests</Heading>
        {filteredOutpasses.length > 0 ? (
          <Stack spacing={4} maxW="md" w="full">
            {filteredOutpasses.map((outpass) => (
              <OutpassCard 
                key={outpass._id} 
                data={outpass} 
                onStatusChange={handleStatusChange} 
              />
            ))}
          </Stack>
        ) : (
          <Text fontSize="xl" color="gray.600">No outpasses found.</Text>
        )}
      </Flex>
    </>
  );
};

export default OutpassPage;
