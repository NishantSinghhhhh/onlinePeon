import React, { useEffect, useState, useContext } from 'react';
import HODnavbar from './navbar';
import { Box, Stack, Heading, Text, Flex, Alert, AlertIcon, Button } from '@chakra-ui/react';
import { HashLoader } from 'react-spinners';
import axios from 'axios';
import { LoginContext } from '../../../context/LoginContext';
import PLCard from '../../cards/PLCard'; // Assuming you'll have a PLCard component similar to LeaveCard

const PLPage = () => {
  const [pls, setPLs] = useState([]);
  const [filteredPLs, setFilteredPLs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLoader, setShowLoader] = useState(true);

  const { loginInfo } = useContext(LoginContext);

  // Fetch PL requests from the API
  const fetchPLs = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/fetchAll/fetchAllPLs`);
      if (!response.ok) throw new Error('Failed to fetch PL requests');
      const result = await response.json();

      if (result.success) {
        setPLs(result.data);
        console.log('All PLs:', result.data);
        filterAndSortPLs(result.data);

        console.log('Logged in as:', loginInfo.name);
        console.log('User Position:', loginInfo.position);
        console.log('Class of the User', loginInfo.classAssigned);
        console.log('Branch of the User', loginInfo.branchAssigned);
      } else {
        throw new Error('Failed to fetch PL requests');
      }
    } catch (error) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
      setShowLoader(false);
    }
  };

  const filterAndSortPLs = (pls) => {
    if (!loginInfo.position || loginInfo.position.toLowerCase() !== 'hod') {
      setError('Unauthorized access. Only HODs can view this page.');
      return;
    }
    const assignedBranch = loginInfo.branchAssigned;

    const filtered = pls.filter(pl => {
      const plBranch = extractBranchFromClassName(pl.className);

      if (plBranch === assignedBranch && !pl.className.toLowerCase().includes('fe')) {
        
        const extraDataArray = JSON.stringify(pl.extraDataArray);
        
        return extraDataArray === JSON.stringify([1, 0, 0, 0]);
      }

      return false;
    });

    console.log('Filtered PLs:', filtered);

    const sorted = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    setFilteredPLs(sorted);
  };

  // Helper function to extract the branch from className
  const extractBranchFromClassName = (className) => {
    const parts = className.split('-');
    return parts.length > 1 ? parts[1] : '';
  };

  // Handle status change for PL requests
  const handleStatusChange = async (plId, status) => {
    try {
      console.log(`Sending update request for PL ${plId} with status ${status}`);

      const position = 0; // Static value for HOD

      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/update/updatePL/${plId}`, {
        status,
        position,
      });

      if (response.data && response.data.success) {
        console.log('PL updated successfully:', response.data);
        
        // Remove the PL from filteredPLs and pls state
        setFilteredPLs(prevPLs =>
          prevPLs.filter(pl => pl._id !== plId)
        );
        setPLs(prevPLs =>
          prevPLs.filter(pl => pl._id !== plId)
        );
      } else {
        console.error('Failed to update:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating PL:', error.message);
    }
  };

  useEffect(() => {
    fetchPLs();

    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 2000);

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
      <HODnavbar />
      <Flex direction="column" align="center" justify="center" p={5}>
        <Heading as="h2" size="lg" mb={4}>PL Requests</Heading>
        {filteredPLs.length > 0 ? (
          <Stack spacing={4} maxW="md" w="full">
            {filteredPLs.map((pl) => (
              <PLCard 
                key={pl._id} 
                data={pl} 
                onStatusChange={handleStatusChange} 
              />
            ))}
          </Stack>
        ) : (
          <Text fontSize="xl" color="gray.600">No PL requests found.</Text>
        )}
      </Flex>
    </>
  );
};

export default PLPage;
