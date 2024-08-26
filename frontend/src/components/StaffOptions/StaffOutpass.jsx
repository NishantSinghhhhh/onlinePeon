import React from 'react';
import StaffNavbar from '../StaffNavbar/StaffNavbar';
import { Box, Text} from '@chakra-ui/react';
import OutpassCard from '../cards/outpassCard';

// Sample card data
const cardData = [
  {
    firstName: "John",
    lastName: "Doe",
    registrationNumber: "5678",
    reason: "Business Meeting",
    date: "2024-08-20T10:00:00.000+00:00",
    startHour: "09:00",
    endHour: "17:00",
    contactNumber: "9876543210"
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    registrationNumber: "9101",
    reason: "Family Event",
    date: "2024-08-21T14:30:00.000+00:00",
    startHour: "13:30",
    endHour: "18:30",
    contactNumber: "1234567890"
  },
  {
    firstName: "Alice",
    lastName: "Johnson",
    registrationNumber: "1121",
    reason: "Doctor's Appointment",
    date: "2024-08-22T11:00:00.000+00:00",
    startHour: "10:00",
    endHour: "12:00",
    contactNumber: "4567891230"
  },
  {
    firstName: "Bob",
    lastName: "Brown",
    registrationNumber: "3141",
    reason: "Conference",
    date: "2024-08-23T08:00:00.000+00:00",
    startHour: "07:30",
    endHour: "16:00",
    contactNumber: "6789012345"
  },
];

const StaffOutpass = () => {
  return (
    <div>
      <StaffNavbar />
      <Box p={6}  maxW="4xl" mx="auto" mt={4}>
        <Text  m="auto" fontSize="2xl" fontWeight="bold" mb={4}>
          Outpass Details
        </Text>
          {cardData.map((card, index) => (
            <OutpassCard key={index} data={card} />
          ))}
   
      </Box>
    </div>
  );
};

export default StaffOutpass;
