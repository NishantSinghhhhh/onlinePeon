import React, { useEffect, useState } from 'react';
import { Box, Stack, Heading, Text, Flex, Alert, AlertIcon, Button } from '@chakra-ui/react';
import StaffNavbar from '../StaffNavbar/StaffNavbar';
import OutpassCard from '../cards/outpassCard';
import { HashLoader } from 'react-spinners';
import axios from 'axios';
import useEditLeave from '../../hooks/useEdit'; // Adjust the path as necessary

const StaffOutpass = () => {
  const [outpasses, setOutpasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLoader, setShowLoader] = useState(true);
  
  // State to manage the current editing outpass
  const [editingOutpassId, setEditingOutpassId] = useState(null);
  const [editedData, setEditedData] = useState({});

  const fetchOutpass = async (classAssigned) => {
    try {
      const outpassResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/fetch/teachers/fetchOutpasses/${classAssigned}`);
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
        const teacherResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/fetch/fetchTeacher/${staffId}`);
        if (!teacherResponse.ok) throw new Error('Failed to fetch teacher data');
        const teacherData = await teacherResponse.json();

        const classAssigned = teacherData.teacher?.classAssigned;
        if (classAssigned) {
          const outpassData = await fetchOutpass(classAssigned);
          setOutpasses(outpassData.data || []);
        } else {
          setError('No class assigned for the teacher.');
        }
      } catch (err) {
        console.error('Fetch Teacher or Outpass Error:', err);
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

      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/update/updateOutpass/${outpassId}`, {
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

  // Use the hook at the top level of the component
  // Use the hook at the top level of the component
  
  // const handleEditSubmit = async (outpassId, updatedData) => {
  //   try {
  //     // Set the outpass ID for editing in the hook
  //     setEditingOutpassId(outpassId);
      
  //     // Update the form data in the hook
  //     setFormData(updatedData);
  //     // console.log('Edited data stored:', {
  //     //   outpassId, // This logs the outpass ID
  //     //   updatedData // This logs the updated data
  //     // });
      
  //     await editOutpass();
      
  //     setEditedData(prevData => ({
  //       ...prevData,
  //       [outpassId]: updatedData
  //     }));
      
  //   } catch (error) {
  //     console.error('Failed to edit outpass:', error);
  //   }
  // };

  // const { handleEditSubmit: editOutpass, setFormData } = useEditLeave(editingOutpassId, editedData[editingOutpassId]);


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
            {filteredOutpasses.map((outpass) => (
              <OutpassCard 
                key={outpass._id} 
                data={outpass} 
                onStatusChange={handleStatusChange} 
                // onEdit={handleEditSubmit} 
              />
            ))}
          </Stack>
        ) : (
          <Text fontSize="xl" color="gray.600">No live outpasses are there.</Text>
        )}
        <Button 
          onClick={() => console.log('All edited data:', editedData)} 
          colorScheme="blue" 
          mt={4}
        >
          Log All Edits
        </Button>
      </Flex>
    </>
  );
};

export default StaffOutpass;
