import { useState, useEffect, useContext } from 'react';
import { useToast } from '@chakra-ui/react';
import { StudentLoginContext } from '../context/StudentContext';
import useFetchRegistration from '../hooks/StudentInfo';
import { useNavigate } from 'react-router-dom';

const useSos = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    registrationNumber: '',
    rollNumber: '',
    reasonForLeave: 'SOS Emergency Leave', // Predefined reason for SOS
    startDate: new Date(), // Start date is set to the current date
    endDate: new Date(new Date().setDate(new Date().getDate() + 14)), // End date is 14 days from now
    placeOfResidence: 'SOS', // Place of residence set to 'SOS'
    attendancePercentage: '90', // Attendance percentage set to 90
    contactNumber: '',
    className: '',
    extraDataArray: [1, 1, 1, 1], // SOS specific data
  });

  const { loginInfo } = useContext(StudentLoginContext);
  const regnNum = loginInfo.registrationNumber;
  const { data, loading } = useFetchRegistration(regnNum);

  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && data) {
      const [firstName, ...lastNameParts] = data.name.split(' ');
      const lastName = lastNameParts.join(' ');
      
      setFormData(prevData => ({
        ...prevData,
        firstName,
        lastName,
        registrationNumber: data.registrationNumber,
        rollNumber: data.rollNumber,
        contactNumber: data.fatherPhoneNumber,
        className: data.class,
        startDate: new Date(), // Reset start date to current date on data load
        endDate: new Date(new Date().setDate(new Date().getDate() + 14)), // End date is 14 days from current date
        placeOfResidence: 'SOS', // Reset placeOfResidence to 'SOS'
        attendancePercentage: '90', // Reset attendancePercentage to '90'
      }));
    }
  }, [loading, data]);

  // Function to handle the SOS submission
  const handleSosSubmit = async () => {
    try {
      // Prepare data with current state
      const { startDate, endDate, ...otherFormData } = formData;
      const isoStartDate = startDate.toISOString();
      const isoEndDate = endDate.toISOString();

      // API call for leave submission
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...otherFormData,
          startDate: isoStartDate,
          endDate: isoEndDate,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        handleError(errorData.message || 'An error occurred during SOS submission');
        return;
      }

      const result = await response.json();
      if (result.success) {
        // await sendLeaveMessageToParents(); // Notify teachers/parents
        await sendLeaveMessageToTeachers(); // Notify teachers/parents
        handleSuccess(result.message);
        setTimeout(() => navigate('/Home'), 1000);
      } else {
        handleError(result.message || 'An error occurred during SOS submission');
      }
    } catch (err) {
      handleError('An unexpected error occurred during SOS submission.');
    }
  };


  
  const sendLeaveMessageToTeachers = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/Message/sendSOS`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contactNumber: formData.contactNumber,
          studentName: `${formData.firstName} ${formData.lastName}`,
          reasonForLeave: formData.reasonForLeave,
          startDate: formData.startDate.toISOString(),
          endDate: formData.endDate.toISOString(),
          placeOfResidence: formData.placeOfResidence,
          attendancePercentage: formData.attendancePercentage,
          className: formData.className
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server response error:', errorData);
        handleError(errorData.message || 'An error occurred while sending message to teachers');
        return;
      }

      const result = await response.json();
      handleSuccess(result.message);
    } catch (err) {
      console.error('Fetch error:', err);
      handleError('An unexpected error occurred while sending message to teachers.');
    }
  };

  const handleError = (message) => {
    toast({
      title: 'Error',
      description: message,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  };

  const handleSuccess = (message) => {
    toast({
      title: 'Success',
      description: message,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  return {
    formData, 
    handleSosSubmit, 
    setFormData, 
  };
};

export default useSos;
// testing the hook