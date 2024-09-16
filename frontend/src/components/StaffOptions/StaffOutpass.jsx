import React, { useEffect, useState } from 'react';
import { Box, Stack, Heading, Text, Flex, Alert, AlertIcon, Button } from '@chakra-ui/react';
import StaffNavbar from '../StaffNavbar/StaffNavbar';
import OutpassCard from '../cards/outpassCard';
import { HashLoader } from 'react-spinners';
import axios from 'axios';

const StaffOutpass = () => {
  const [outpasses, setOutpasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLoader, setShowLoader] = useState(true);

  const fetchOutpass = async (classAssigned) => {
    try {
      const outpassResponse = await fetch(`https://online-peon.vercel.app/fetch/fetchOutpasses/${classAssigned}`);
      if (!outpassResponse.ok) throw new Error('Failed to fetch outpasses');
      const outpassData = await outpassResponse.json();
      return outpassData;
    } catch (error) {
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
        const teacherResponse = await fetch(`https://online-peon.vercel.app/fetch/fetchTeacher/${staffId}`);
        const teacherData = await teacherResponse.json();
        if (!teacherResponse.ok) throw new Error(teacherData.message);

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

  const handleStatusChange = async (outpassId, status) => {
    try {

      const position = 0;

      const response = await axios.put(`https://online-peon.vercel.app/update/updateOutpass/${outpassId}`, {
        status,
        position,
      });

      if (response.data.success) {
        console.log('Outpass updated successfully:', response.data);
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

  const filteredOutpasses = outpasses.filter(outpass => outpass.extraDataArray[0] === 0);

  return (
    <>
      <StaffNavbar />
      <Flex direction="column" align="center" justify="center" p={5}>
        <Heading as="h2" size="lg" mb={4}>Outpass Details</Heading>
        {filteredOutpasses.length > 0 ? (
          <Stack spacing={4} maxW="md" w="full">
            {filteredOutpasses.map((outpass, index) => (
              <OutpassCard 
                key={index} 
                data={outpass} 
                onStatusChange={handleStatusChange} 
              />
            ))}
          </Stack>
        ) : (
          <Text fontSize="xl" color="gray.600">No live outpasses are there.</Text>
        )}
      </Flex>
    </>
  );
};

export default StaffOutpass;
