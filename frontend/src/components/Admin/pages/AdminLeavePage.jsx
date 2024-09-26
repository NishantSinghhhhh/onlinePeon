import React, { useEffect, useState } from 'react';
import { Box, Stack, Heading, Text, Flex, Alert, AlertIcon, Button } from '@chakra-ui/react';
import AdminNavbar from './AdminNavbar';
import LeaveCard from '../../cards/LeaveCard'; // Assuming you have a LeaveCard component
import { HashLoader } from 'react-spinners';
import axios from 'axios';

const AdminLeavePage = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLoader, setShowLoader] = useState(true);

  const fetchLeaves = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/fetchAll/fetchAllLeaves`);
      if (!response.ok) throw new Error('Failed to fetch leaves');
      const result = await response.json();

      if (result.success) {
        setLeaves(result.data);
        console.log('All Leaves:', result.data);
        filterAndSortLeaves(result.data);
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
    // Apply your filtering criteria here
    const filtered = leaves.filter(leave =>
      JSON.stringify(leave.extraDataArray) === JSON.stringify([1, 1, 1, 0])
    );

    console.log('Filtered Leaves:', filtered);

    // Sort leaves by date, descending
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

      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/update/updateLeave/${leaveId}`, {
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
      <AdminNavbar />
      <Flex direction="column" align="center" justify="center" p={5}>
        <Heading as="h2" size="lg" mb={4}>Admin Leave Requests</Heading>
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

export default AdminLeavePage;
