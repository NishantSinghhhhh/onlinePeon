import React, { useState, useEffect } from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel, Box, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, FormControl, FormLabel, Input, Spinner } from '@chakra-ui/react';
import AdminNavbar from './AdminNavbar';
import axios from 'axios';

const AdminInOut = () => {
  const [selectedDate, setSelectedDate] = useState(''); // Store the selected date
  const [leaveData, setLeaveData] = useState([]); // Store the leave and outpass data
  const [lateComersData, setLateComersData] = useState([]); // Store the late comers data
  const [loading, setLoading] = useState(false); // Loading state

  const fetchData = async (date) => {
    setLoading(true);
    console.log("Fetching data for date:", date); // Debugging line
    try {
      const formattedDate = date || new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
      console.log("Formatted date:", formattedDate); // Debugging line

      const leaveResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/adminInOut/leaves-outpasses?date=${formattedDate}`);
      console.log("Leave response data:", leaveResponse.data); // Debugging line
      setLeaveData(leaveResponse.data);

      // Uncomment the following lines when ready to fetch late comers
      // const lateComersResponse = await axios.get(`https://online-peon.vercel.app/adminInOut/late-comers?date=${formattedDate}`);
      // console.log("Late comers response data:", lateComersResponse.data); // Debugging line
      // setLateComersData(lateComersResponse.data);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger API call whenever the selected date changes
  useEffect(() => {
    console.log("Selected date changed:", selectedDate); // Debugging line
    fetchData(selectedDate); // Call fetchData on component mount or when date changes
  }, [selectedDate]);

  return (
    <Box bg="gray.50">
      {/* Admin Navbar */}
      <AdminNavbar />

      {/* Tabs Section */}
      <Box mt={8} maxW="80%" mx="auto" p={5} bg="white" shadow="md" borderRadius="md">
        <Tabs isFitted variant="enclosed">
          <TabList mb="1em" borderBottom="2px solid gray.300">
            <Tab fontWeight="bold">Data of Leaves and Outpasses</Tab>
            <Tab fontWeight="bold">Late Comers</Tab>
          </TabList>

          <TabPanels>
            {/* Tab Panel for Data of Leaves and Outpasses */}
            <TabPanel>
              <Heading as="h3" size="lg" mb={4}>Data of Leaves and Outpasses</Heading>
              
              {/* Date Input for filtering */}
              <FormControl mb={4}>
                <FormLabel>Select Date</FormLabel>
                <Input 
                  type="date" 
                  maxW="200px" 
                  value={selectedDate}
                  onChange={(e) => {
                    console.log("Date input changed:", e.target.value); // Debugging line
                    setSelectedDate(e.target.value); // Update selected date
                  }} 
                />
              </FormControl>

              {loading ? (
                <Spinner size="lg" />
              ) : (
                <>
                  <Text mb={4}>Here is the list of leaves and outpasses for the selected date.</Text>

                  {/* Table for displaying data */}
                  <Table variant="simple" size="md" bg="gray.100" borderRadius="md" shadow="sm">
                    <Thead>
                      <Tr>
                        <Th>Student Name</Th>
                        <Th>Leave Type</Th>
                        <Th>From</Th>
                        <Th>To</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {leaveData.length > 0 ? (
                        leaveData.map((leave, index) => (
                          <Tr key={index}>
                            <Td>{leave.studentName}</Td>
                            <Td>{leave.leaveType}</Td>
                            <Td>{leave.fromDate}</Td>
                            <Td>{leave.toDate}</Td>
                          </Tr>
                        ))
                      ) : (
                        <Tr>
                          <Td colSpan="4">No data available for the selected date.</Td>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
                </>
              )}
            </TabPanel>

            {/* Tab Panel for Late Comers */}
            <TabPanel>
              <Heading as="h3" size="lg" mb={4}>Late Comers</Heading>

              {/* Date Input for filtering */}
              <FormControl mb={4}>
                <FormLabel>Select Date</FormLabel>
                <Input 
                  type="date" 
                  maxW="200px" 
                  value={selectedDate}
                  onChange={(e) => {
                    console.log("Date input changed (late comers):", e.target.value); // Debugging line
                    setSelectedDate(e.target.value); // Update selected date
                  }} 
                />
              </FormControl>

              {loading ? (
                <Spinner size="lg" />
              ) : (
                <>
                  <Text mb={4}>The following students were marked as late on the selected date.</Text>

                  {/* Table for displaying late comers */}
                  <Table variant="simple" size="md" bg="gray.100" borderRadius="md" shadow="sm">
                    <Thead>
                      <Tr>
                        <Th>Student Name</Th>
                        <Th>Time In</Th>
                        <Th>Remarks</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {lateComersData.length > 0 ? (
                        lateComersData.map((lateComer, index) => (
                          <Tr key={index}>
                            <Td>{lateComer.studentName}</Td>
                            <Td>{lateComer.timeIn}</Td>
                            <Td>{lateComer.remarks}</Td>
                          </Tr>
                        ))
                      ) : (
                        <Tr>
                          <Td colSpan="3">No data available for the selected date.</Td>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
                </>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
}

export default AdminInOut;
