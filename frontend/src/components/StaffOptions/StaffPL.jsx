import React, { useEffect, useState } from 'react';
import { Box, Stack, Heading, Text, Flex, Alert, AlertIcon, Button } from '@chakra-ui/react';
import StaffNavbar from '../StaffNavbar/StaffNavbar';
import PLCard from '../cards/PLCard'; // Assuming PLCard accepts a data prop
import { HashLoader } from 'react-spinners';

const StaffPL = () => {
  const [plData, setPlData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLoader, setShowLoader] = useState(true);

  // Function to fetch and filter PL data
  const fetchPL = async (classAssigned) => {
    try {
      console.log('Initiating fetchPL function');
      console.log('Class assigned to fetch:', classAssigned);

      const plResponse = await fetch(`http://localhost:8000/fetch/fetchPLs/${classAssigned}`);

      console.log('Response received from the server');
      console.log('Response status code:', plResponse.status);
      console.log('Response URL:', plResponse.url);

      if (!plResponse.ok) {
        console.log('Response status not OK:', plResponse.status);
        const errorText = await plResponse.text();
        console.error('Error details from server:', errorText);
        throw new Error('Failed to fetch PL data');
      }

      console.log('Parsing JSON from response');
      const plData = await plResponse.json();

      console.log('JSON parsing successful');
      console.log('Fetched PL data:', plData);

      // Apply filter here
      const filteredPLData = plData.data.filter(pl => pl.extraDataArray[0] === 0);

      return filteredPLData;
    } catch (error) {
      console.error('Error encountered during fetch:', error.message);
      console.error('Stack trace:', error.stack);
      throw error;
    }
  };

  useEffect(() => {
    const fetchTeacherAndPL = async () => {
      const loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
      if (!loginInfo) {
        setError('No login information found. Please log in again.');
        setLoading(false);
        setShowLoader(false);
        return;
      }

      const { staffId } = loginInfo;

      try {
        const teacherResponse = await fetch(`http://localhost:8000/fetch/fetchTeacher/${staffId}`);
        const teacherData = await teacherResponse.json();

        if (!teacherResponse.ok) {
          throw new Error(teacherData.message || 'Failed to fetch teacher information');
        }

        const classAssigned = teacherData.teacher?.classAssigned;
        if (classAssigned) {
          const plData = await fetchPL(classAssigned);
          setPlData(plData || []);
        } else {
          setError('No class assigned for the teacher.');
        }
      } catch (err) {
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
        setShowLoader(false);
      }
    };

    fetchTeacherAndPL();

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
      <StaffNavbar />
      <Flex direction="column" align="center" justify="center" p={5}>
        <Heading as="h2" size="lg" mb={4}>PL Details</Heading>
        {plData.length > 0 ? (
          <Stack spacing={4} maxW="md" w="full">
            {plData.map((pl, index) => (
              <PLCard key={index} data={pl} />
            ))}
          </Stack>
        ) : (
          <Text fontSize="xl" color="gray.600">No Pending PL are Present</Text>
        )}
      </Flex>
    </>
  );
};

export default StaffPL;
