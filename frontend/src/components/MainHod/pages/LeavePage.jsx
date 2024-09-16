import React, { useEffect, useState, useContext } from 'react';
import { Box, Stack, Heading, Text, Flex, Alert, AlertIcon, Button } from '@chakra-ui/react';
import HodNavbar from './navbar';
import LeaveCard from '../../cards/LeaveCard';
import { HashLoader } from 'react-spinners';
import axios from 'axios';
import { LoginContext } from '../../../context/LoginContext';

const LeavePage = () => {
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
        console.log('Class of the User:', loginInfo.classAssigned);
        console.log('Branch of the User:', loginInfo.branchAssigned);
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
    // Ensure only HODs can access this page
    if (!loginInfo.position || loginInfo.position.toLowerCase() !== 'hod') {
      setError('Unauthorized access. Only HODs can view this page.');
      return;
    }
  
    const assignedBranch = loginInfo.branchAssigned;
  
    const filtered = leaves.filter(leave => {
      const leaveBranch = extractBranchFromClassName(leave.className); // Extract branch from className
  
      // Check if the branch in the className matches the assignedBranch and exclude FE students
      if (leaveBranch === assignedBranch && !leave.className.toLowerCase().includes('fe')) {
        
        // Apply the logic for extraDataArray
        const extraDataArray = JSON.stringify(leave.extraDataArray);
        
        // Include leaves with extraDataArray === [1, 0, 0, 0] and exclude other combinations
        return extraDataArray === JSON.stringify([1, 0, 0, 0]);
      }
  
      return false;
    });
  
    console.log('Filtered Leaves:', filtered);
  
    const sorted = filtered.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  
    setFilteredLeaves(sorted);
  };
  
  // Helper function to extract the branch from className
  const extractBranchFromClassName = (className) => {
    // Extract the branch part from className, assuming it's in the format SE-<BRANCH>-B
    const parts = className.split('-');
    return parts.length > 1 ? parts[1] : '';
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
      console.log(`Sending update request for leave ${leaveId} with status ${status}`);
  
      const position = 1; // Static value for HOD
      
      const response = await axios.put(`https://online-peon.vercel.app/update/updateLeave/${leaveId}`, {
        status,
        position,
      });
  
      if (response.data && response.data.success) {
        console.log('Leave updated successfully:', response.data);
        
        // Remove the leave from filteredLeaves and leaves state
        setFilteredLeaves(prevLeaves =>
          prevLeaves.filter(leave => leave._id !== leaveId)
        );
        setLeaves(prevLeaves =>
          prevLeaves.filter(leave => leave._id !== leaveId)
        );
      } else {
        console.error('Failed to update:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating leave:', error.message);
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

export default LeavePage;
