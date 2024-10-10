import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const useEditLeave = (outpassId) => {
  const [formData, setFormData] = useState({
    date: new Date(), // Default to current date
    startHour: '', // Placeholder for start hour
    endHour: '', // Placeholder for end hour
  });

  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Log the outpassId coming from StaffOutpass
    console.log('Editing outpass with ID:', outpassId);

    // You can fetch existing leave data based on outpassId here if necessary
  }, [outpassId]);

  const handleEditSubmit = async () => {
    try {
      const { date, startHour, endHour } = formData;
      const isoDate = date.toISOString();

      // Include the outpassId in the API endpoint
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/edit/editOutpass/${outpassId}`, {
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
        handleError(errorData.message || 'An error occurred during outpass edit submission');
        return;
      }

      const result = await response.json();
      if (result.success) {
        handleSuccess(result.message);
        setTimeout(() => navigate('/Home'), 1000);
      } else {
        handleError(result.message || 'An error occurred during outpass edit submission');
      }
    } catch (err) {
      handleError('An unexpected error occurred during outpass edit submission.');
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
};

export default useEditLeave;
// this thing exports useEditLeave
