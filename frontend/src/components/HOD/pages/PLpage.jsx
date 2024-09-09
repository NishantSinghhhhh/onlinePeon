import React, { useEffect, useState } from 'react';
import HodNavbar from './navbar';
import PLCard from '../../cards/PLCard'; // Import the PLCard component
import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import axios from 'axios';

const PLpage = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await axios.get('http://localhost:8000/fetchAll/fetchAllPLs');
        
        // Log the response data for debugging
        console.log('Fetched leaves data:', response.data);

        if (response.data.success) {
          setLeaves(response.data.data);
        } else {
          setError('Failed to fetch leaves.');
        }
      } catch (error) {
        setError('An error occurred while fetching leaves.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  return (
    <div>
      <HodNavbar />
      <Box p={4}>
        <Text fontSize="2xl" mb={4}>Permitted Leave Page</Text>
        {loading ? (
          <Flex justify="center" align="center" height="100vh">
            <Spinner size="lg" />
          </Flex>
        ) : error ? (
          <Text color="red.500">{error}</Text>
        ) : (
          <Box>
            {leaves.length > 0 ? (
              leaves.map((leave) => (
                <PLCard
                  key={leave._id}
                  data={leave}
                />
              ))
            ) : (
              <Text>No leaves found.</Text>
            )}
          </Box>
        )}
      </Box>
    </div>
  );
};

export default PLpage;
