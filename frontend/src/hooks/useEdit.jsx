import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const useEditLeave = (outpassId, data) => {
  const [formData, setFormData] = useState({
    date: data?.date ? new Date(data.date) : new Date(), // Default to current date or existing date
    startHour: data?.startHour || '', // Use existing start hour or empty string
    endHour: data?.endHour || '', // Use existing end hour or empty string
  });

  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Editing outpass with ID:', outpassId);
    if (data) {
      console.log('Date:', outpassId.date);
      console.log('Start Hour:', outpassId.startHour);
      console.log('End Hour:', outpassId.endHour);
    }

    // If data is passed, set formData
    if (data) {
      setFormData({
        date: data.date ? new Date(data.date) : new Date(),
        startHour: data.startHour || '',
        endHour: data.endHour || '',
        
      });
      console.log(data.date);
    }
  }, [outpassId, data]);

  const handleEditSubmit = async () => {
    console.log(data.date);
    
    if (!outpassId) {
      handleError('Outpass ID is required');
      return;
    }

    if (!formData.startHour || !formData.endHour) {
      handleError('Start hour and end hour are required');
      return;
    }

    try {
      const { date, startHour, endHour } = formData;
      const isoDate = date.toISOString();

      const payload = {
        outpassId,
        date: isoDate,
        startHour,
        endHour,
      };

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/edit/editOutpass`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        handleSuccess(result.message || 'Outpass updated successfully!');
        setTimeout(() => navigate('/StaffHome'), 1000);
      } else {
        const errorData = await response.json();
        handleError(errorData.message || 'An error occurred during outpass edit submission');
      }
    } catch (err) {
      console.error(err); // Log the error for debugging
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
      variant: 'subtle',
    });
  };

  return {
    formData,
    setFormData,
    handleEditSubmit,
  };
};

export default useEditLeave;
