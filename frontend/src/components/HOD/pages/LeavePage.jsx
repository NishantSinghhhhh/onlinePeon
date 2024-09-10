import React, { useEffect, useState, useContext } from 'react';
import { Box, Stack, Heading, Text, Flex, Alert, AlertIcon, Button } from '@chakra-ui/react';
import HodNavbar from './navbar';
import LeaveCard from '../../cards/LeaveCard';
import { HashLoader } from 'react-spinners';
import axios from 'axios';
import { LoginContext } from '../../../context/LoginContext'; // Import the context

const LeavePage = () => {
  const [outpasses, setOutpasses] = useState([]);
  const [filteredOutpasses, setFilteredOutpasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLoader, setShowLoader] = useState(true);

  // Access loginInfo from LoginContext
  const { loginInfo } = useContext(LoginContext);

  const fetchOutpasses = async () => {
    try {
      const response = await fetch('http://localhost:8000/fetchAll/fetchAllOutpasses');
      if (!response.ok) throw new Error('Failed to fetch outpasses');
      const result = await response.json();

      if (result.success) {
        setOutpasses(result.data);
        console.log('All Outpasses:', result.data);
        filterAndSortOutpasses(result.data);

        // Log the position of the user from the context
        console.log('Logged in as:', loginInfo.name);
        console.log('User Position:', loginInfo.position); // Log staff position
        console.log('Class of the User', loginInfo.classAssigned);
        console.log('Branch of the User', loginInfo.branchAssigned); // Log branch assigned
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
    if (!loginInfo.position) {
      setError('No position information found. Please log in again.');
      return;
    }

    // Extract the class level (e.g., FE, SE, TE, BE) from the className string
    const extractClassLevel = (className) => {
      if (!className) return null;
      const match = className.match(/(FE|SE|TE|BE)/);
      return match ? match[0] : null;
    };

    const assignedClassLevel = extractClassLevel(loginInfo.classAssigned);
    const assignedBranch = loginInfo.branchAssigned;

    let filtered;

    if (loginInfo.position.toLowerCase() === 'warden') {
      filtered = outpasses.filter(outpass => {
        const outpassClassLevel = extractClassLevel(outpass.className);
        return outpassClassLevel === assignedClassLevel &&
               JSON.stringify(outpass.extraDataArray) === JSON.stringify([1, 1, 0, 0]);
      });
    } else if (loginInfo.position.toLowerCase() === 'hod') {
      filtered = outpasses.filter(outpass => {
        return outpass.branchAssigned === assignedBranch &&
               JSON.stringify(outpass.extraDataArray) === JSON.stringify([1, 0, 0, 0]);
      });
    } else {
      filtered = outpasses.filter(outpass => {
        const outpassClassLevel = extractClassLevel(outpass.className);
        return outpassClassLevel === assignedClassLevel &&
               !outpass.className.toLowerCase().includes('fe') &&
               outpass.extraDataArray && outpass.extraDataArray[0] === 1;
      });
    }

    console.log('Filtered Outpasses:', filtered);

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
      // Determine position based on the user's role
      const position = loginInfo.position.toLowerCase() === 'warden' ? 2 : 1;

      const response = await axios.put(`http://localhost:8000/update/updateOutpass/${outpassId}`, {
        status,
        position,
      });

      // Check the response structure and handle accordingly
      if (response.data && response.data.success) {
        console.log('Outpass updated successfully:', response.data);
        setFilteredOutpasses(prevOutpasses =>
          prevOutpasses.map(outpass =>
            outpass._id === outpassId ? { ...outpass, status } : outpass
          )
        );
      } else {
        // Log the entire response data for debugging
        console.error('Failed to update:', response.data ? response.data.message : 'No message');
      }
    } catch (error) {
      // Log detailed error information
      console.error('Error updating outpass:', error.response ? error.response.data : error.message);
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
        <Heading as="h2" size="lg" mb={4}>Outpasses</Heading>
        {filteredOutpasses.length > 0 ? (
          <Stack spacing={4} maxW="md" w="full">
            {filteredOutpasses.map((outpass) => (
              <LeaveCard 
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

export default LeavePage;
