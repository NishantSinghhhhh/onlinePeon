import React, { useEffect, useState, useContext } from 'react';
import { Box, Stack, Heading, Text, Flex, Alert, AlertIcon, Button } from '@chakra-ui/react';
import HodNavbar from './navbar';
import PLCard from '../../cards/PLCard';
import { HashLoader } from 'react-spinners';
import axios from 'axios';
import { LoginContext } from '../../../context/LoginContext'; // Import the context

const PLpage = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLoader, setShowLoader] = useState(true);


  const { loginInfo } = useContext(LoginContext);

  const fetchPLs = async () => {
    try {
      const response = await fetch('http://localhost:8000/fetchAll/fetchAllPLs');
      if (!response.ok) throw new Error('Failed to fetch permitted leaves');
      const result = await response.json();

      if (result.success) {
        setLeaves(result.data);
        console.log('All PLs:', result.data);
        filterAndSortPLs(result.data);

        console.log('Logged in as:', loginInfo.name);
        console.log('User Position:', loginInfo.position); 
        console.log('Class of the User:', loginInfo.classAssigned);
        console.log('Branch Assigned:', loginInfo.branchAssigned);
      } else {
        throw new Error('Failed to fetch permitted leaves');
      }
    } catch (error) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
      setShowLoader(false);
    }
  };

  const extractClassLevel = (className) => {
    const match = className.match(/(FE|SE|TE|BE)/);
    return match ? match[0] : null;
  };

  const filterAndSortPLs = (pls) => {
    if (!loginInfo.position) {
      setError('No position information found. Please log in again.');
      return;
    }

    const assignedClassLevel = extractClassLevel(loginInfo.classAssigned);
    const assignedBranch = loginInfo.branchAssigned;

    let filtered;

    if (loginInfo.position.toLowerCase() === 'warden') {
      filtered = pls.filter(pl => {
        const plClassLevel = extractClassLevel(pl.className);
        return plClassLevel === assignedClassLevel &&
          JSON.stringify(pl.extraDataArray) === JSON.stringify([1, 1, 0, 0]);
      });
    } else if (loginInfo.position.toLowerCase() === 'hod') {
      filtered = pls.filter(pl => {
        return pl.branchAssigned === assignedBranch &&
          JSON.stringify(pl.extraDataArray) === JSON.stringify([1, 0, 0, 0]);
      });
    } else {
      filtered = pls.filter(pl => {
        const plClassLevel = extractClassLevel(pl.className);
        return plClassLevel === assignedClassLevel &&
          !pl.className.toLowerCase().includes('fe') &&
          pl.extraDataArray && pl.extraDataArray[0] === 1;
      });
    }

    console.log('Filtered PLs:', filtered);

    const sorted = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    setFilteredLeaves(sorted);
  };

  useEffect(() => {
    fetchPLs();

    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleStatusChange = async (plId, status) => {
    try {
      const position = 1;

      const response = await axios.put(`http://localhost:8000/update/updatePL/${plId}`, {
        status,
        position,
      });

      if (response.data.success) {
        console.log('PL updated successfully:', response.data);
        setFilteredLeaves(prevPLs =>
          prevPLs.map(pl =>
            pl._id === plId ? { ...pl, status } : pl
          )
        );
      } else {
        console.error('Failed to update:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating PL:', error.message);
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
        <Heading as="h2" size="lg" mb={4}>Permitted Leave Requests</Heading>
        {filteredLeaves.length > 0 ? (
          <Stack spacing={4} maxW="md" w="full">
            {filteredLeaves.map((leave) => (
              <PLCard
                key={leave._id}
                data={leave}
                onStatusChange={handleStatusChange}
              />
            ))}
          </Stack>
        ) : (
          <Text fontSize="xl" color="gray.600">No permitted leaves found.</Text>
        )}
      </Flex>
    </>
  );
};

export default PLpage;
