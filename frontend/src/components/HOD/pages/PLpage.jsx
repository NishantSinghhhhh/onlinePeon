import React, { useEffect, useState } from 'react';
import HodNavbar from './navbar';
import PLCard from '../../cards/PLCard'; // Updated import
import { Box, Flex, Spinner, Text, Button } from '@chakra-ui/react';
import axios from 'axios';

const PLpage = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPLs = async () => {
      try {
        const response = await axios.get('http://localhost:8000/fetchAll/fetchAllPLs');
        console.log('Fetched PL data:', response.data);

        if (response.data && response.data.success) {
          setLeaves(response.data.data || []);
          filterAndSortPLs(response.data.data || []);
        } else {
          setError('Failed to fetch PLs.');
        }
      } catch (error) {
        console.error('Error fetching PLs:', error);
        setError('An error occurred while fetching PLs.');
      } finally {
        setLoading(false);
      }
    };

    fetchPLs();
  }, []);

  const filterAndSortPLs = (pls) => {
    try {
      const loginInfo = JSON.parse(localStorage.getItem('loginInfo') || '{}');
  
      if (!loginInfo || !loginInfo.branchAssigned) {
        setError('Login information or branch assignment is missing.');
        return;
      }
  
      const { branchAssigned } = loginInfo;
  
      const filtered = pls.filter(pl => 
        pl.className && 
        pl.className.toLowerCase().includes(branchAssigned.toLowerCase()) &&
        pl.extraDataArray && 
        pl.extraDataArray[0] === 1 && // Ensure extraDataArray[0] === 1
        pl.extraDataArray[1] !== 1 // Exclude if extraDataArray[1] === 1
      );
  
      const sorted = filtered.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  
      setFilteredLeaves(sorted);
    } catch (error) {
      console.error('Error in filterAndSortPLs:', error);
      setError('An error occurred while processing PLs.');
    }
  };

  const handleStatusChange = async (plId, status) => {
    try {
      const position = 1; // This can be modified as necessary
  
      const response = await axios.put(`http://localhost:8000/update/updatePL/${plId}`, {
        status,
        position,
      });
  
      if (response.data && response.data.success) {
        console.log('PL updated successfully:', response.data);
        setFilteredLeaves(prevPLs =>
          prevPLs.map(pl =>
            pl._id === plId ? { ...pl, status } : pl
          )
        );
      } else {
        console.error('Failed to update:', response.data ? response.data.message : 'Unknown error');
      }
    } catch (error) {
      console.error('Error updating PL:', error.message);
    }
  };

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
          <Flex direction="column" align="center" justify="center" height="100vh">
            <Text color="red.500">{error}</Text>
            <Button colorScheme="teal" onClick={() => window.location.reload()}>Try Again</Button>
          </Flex>
        ) : (
          <Box>
            {filteredLeaves.length > 0 ? (
              filteredLeaves.map((leave) => (
                <PLCard
                  key={leave._id}
                  data={leave}
                  onStatusChange={handleStatusChange} // Pass the status change handler
                />
              ))
            ) : (
              <Text>No permitted leaves found.</Text>
            )}
          </Box>
        )}
      </Box>
    </div>
  );
};

export default PLpage;
