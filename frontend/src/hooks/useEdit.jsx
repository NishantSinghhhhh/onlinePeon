import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
// import { StudentLoginContext } from '../context/StudentContext';
// import useFetchRegistration from '../hooks/StudentInfo';
import { useNavigate } from 'react-router-dom';

const useEditLeave = (leaveId) => {
  const [formData, setFormData] = useState({
    date: new Date(), // Default to current date
    startHour: '', // Placeholder for start hour
    endHour: '', // Placeholder for end hour
  });

//   const { loginInfo } = useContext(StudentLoginContext);
//   const regnNum = loginInfo.registrationNumber;
//   const { data, loading } = useFetchRegistration(regnNum);

  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
   
  const handleEditSubmit = async () => {
    try {
      const { date, startHour, endHour } = formData;
      const isoDate = date.toISOString();

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/leave/${leaveId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: isoDate,
          startHour,
          endHour,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        handleError(errorData.message || 'An error occurred during leave edit submission');
        return;
      }

      const result = await response.json();
      if (result.success) {
        handleSuccess(result.message);
        setTimeout(() => navigate('/Home'), 1000);
      } else {
        handleError(result.message || 'An error occurred during leave edit submission');
      }
    } catch (err) {
      handleError('An unexpected error occurred during leave edit submission.');
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
    setFormData,
    handleEditSubmit,
  };
})

};

export default useEditLeave;
