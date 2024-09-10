import React, { useEffect, useState, useContext } from 'react';
import { Box, Stack, Heading, Text, Flex, Alert, AlertIcon, Button } from '@chakra-ui/react';
import HodNavbar from './navbar';
import LeaveCard from '../../cards/LeaveCard';
import { HashLoader } from 'react-spinners';
import axios from 'axios';
import { LoginContext } from '../../../context/LoginContext'; // Import the context

const LeavePage = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLoader, setShowLoader] = useState(true);

  // Access loginInfo from LoginContext
  const { loginInfo } = useContext(LoginContext);

  const fetchLeaves = async () => {
    try {
      const response = await fetch('http://localhost:8000/fetchAll/fetchAllLeaves');
      if (!response.ok) throw new Error('Failed to fetch leaves');
      const result = await response.json();

      if (result.success) {
        setLeaves(result.data);
        console.log('All Leaves:', result.data);
        filterAndSortLeaves(result.data);

        // Log the position of the user from the context
        console.log('Logged in as:', loginInfo.name);
        console.log('User Position:', loginInfo.position); // Log staff position
        console.log('Class of the User', loginInfo.classAssigned);
      } else {
        throw new Error('Failed to fetch leaves');
      }
    } catch (error) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
      setShowLoader(false);
    }
  };

  const filterAndSortLeaves = (leaves) => {
    if (!loginInfo.position) {
      setError('No position information found. Please log in again.');
      return;
    }

    // Extract the class level (e.g., FE, SE, TE, BE) from the className string
    const extractClassLevel = (className) => {
      const match = className.match(/(FE|SE|TE|BE)/);
      return match ? match[0] : null;
    };

    const assignedClassLevel = extractClassLevel(loginInfo.classAssigned);

    if (!assignedClassLevel) {
      setError('Invalid class assigned in your login info. Please log in again.');
      return;
    }

    let filtered;

    if (loginInfo.position.toLowerCase() === 'warden') {
      // Warden-specific logic
      filtered = leaves.filter(leave => {
        const leaveClassLevel = extractClassLevel(leave.className);
        return leaveClassLevel === assignedClassLevel &&
               JSON.stringify(leave.extraDataArray) === JSON.stringify([1, 1, 0, 0]);
      });
    } else {
      // Normal logic for HOD or other roles
      filtered = leaves.filter(leave => {
        const leaveClassLevel = extractClassLevel(leave.className);
        return leaveClassLevel === assignedClassLevel &&
               !leave.className.toLowerCase().includes('fe') &&
               leave.extraDataArray && leave.extraDataArray[0] === 1;
      });
    }

    // Log the filtered result
    console.log('Filtered Leaves:', filtered);

    // Sort the leaves by date
    const sorted = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    setFilteredLeaves(sorted);
  };

  useEffect(() => {
    fetchLeaves();

    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  
  const handleStatusChange = async (leaveId, status) => {
    try {
      // Determine position based on the user's role
      const position = loginInfo.position.toLowerCase() === 'warden' ? 2 : 1;
  
      const response = await axios.put(`http://localhost:8000/update/updateLeave/${leaveId}`, {
        status,
        position,
      });
  
      // Check the response structure and handle accordingly
      if (response.data && response.data.success) {
        console.log('Leave updated successfully:', response.data);
        setFilteredLeaves(prevLeaves =>
          prevLeaves.map(leave =>
            leave._id === leaveId ? { ...leave, status } : leave
          )
        );
      } else {
        // Log the entire response data for debugging
        console.error('Failed to update:', response.data ? response.data.message : 'No message');
      }
    } catch (error) {
      // Log detailed error information
      console.error('Error updating leave:', error.response ? error.response.data : error.message);
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
        <Heading as="h2" size="lg" mb={4}>Leave Requests</Heading>
        {filteredLeaves.length > 0 ? (
          <Stack spacing={4} maxW="md" w="full">
            {filteredLeaves.map((leave) => (
              <LeaveCard 
                key={leave._id} 
                data={leave} 
                onStatusChange={handleStatusChange} 
              />
            ))}
          </Stack>
        ) : (
          <Text fontSize="xl" color="gray.600">No leaves found.</Text>
        )}
      </Flex>
    </>
  );
};

export default LeavePage;
