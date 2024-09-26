import React, { useEffect, useState } from 'react';
import { Box, Stack, Heading, Text, Flex, Alert, AlertIcon, Button } from '@chakra-ui/react';
import StaffNavbar from '../StaffNavbar/StaffNavbar';
import PLCard from '../cards/PLCard'; // Assuming PLCard accepts a data prop
import { HashLoader } from 'react-spinners';
import axios from 'axios';

const StaffPL = () => {
  const [plData, setPlData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLoader, setShowLoader] = useState(true);

  // Function to fetch and filter PL data
  const fetchPL = async (classAssigned) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/fetch/teachers/fetchPLs/${classAssigned}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch PL data');
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
        const teacherResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/fetch/fetchTeacher/${staffId}`);
        const teacherData = teacherResponse.data;

        if (teacherResponse.status !== 200) {
          throw new Error(teacherData.message || 'Failed to fetch teacher information');
        }

        const classAssigned = teacherData.teacher?.classAssigned;
        if (classAssigned) {
          const plData = await fetchPL(classAssigned);
          // Apply filter here
          const filteredPLData = plData.data.filter(pl => pl.extraDataArray[0] === 0);
          setPlData(filteredPLData || []);
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

  const handleStatusChange = async (plId, status) => {
    try {
      const position = 0; // Adjust this as needed

      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/update/updatePL/${plId}`, {
        status,
        position,
      });

      if (response.data.success) {
        console.log('PL updated successfully:', response.data);
        setPlData(prevPLData =>
          prevPLData.filter(pl => pl._id !== plId)
        );
      } else {
        console.error('Failed to update:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating PL:', error.message);
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
      <StaffNavbar />
      <Flex direction="column" align="center" justify="center" p={5}>
        <Heading as="h2" size="lg" mb={4}>PL Details</Heading>
        {plData.length > 0 ? (
          <Stack spacing={4} maxW="md" w="full">
            {plData.map((pl, index) => (
              <PLCard 
                key={index} 
                data={pl} 
                onStatusChange={handleStatusChange} 
              />
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
