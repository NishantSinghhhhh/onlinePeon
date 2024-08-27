import React from 'react';
import StaffNavbar from '../StaffNavbar/StaffNavbar';
import { Box, Text } from '@chakra-ui/react';
import PLCard from '../cards/PLCard'; // Replace OutpassCard with PLCard

// Sample card data
const cardData = [
  {
    firstName: "John",
    lastName: "Doe",
    className: "FE-IT-B",
    rollNumber: "5678",
    classesMissed: 5,
    reason: "Business Meeting",
    startDate: "2024-08-20T10:00:00.000+00:00",
    endDate: "2024-08-20T17:00:00.000+00:00",
    createdAt: "2024-08-20T09:00:00.000+00:00",
    updatedAt: "2024-08-20T09:30:00.000+00:00",
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    className: "FE-IT-A",
    rollNumber: "9101",
    classesMissed: 3,
    reason: "Family Event",
    startDate: "2024-08-21T13:30:00.000+00:00",
    endDate: "2024-08-21T18:30:00.000+00:00",
    createdAt: "2024-08-21T12:00:00.000+00:00",
    updatedAt: "2024-08-21T12:45:00.000+00:00",
  },
  {
    firstName: "Alice",
    lastName: "Johnson",
    className: "FE-IT-C",
    rollNumber: "1121",
    classesMissed: 2,
    reason: "Doctor's Appointment",
    startDate: "2024-08-22T10:00:00.000+00:00",
    endDate: "2024-08-22T12:00:00.000+00:00",
    createdAt: "2024-08-22T09:30:00.000+00:00",
    updatedAt: "2024-08-22T10:15:00.000+00:00",
  },
  {
    firstName: "Bob",
    lastName: "Brown",
    className: "FE-IT-D",
    rollNumber: "3141",
    classesMissed: 7,
    reason: "Conference",
    startDate: "2024-08-23T07:30:00.000+00:00",
    endDate: "2024-08-23T16:00:00.000+00:00",
    createdAt: "2024-08-23T07:00:00.000+00:00",
    updatedAt: "2024-08-23T07:45:00.000+00:00",
  },
];

const StaffPL = () => {
  return (
    <div>
      <StaffNavbar />
      <Box p={6} maxW="4xl" mx="auto" mt={4}>
        <Text m="auto" fontSize="2xl" fontWeight="bold" mb={4}>
          Leave Details
        </Text>
        {cardData.map((card, index) => (
          <PLCard key={index} data={card} />
        ))}
      </Box>
    </div>
  );
};

export default StaffPL;
