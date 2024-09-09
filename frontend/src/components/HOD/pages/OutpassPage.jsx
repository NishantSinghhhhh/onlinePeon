import React, { useEffect, useState } from 'react';
import HodNavbar from './navbar';
import OutpassCard from '../../cards/outpassCard'; // Import the OutpassCard component
import { Box, Text } from '@chakra-ui/react';

const OutpassPage = () => {
  const [outpasses, setOutpasses] = useState([]);

  useEffect(() => {
    const fetchOutpasses = async () => {
      try {
        const response = await fetch('http://localhost:8000/fetchAll/fetchAllOutpasses');
        const result = await response.json();

        if (result.success) {
          setOutpasses(result.data);
          console.log('All Outpasses:', result.data);  // Console log the fetched outpasses
        } else {
          console.error('Failed to fetch outpasses');
        }
      } catch (error) {
        console.error('Error fetching outpasses:', error);
      }
    };

    fetchOutpasses();
  }, []);

  return (
    <div>
      <HodNavbar />
      <Box p={5}>
        <Text fontSize="2xl" fontWeight="bold" mb={4}>Outpass Requests</Text>
        {outpasses.length > 0 ? (
          outpasses.map((outpass) => (
            <OutpassCard key={outpass._id} data={outpass} />
          ))
        ) : (
          <Text>No outpasses found.</Text>
        )}
      </Box>
    </div>
  );
};

export default OutpassPage;
