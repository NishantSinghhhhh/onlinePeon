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
      const response = await fetch('https://online-peon.vercel.app/fetchAll/fetchAllOutpasses');
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
        console.log('Branch Assigned:', loginInfo.branchAssigned);
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
    if (!loginInfo.position || loginInfo.position.toLowerCase() !== 'warden') {
      setError('Unauthorized access. Please log in with a Warden account.');
      return;
    }

    // Extract the class level (e.g., FE, SE, TE, BE) from the className string
    const extractClassLevel = (className) => {
      const match = className.match(/(FE|SE|TE|BE)/);
      return match ? match[0] : null;
    };

    const assignedClassLevel = extractClassLevel(loginInfo.classAssigned);
    const assignedBranch = loginInfo.branchAssigned;

    const filtered = outpasses.filter(outpass => {
      const outpassClassLevel = extractClassLevel(outpass.className);
      return outpassClassLevel === assignedClassLevel &&
             JSON.stringify(outpass.extraDataArray) === JSON.stringify([1, 1, 0, 0]);
    });

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
      const position = 2; // Assuming 2 is for Warden
      const newExtraDataArray = [1, 1, status === 'approved' ? 1 : -1, 0];

      console.log('Updating outpass with ID:', outpassId);
      console.log('Status:', status);
      console.log('Position:', position);
      console.log('New extraDataArray:', newExtraDataArray);

      const response = await axios.put(`https://online-peon.vercel.app/update/updateOutpass/${outpassId}`, {
        status,
        position,
        extraDataArray: newExtraDataArray
      });

      console.log('Backend response:', response.data);

      if (response.data.success) {
        console.log('Outpass updated successfully:', response.data);

        setFilteredOutpasses(prevOutpasses =>
          prevOutpasses.map(outpass =>
            outpass._id === outpassId 
              ? { ...outpass, status, extraDataArray: newExtraDataArray } 
              : outpass
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
