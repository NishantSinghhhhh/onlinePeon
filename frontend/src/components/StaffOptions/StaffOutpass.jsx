import React, { useEffect, useState } from 'react';
import { Box, Stack, Heading, Text, Flex, Alert, AlertIcon, Button } from '@chakra-ui/react';
import StaffNavbar from '../StaffNavbar/StaffNavbar';
import OutpassCard from '../cards/outpassCard';
import { HashLoader } from 'react-spinners';

const StaffOutpass = () => {
  const [outpasses, setOutpasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLoader, setShowLoader] = useState(true);

  const fetchOutpass = async (classAssigned) => {
    try {
      console.log('Initiating fetchOutpass function');
      console.log('Class assigned to fetch:', classAssigned);

      const outpassResponse = await fetch(`http://localhost:8000/fetch/fetchOutpasses/${classAssigned}`);

      console.log('Response received from the server');
      console.log('Response status code:', outpassResponse.status);
      console.log('Response URL:', outpassResponse.url);

      if (!outpassResponse.ok) {
        console.log('Response status not OK:', outpassResponse.status);
        const errorText = await outpassResponse.text();
        console.error('Error details from server:', errorText);
        throw new Error('Failed to fetch outpasses');
      }

      console.log('Parsing JSON from response');
      const outpassData = await outpassResponse.json();

      console.log('JSON parsing successful');
      console.log('Fetched outpass data:', outpassData);

      return outpassData;
    } catch (error) {
      console.error('Error encountered during fetch:', error.message);
      console.error('Stack trace:', error.stack);
      throw error;
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
        const teacherResponse = await fetch(`http://localhost:8000/fetch/fetchTeacher/${staffId}`);
        const teacherData = await teacherResponse.json();

        if (!teacherResponse.ok) {
          throw new Error(teacherData.message || 'Failed to fetch teacher information');
        }
        const classAssigned = teacherData.teacher?.classAssigned;
        if (classAssigned) {
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
        <Heading as="h2" size="lg" mb={4}>Outpass Details</Heading>
        {outpasses.length > 0 ? (
          <Stack spacing={4} maxW="md" w="full">
            {outpasses.map((outpass, index) => (
              <OutpassCard key={index} data={outpass} />
            ))}
          </Stack>
        ) : (
          <Text fontSize="xl" color="gray.600">No Pending Outpasses are Present</Text>
        )}
      </Flex>
    </>
  );
};

export default StaffOutpass;
