import React, { useEffect, useState, useContext } from 'react';
import { Box, Stack, Heading, Text, Flex, Alert, AlertIcon, Button } from '@chakra-ui/react';
import HodNavbar from './navbar';
import LeaveCard from '../../cards/LeaveCard';
import { HashLoader } from 'react-spinners';
import axios from 'axios';
import { LoginContext } from '../../../context/LoginContext';

const LeaveRequestPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLoader, setShowLoader] = useState(true);

  const { loginInfo } = useContext(LoginContext);

  const fetchLeaves = async () => {
    try {
      const response = await fetch('https://online-peon.vercel.app/fetchAll/fetchAllLeaves');
      if (!response.ok) throw new Error('Failed to fetch leaves');
      const result = await response.json();

      if (result.success) {
        setLeaves(result.data);
        console.log('All Leaves:', result.data);
        filterAndSortLeaves(result.data);

        console.log('Logged in as:', loginInfo.name);
        console.log('User Position:', loginInfo.position);
        console.log('Class of the User', loginInfo.classAssigned);
        console.log('Branch of the User', loginInfo.branchAssigned);
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
    if (!loginInfo.position || loginInfo.position.toLowerCase() !== 'warden') {
      setError('Unauthorized access. Only wardens can view this page.');
      return;
    }
  
    const extractClassLevel = (className) => {
      if (!className) return null;
      const match = className.match(/(FE|SE|TE|BE)/);
      return match ? match[0] : null;
    };
  
    const assignedClassLevel = extractClassLevel(loginInfo.classAssigned);
  
    const filtered = leaves.filter(leave => {
      const leaveClassLevel = extractClassLevel(leave.className);
      const extraDataArray = JSON.stringify(leave.extraDataArray);
      
      // Exclude leaves with extraDataArray values of [1,1,1,0] or [1,1,-1,0]
      return leaveClassLevel === assignedClassLevel &&
             extraDataArray === JSON.stringify([1, 1, 0, 0]) &&
             ![JSON.stringify([1, 1, 1, 0]), JSON.stringify([1, 1, -1, 0])].includes(extraDataArray);
    });
  
    console.log('Filtered Leaves:', filtered);
  
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
      const position = 2;  // Assuming 2 is for Warden
      const newExtraDataArray = [1, 1, status === 'approved' ? 1 : -1, 0];

      const response = await axios.put(`https://online-peon.vercel.app/update/updateLeave/${leaveId}`, {
        status,
        position,
        extraDataArray: newExtraDataArray
      });

      if (response.data && response.data.success) {
        console.log('Leave updated successfully:', response.data);
        setFilteredLeaves(prevLeaves =>
          prevLeaves.map(leave =>
            leave._id === leaveId ? { ...leave, status, extraDataArray: newExtraDataArray } : leave
          )
        );
      } else {
        console.error('Failed to update:', response.data ? response.data.message : 'No message');
      }
    } catch (error) {
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
          <Text fontSize="xl" color="gray.600">No leave requests found.</Text>
        )}
      </Flex>
    </>
  );
};

export default LeaveRequestPage;