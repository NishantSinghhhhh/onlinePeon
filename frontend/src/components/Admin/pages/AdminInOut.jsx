import React, { useState, useEffect } from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel, Box, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, FormControl, FormLabel, Input, Flex } from '@chakra-ui/react';
import { HashLoader } from 'react-spinners';
import AdminNavbar from './AdminNavbar';
import axios from 'axios';

const AdminInOut = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [leaveData, setLeaveData] = useState([]);
  const [outpassData, setOutpassData] = useState([]);
  const [lateComersData, setLateComersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const fetchData = async (date) => {
    setLoading(true);
    console.log("Fetching data for date:", date);

    const timeOutId = setTimeout(async () => {
      try {
        const formattedDate = date || new Date().toISOString().split('T')[0];
        console.log("Formatted date:", formattedDate);
        
        // Fetch data based on the active tab
        if (activeTabIndex === 0) {
          const leaveResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/adminInOut/leaves?date=${formattedDate}`);
          setLeaveData(leaveResponse.data || []);
        } else if (activeTabIndex === 1) {
          const outpassResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/adminInOut/outpasses?date=${formattedDate}`);
          setOutpassData(outpassResponse.data || []);
        } else if (activeTabIndex === 2) {
          const lateComersResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/adminInOut/late-comers?date=${formattedDate}`);
          setLateComersData(lateComersResponse.data || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }, 1000);
    return () => clearTimeout(timeOutId);
  };
   
  useEffect(() => {
    console.log("Selected date changed:", selectedDate);
    fetchData(selectedDate);
  }, [selectedDate, activeTabIndex]);

  const extractYear = (className) => {
    return className ? className.slice(0, 2) : '';
  };

  // Function to calculate time late
  const calculateTimeLate = (inTime) => {
    const lateThreshold = new Date();
    lateThreshold.setHours(21, 30, 0); // Set to 21:30
    const arrivalTime = new Date();
    const [hours, minutes] = inTime.split(':');
    arrivalTime.setHours(hours, minutes, 0);

    const timeLate = arrivalTime > lateThreshold
      ? `${Math.floor((arrivalTime - lateThreshold) / (1000 * 60))} min late`
      : 'On time';

    return timeLate;
  };

  return (
    <Box bg="gray.50">
      <AdminNavbar />
      <Box mt={8} maxW="80%" mx="auto" p={5} bg="white" shadow="md" borderRadius="md">
        <Tabs isFitted variant="enclosed" index={activeTabIndex} onChange={(index) => {
          setActiveTabIndex(index);
          fetchData(selectedDate);
        }}>
          <TabList mb="1em" borderBottom="2px solid gray.300">
            <Tab fontWeight="bold">Data of Leaves</Tab>
            <Tab fontWeight="bold">Data of Outpasses</Tab>
            <Tab fontWeight="bold">Late Comers</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Heading as="h3" size="lg" mb={4}>Data of Leaves</Heading>
              <FormControl mb={4}>
                <FormLabel>Select Date</FormLabel>
                <Input 
                  type="date" 
                  maxW="200px" 
                  value={selectedDate}
                  onChange={(e) => {
                    console.log("Date input changed:", e.target.value);
                    setSelectedDate(e.target.value);
                  }} 
                />
              </FormControl>

              {loading ? (
                <Flex direction="column" align="center" justify="center" p={5} minH="10vh">
                  <HashLoader color="#000000" loading={loading} size={50} />
                  <Text mt={4}>Loading...</Text>
                </Flex>
              ) : (
                <>
                  <Text mb={4}>Here is the list of leaves for the selected date.</Text>
                  <Table variant="simple" size="md" bg="gray.100" borderRadius="md" shadow="sm">
                    <Thead>
                      <Tr>
                        <Th>Student Name</Th>
                        <Th>Reason for Leave</Th>
                        <Th>From</Th>
                        <Th>To</Th>
                        <Th>Class</Th>
                        <Th>Year</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {leaveData.length > 0 ? (
                        leaveData.map((leave) => (
                          <Tr key={leave.id}>
                            <Td>{`${leave.firstName} ${leave.lastName}`}</Td>
                            <Td>{leave.reasonForLeave}</Td>
                            <Td>{new Date(leave.startDate).toLocaleDateString()}</Td>
                            <Td>{new Date(leave.endDate).toLocaleDateString()}</Td>
                            <Td>{leave.className}</Td>
                            <Td>{extractYear(leave.className)}</Td>
                          </Tr>
                        ))
                      ) : (
                        <Tr>
                          <Td colSpan="6">No leaves available for the selected date.</Td>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
                </>
              )}
            </TabPanel>

            <TabPanel>
              <Heading as="h3" size="lg" mb={4}>Data of Outpasses</Heading>
              <FormControl mb={4}>
                <FormLabel>Select Date</FormLabel>
                <Input 
                  type="date" 
                  maxW="200px" 
                  value={selectedDate}
                  onChange={(e) => {
                    console.log("Date input changed (outpasses):", e.target.value);
                    setSelectedDate(e.target.value);
                  }} 
                />
              </FormControl>

              {loading ? (
                <Flex direction="column" align="center" justify="center" p={5} minH="10vh">
                  <HashLoader color="#000000" loading={loading} size={50} />
                  <Text mt={4}>Loading...</Text>
                </Flex>
              ) : (
                <>
                  <Text mb={4}>Here is the list of outpasses for the selected date.</Text>
                  <Table variant="simple" size="md" bg="gray.100" borderRadius="md" shadow="sm">
                    <Thead>
                      <Tr>
                        <Th>Student Name</Th>
                        <Th>Reason</Th>
                        <Th>Start Time</Th>
                        <Th>End Time</Th>
                        <Th>Class</Th>
                        <Th>Year</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {outpassData.length > 0 ? (
                        outpassData.map((outpass) => (
                          <Tr key={outpass._id}>
                            <Td>{`${outpass.firstName} ${outpass.lastName}`}</Td>
                            <Td>{outpass.reason}</Td>
                            <Td>{outpass.startHour}</Td>
                            <Td>{outpass.endHour}</Td>
                            <Td>{outpass.className}</Td>
                            <Td>{extractYear(outpass.className)}</Td>
                          </Tr>
                        ))
                      ) : (
                        <Tr>
                          <Td colSpan="6">No outpasses available for the selected date.</Td>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
                </>
              )}
            </TabPanel>

            <TabPanel>
              <Heading as="h3" size="lg" mb={4}>Data of Late Comers</Heading>
              <FormControl mb={4}>
                <FormLabel>Select Date</FormLabel>
                <Input 
                  type="date" 
                  maxW="200px" 
                  value={selectedDate}
                  onChange={(e) => {
                    console.log("Date input changed (late comers):", e.target.value);
                    setSelectedDate(e.target.value);
                  }} 
                />
              </FormControl>

              {loading ? (
                <Flex direction="column" align="center" justify="center" p={5} minH="10vh">
                  <HashLoader color="#000000" loading={loading} size={50} />
                  <Text mt={4}>Loading...</Text>
                </Flex>
              ) : (
                <>
                  <Text mb={4}>Here is the list of late comers for the selected date.</Text>
                  <Table variant="simple" size="md" bg="gray.100" borderRadius="md" shadow="sm">
                    <Thead>
                      <Tr>
                        <Th>Student Name</Th>
                        <Th>In Time</Th>
                        <Th>Time Late</Th>
                        <Th>Class</Th>
                        <Th>Year</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {lateComersData.length > 0 ? (
                        lateComersData.map((lateComer) => (
                          <Tr key={lateComer._id}>
                            <Td>{`${lateComer.firstName} ${lateComer.lastName}`}</Td>
                            <Td>{lateComer.inTime}</Td>
                            <Td>{calculateTimeLate(lateComer.inTime)}</Td>
                            <Td>{lateComer.className}</Td>
                            <Td>{extractYear(lateComer.className)}</Td>
                          </Tr>
                        ))
                      ) : (
                        <Tr>
                          <Td colSpan="5">No late comers available for the selected date.</Td>
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
};

export default AdminInOut;
