import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchRegistration = (registrationNumber) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegistrationData = async () => {
      if (!registrationNumber) return;

      setLoading(true);
      setError(null);

      try {
      
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/fetch/fetchStudent/${registrationNumber}`);
        setData(response.data); // Expecting the API to return data in the format mentioned
      } catch (err) {
        setError(err.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrationData();
  }, [registrationNumber]);

  return { data, loading, error };
};

export default useFetchRegistration;
// for fetching user information.
// testing new branch