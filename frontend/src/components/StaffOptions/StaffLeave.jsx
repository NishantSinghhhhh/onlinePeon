import React, { useEffect, useState } from 'react';
import { Box, Stack, Heading, Text, Flex, Alert, AlertIcon, Button } from '@chakra-ui/react';
import StaffNavbar from '../StaffNavbar/StaffNavbar';
import LeaveCard from '../cards/LeaveCard';
import { HashLoader } from 'react-spinners';

const StaffLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLoader, setShowLoader] = useState(true);

  const fetchLeaveData = async (classAssigned) => {
    try {
      console.log('Initiating fetchLeaveData function');
      console.log('Class assigned to fetch:', classAssigned);

      const leaveResponse = await fetch(`http://localhost:8000/fetch/fetchLeaves/${classAssigned}`);

      console.log('Response received from the server');
      console.log('Response status code:', leaveResponse.status);
      console.log('Response URL:', leaveResponse.url);

      if (!leaveResponse.ok) {
        console.log('Response status not OK:', leaveResponse.status);
        const errorText = await leaveResponse.text();
        console.error('Error details from server:', errorText);
        throw new Error('Failed to fetch leaves');
      }

      console.log('Parsing JSON from response');
      const leaveData = await leaveResponse.json();

      console.log('JSON parsing successful');
      console.log('Fetched leave data:', leaveData);

      return leaveData;
    } catch (error) {
      console.error('Error encountered during fetch:', error.message);
      console.error('Stack trace:', error.stack);
      throw error;
    }
  };

  useEffect(() => {
    const fetchTeacherAndLeaves = async () => {
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
          const leaveData = await fetchLeaveData(classAssigned);
          setLeaves(leaveData.data || []);
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

    fetchTeacherAndLeaves();

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
        <Heading as="h2" size="lg" mb={4}>Leave Details</Heading>
        {leaves.length > 0 ? (
          <Stack spacing={4} maxW="md" w="full">
            {leaves.map((leave, index) => (
              <LeaveCard key={index} data={leave} />
            ))}
          </Stack>
        ) : (
          <Text fontSize="xl" color="gray.600">No Pending Leaves are Present</Text>
        )}
      </Flex>
    </>
  );
};

export default StaffLeave;
