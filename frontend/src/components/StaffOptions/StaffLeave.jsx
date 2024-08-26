import React from 'react';
import StaffNavbar from '../StaffNavbar/StaffNavbar';
import LeaveCard from '../cards/LeaveCard';
import { Box, Text,SimpleGrid } from '@chakra-ui/react';

const leaveData = [
    {
      id: "66c3a7a2497856f6a6bce9a5",
      firstName: "Nishant",
      lastName: "Singh",
      registrationNumber: "1234",
      reasonForLeave: "Ghar jana hain",
      startDate: "2024-08-20T19:58:15.000+00:00",
      endDate: "2024-08-27T19:58:15.000+00:00",
      placeOfResidence: "Kota",
      attendancePercentage: 95,
      contactNumber: "2134567897",
      createdAt: "2024-08-19T20:14:26.741+00:00",
      updatedAt: "2024-08-19T20:14:26.741+00:00"
    },
    {
      id: "77d4b8a3498e72f6a7bce9a6",
      firstName: "Riya",
      lastName: "Sharma",
      registrationNumber: "5678",
      reasonForLeave: "Family Event",
      startDate: "2024-09-01T09:30:00.000+00:00",
      endDate: "2024-09-05T18:00:00.000+00:00",
      placeOfResidence: "Jaipur",
      attendancePercentage: 89,
      contactNumber: "9876543210",
      createdAt: "2024-08-22T15:20:00.000+00:00",
      updatedAt: "2024-08-22T15:20:00.000+00:00"
    },
    {
      id: "88e5c9b5599d72f6a7bce9a7",
      firstName: "Amit",
      lastName: "Kumar",
      registrationNumber: "9101",
      reasonForLeave: "Personal Reasons",
      startDate: "2024-09-10T10:00:00.000+00:00",
      endDate: "2024-09-12T17:00:00.000+00:00",
      placeOfResidence: "Delhi",
      attendancePercentage: 92,
      contactNumber: "1122334455",
      createdAt: "2024-08-23T11:45:00.000+00:00",
      updatedAt: "2024-08-23T11:45:00.000+00:00"
    },
    {
      id: "99f6d1c469b972f6a7bce9a8",
      firstName: "Pooja",
      lastName: "Mehta",
      registrationNumber: "1122",
      reasonForLeave: "Medical Check-up",
      startDate: "2024-09-15T08:30:00.000+00:00",
      endDate: "2024-09-18T16:30:00.000+00:00",
      placeOfResidence: "Mumbai",
      attendancePercentage: 90,
      contactNumber: "2233445566",
      createdAt: "2024-08-25T09:00:00.000+00:00",
      updatedAt: "2024-08-25T09:00:00.000+00:00"
    }
  ];
  
const StaffLeave = () => {
  return (
    <div>
    <StaffNavbar />
    <Box p={6}  maxW="4xl" mx="auto" mt={4}>
    <Text  m="auto" fontSize="2xl" fontWeight="bold" mb={4}>
          Leave Details
    </Text>
          {leaveData.map(data => (
            <LeaveCard key={data.id} data={data} />
          ))}
    </Box>
    </div>
  );
};

export default StaffLeave;
