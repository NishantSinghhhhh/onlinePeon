import React, { useEffect, useState, useContext } from 'react';
import { Box, Stack, Heading, Text, Flex, Alert, AlertIcon, Button } from '@chakra-ui/react';
import HodNavbar from './navbar';
import OutpassCard from '../../cards/outpassCard';
import { HashLoader } from 'react-spinners';
import axios from 'axios';
import { LoginContext } from '../../../context/LoginContext'; // Import the context

const OutpassPage = () => {
  const [outpasses, setOutpasses] = useState([]);
  const [filteredOutpasses, setFilteredOutpasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLoader, setShowLoader] = useState(true);

  const { loginInfo } = useContext(LoginContext);

  const fetchOutpasses = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/fetchAll/fetchAllOutpasses`);
      if (!response.ok) throw new Error('Failed to fetch outpasses');
      const result = await response.json();

      if (result.success) {
        setOutpasses(result.data);
        console.log('All Outpasses:', result.data);
        filterAndSortOutpasses(result.data);

        console.log('Logged in as:', loginInfo.name);
        console.log('User Position:', loginInfo.position); // Log staff position
        console.log('Class of the User:', loginInfo.classAssigned);
        console.log('Branch Assigned:', loginInfo.branchAssigned);

        if (loginInfo.position.toLowerCase() === 'hod') {
          console.log('HOD Branch:', loginInfo.branchAssigned);
        }
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

  const extractBranchFromClassName = (className) => {
    const parts = className.split('-');
    return parts.length > 1 ? parts[1] : null;
  };

  const filterAndSortOutpasses = (outpasses) => {
    if (!loginInfo.position || loginInfo.position.toLowerCase() !== 'hod') {
      setError('Unauthorized access. Only HODs can view this page.');
      return;
    }
  
    const assignedBranch = loginInfo.branchAssigned;
    let filtered;
  
    // Check if the position is HOD and the branch is ASGE
    if (assignedBranch === 'ASGE') {
      // Include all outpasses with "FE" in the class name
      filtered = outpasses.filter(outpass => outpass.className.toLowerCase().includes('fe'));
    } else {
      // HOD but not from ASGE
      filtered = outpasses.filter(outpass => {
        const outpassBranch = extractBranchFromClassName(outpass.className);
        return outpassBranch === assignedBranch && 
               !outpass.className.toLowerCase().includes('fe'); // Exclude "fe"
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
      console.log(`Sending update request for outpass ${outpassId} with status ${status}`);
      const position = 1; // Static value

      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/update/updateOutpass/${outpassId}`, {
        status,
        position,
      });

      if (response.data.success) {
        console.log('Outpass updated successfully:', response.data);
        setFilteredOutpasses(prevOutpasses =>
          prevOutpasses.filter(outpass => outpass._id !== outpassId)
        );
        setOutpasses(prevOutpasses =>
          prevOutpasses.filter(outpass => outpass._id !== outpassId)
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
