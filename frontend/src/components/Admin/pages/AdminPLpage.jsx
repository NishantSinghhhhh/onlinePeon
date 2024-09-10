import React, { useEffect, useState } from 'react';
import { Box, Stack, Heading, Text, Flex, Alert, AlertIcon, Button } from '@chakra-ui/react';
import AdminNavbar from './AdminNavbar';
import PLCard from '../../cards/PLCard'; // Assuming you have a PLCard component
import { HashLoader } from 'react-spinners';
import axios from 'axios';

const AdminPLpage = () => {
  const [plRequests, setPlRequests] = useState([]);
  const [filteredPlRequests, setFilteredPlRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLoader, setShowLoader] = useState(true);

  const fetchPlRequests = async () => {
    try {
      const response = await fetch('http://localhost:8000/fetchAll/fetchAllPLs');
      if (!response.ok) throw new Error('Failed to fetch PL requests');
      const result = await response.json();

      if (result.success) {
        setPlRequests(result.data);
        console.log('All PL Requests:', result.data);
        filterAndSortPlRequests(result.data);
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

  const filterAndSortPlRequests = (requests) => {
    // Apply your filtering criteria here
    const filtered = requests.filter(request =>
      JSON.stringify(request.extraDataArray) === JSON.stringify([1, 1, 0, 0])
    );

    console.log('Filtered PL Requests:', filtered);

    // Sort requests by date, descending
    const sorted = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    setFilteredPlRequests(sorted);
  };

  const handleStatusChange = async (plId, status) => {
    try {
      const position = 3;  // Assuming 3 is for Admin
      const newExtraDataArray = [1, 1, status === 'approved' ? 1 : -1, 0];

      const response = await axios.put(`http://localhost:8000/update/updatePL/${plId}`, {
        status,
        position,
        extraDataArray: newExtraDataArray
      });

      if (response.data && response.data.success) {
        console.log('PL Request updated successfully:', response.data);
        // Update state to reflect the changes
        setFilteredPlRequests(prevRequests =>
          prevRequests.map(request =>
            request._id === plId ? { ...request, status, extraDataArray: newExtraDataArray } : request
          )
        );
        setPlRequests(prevRequests =>
          prevRequests.map(request =>
            request._id === plId ? { ...request, status, extraDataArray: newExtraDataArray } : request
          )
        );
      } else {
        console.error('Failed to update:', response.data ? response.data.message : 'No message');
      }
    } catch (error) {
      console.error('Error updating PL request:', error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    fetchPlRequests();

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
      <AdminNavbar />
      <Flex direction="column" align="center" justify="center" p={5}>
        <Heading as="h2" size="lg" mb={4}>Admin PL Requests</Heading>
        {filteredPlRequests.length > 0 ? (
          <Stack spacing={4} maxW="md" w="full">
            {filteredPlRequests.map((request) => (
              <PLCard 
                key={request._id} 
                data={request} 
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

export default AdminPLpage;
