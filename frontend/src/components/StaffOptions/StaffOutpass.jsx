import React, { useEffect, useState } from 'react';
import { Box, Stack, Heading, Text, Flex, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import StaffNavbar from '../StaffNavbar/StaffNavbar';
import OutpassCard from '../cards/outpassCard';

const StaffOutpass = () => {
  const [outpasses, setOutpasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLoader, setShowLoader] = useState(true);

  const fetchOutpass = async (classAssigned) => {
    try {
      console.log('Fetching outpasses for class:', classAssigned); // Debug log

      // Fetch outpasses using the correct URL pattern
      const outpassResponse = await fetch(`http://localhost:8000/fetch/fetchOutpasses/${classAssigned}`);

      console.log('Response status:', outpassResponse.status); // Debug log
      console.log('Response URL:', outpassResponse.url); // Debug log
      
      // Check if the response is OK
      if (!outpassResponse.ok) {
        const errorText = await outpassResponse.text(); // Get response text for debugging
        console.error('Response error text:', errorText); // Debug log
        throw new Error('Failed to fetch outpasses');
      }

      // Parse the response data
      const outpassData = await outpassResponse.json();
      console.log('Fetched outpass data:', outpassData); // Debug log
      
      return outpassData; // Return the fetched data
    } catch (error) {
      console.error('Error fetching outpasses:', error.message); // Log any errors
      throw error; // Re-throw the error for handling in the calling code
    }
  };

  useEffect(() => {
    const fetchTeacherAndOutpasses = async () => {
      const loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
      if (!loginInfo) {
        setError('No login information found. Please log in again.');
        setLoading(false);
        setShowLoader(false);
        return;
      }

      const { staffId } = loginInfo;

      try {
        // Fetch teacher information using staff ID
        const teacherResponse = await fetch(`http://localhost:8000/fetch/fetchTeacher/${staffId}`);
        const teacherData = await teacherResponse.json();

        if (!teacherResponse.ok) {
          throw new Error(teacherData.message || 'Failed to fetch teacher information');
        }

        // Extract classAssigned from teacher data
        const classAssigned = teacherData.teacher?.classAssigned;
        if (classAssigned) {
          // Fetch outpasses for the class
          const outpassData = await fetchOutpass(classAssigned);
          setOutpasses(outpassData.data || []);
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

    fetchTeacherAndOutpasses();

    // Ensure loader is shown for at least 2 seconds
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading || showLoader) {
    return (
      <Flex direction="column" align="center" justify="center" p={5} minH="100vh">
        <Spinner size="xl" />
        <Text mt={4}>Loading...</Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex direction="column" align="center" justify="center" p={5} minH="100vh">
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Flex>
    );
  }

  return (
    <>
      <StaffNavbar />
      <Flex direction="column" align="center" justify="center" p={5}>
        <Heading as="h2" size="lg" mb={4}>Outpass Details</Heading>
        {outpasses.length > 0 ? (
          <Stack spacing={4} maxW="md" w="full">
            {outpasses.map((outpass, index) => (
              <OutpassCard key={index} data={outpass} />
            ))}
          </Stack>
        ) : (
          <Text>No outpasses found.</Text>
        )}
      </Flex>
    </>
  );
};

export default StaffOutpass;
