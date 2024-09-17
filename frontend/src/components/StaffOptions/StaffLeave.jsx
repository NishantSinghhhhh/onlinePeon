import React, { useEffect, useState } from 'react';
import { Box, Stack, Heading, Text, Flex, Alert, AlertIcon, Button } from '@chakra-ui/react';
import StaffNavbar from '../StaffNavbar/StaffNavbar';
import LeaveCard from '../cards/LeaveCard'; // Assuming LeaveCard accepts onClick and onStatusChange props
import { HashLoader } from 'react-spinners';
import axios from 'axios';

const StaffLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLoader, setShowLoader] = useState(true);

  // Function to fetch leave data
  const fetchLeaveData = async (classAssigned) => {
    try {
      const leaveResponse = await fetch(`https://online-peon.vercel.app/fetch/teachers/fetchLeaves/${classAssigned}`);
      if (!leaveResponse.ok) {
        throw new Error('Failed to fetch leaves');
      }
      const leaveData = await leaveResponse.json();
      return leaveData;
    } catch (error) {
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
        const teacherResponse = await fetch(`https://online-peon.vercel.app/fetch/fetchTeacher/${staffId}`);
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

    // Set a delay to hide loader
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleStatusChange = async (leaveId, status) => {
    try {

      const position = 0;

      const response = await axios.put(`https://online-peon.vercel.app/update/updateLeave/${leaveId}`, {
        status,
        position,
      });

      if (response.data.success) {
        console.log('Outpass updated successfully:', response.data);
        setLeaves(prevOutpasses =>
          prevOutpasses.filter(outpass => outpass._id !== leaveId)
        );
      } else {
        console.error('Failed to update:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating outpass:', error.message);
    }
  };

  // Rendering states
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

  const filteredLeaves = leaves.filter(leave => leave.extraDataArray[0] === 0);

  return (
    <>
      <StaffNavbar />
      <Flex direction="column" align="center" justify="center" p={5}>
        <Heading as="h2" size="lg" mb={4}>Leave Details</Heading>
        {filteredLeaves.length > 0 ? (
          <Stack spacing={4} maxW="md" w="full">
            {filteredLeaves.map((leave, index) => (
              <LeaveCard 
                key={index} 
                data={leave} 
                onStatusChange={handleStatusChange} // Pass the function as a prop
              />
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
