import React, { useEffect, useState } from 'react';
import HodNavbar from './navbar';
import LeaveCard from '../../cards/LeaveCard';
import { Box, Flex, Spinner, Text, Button } from '@chakra-ui/react';
import axios from 'axios';

const LeavePage = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await axios.get('http://localhost:8000/fetchAll/fetchAllLeaves');
        console.log('Fetched leaves data:', response.data);

        if (response.data && response.data.success) {
          setLeaves(response.data.data || []);
          filterAndSortLeaves(response.data.data || []);
        } else {
          setError('Failed to fetch leaves.');
        }
      } catch (error) {
        console.error('Error fetching leaves:', error);
        setError('An error occurred while fetching leaves.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  const filterAndSortLeaves = (leaves) => {
    try {
      const loginInfo = JSON.parse(localStorage.getItem('loginInfo') || '{}');

      if (!loginInfo || !loginInfo.branchAssigned) {
        setError('Login information or branch assignment is missing.');
        return;
      }

      const { branchAssigned } = loginInfo;

      const filtered = leaves.filter(leave => 
        leave.className && 
        leave.className.toLowerCase().includes(branchAssigned.toLowerCase()) &&
        leave.extraDataArray && 
        leave.extraDataArray[0] === 1 &&  // Existing condition: extraDataArray[0] === 1
        !(leave.extraDataArray[0] === 1 && leave.extraDataArray[1] === 1 && leave.extraDataArray[2] === 0 && leave.extraDataArray[3] === 0) // Exclude leaves with [1,1,0,0]
      );

      const sorted = filtered.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

      setFilteredLeaves(sorted);
    } catch (error) {
      console.error('Error in filterAndSortLeaves:', error);
      setError('An error occurred while processing leaves.');
    }
  };

  const onStatusChange = async (leaveId, status) => {
    try {
      const position = 1; // This can be modified as necessary

      const response = await axios.put(`http://localhost:8000/update/updateLeave/${leaveId}`, {
        status,
        position,
      });

      if (response.data && response.data.success) {
        console.log('Leave updated successfully:', response.data);
        setFilteredLeaves(prevLeaves =>
          prevLeaves.map(leave =>
            leave._id === leaveId ? { ...leave, status } : leave
          )
        );
      } else {
        console.error('Failed to update:', response.data ? response.data.message : 'Unknown error');
      }
    } catch (error) {
      console.error('Error updating leave:', error.message);
    }
  };

  return (
    <div>
      <HodNavbar />
      <Box p={4}>
        <Text fontSize="2xl" mb={4}>Leave Page</Text>
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
                <LeaveCard
                  key={leave._id}
                  data={leave}
                  onStatusChange={onStatusChange}
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

export default LeavePage;
