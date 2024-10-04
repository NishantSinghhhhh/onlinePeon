import React from 'react';
import { Card as ChakraCard, CardHeader, CardBody, CardFooter, Heading, Text, Button, Flex, Box, useToast } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import styles from './cards.module.css'; // Custom CSS for additional styles

// Utility function to check if today is a Saturday or Sunday
const isWeekend = () => {
  const currentDay = new Date().getDay();
  return currentDay === 0 || currentDay === 6; // 0 is Sunday, 6 is Saturday
};

// Utility function to check if today's date is within a manual date range
const isInDateRange = (startDate, endDate) => {
  const today = new Date();
  return today >= new Date(startDate) && today <= new Date(endDate);
};

// Function to determine if the button should be enabled
const isButtonEnabled = (manualStartDate, manualEndDate) => {
  // Enable the button if it's a weekend or within the manual date range
  return isWeekend() || isInDateRange(manualStartDate, manualEndDate);
};

// Card Component
const Card = ({ title, description, buttonText, link, manualStartDate, manualEndDate }) => {
  const buttonEnabled = isButtonEnabled(manualStartDate, manualEndDate);
  const toast = useToast();

  const handleButtonClick = (e) => {
    if (!buttonEnabled) {
      e.preventDefault(); // Prevent navigation
      toast({
        title: "Notice",
        description: "Today there is no holiday, so you cannot fill this form.",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <ChakraCard 
      className={styles.card} 
      borderWidth="1px" 
      borderRadius="lg" 
      overflow="hidden" 
      boxShadow="md"
      transition="transform 0.3s ease-in-out"
      _hover={{ 
        boxShadow: '2xl', 
        transform: 'scale(1.05)',
      }}
      p={6}
      bg="white"
    >
      <CardHeader pb={0}>
        <Heading size='lg' color='gray.700'>{title}</Heading>
      </CardHeader>
      <CardBody pt={4}>
        <Text color='gray.500'>{description}</Text>
      </CardBody>
      <CardFooter pt={6}>
        <Link to={buttonEnabled ? link : '#'} onClick={handleButtonClick}>
          <Button 
            variant='solid' 
            size='md'
            _hover={{
              bg: buttonEnabled ? 'blue.600' : 'gray.400',
              transform: buttonEnabled ? 'translateY(-2px)' : 'none',
            }}
            disabled={!buttonEnabled} // Disable the button if not enabled
          >
            {buttonText}
          </Button>
        </Link>
      </CardFooter>
    </ChakraCard>
  );
};

// Dashboard Component
const Dashboard = () => {
  return (
    <Box bg="gray.50" minH="100vh" py={10}>
      <Flex 
        className={styles.main}
        wrap='wrap'
        justify='center' 
        align='center'
        gap={8}
      >
        <Card
          title='Apply for Outpass [Academic Hour]'
          description='Generally it takes 1 day to get your outpass approved with a valid reason'
          buttonText='Fill Form'
          link='/OutpassForm'
        />
        <Card
          title='Apply for Outpass [Holidays]'
          description='A QR code will be generated instantly. Get it scanned by the guard okay..'
          buttonText='Fill Form'
          link='/HolidayOutpassForm'
          // Set the manual date range here
          manualStartDate="2024-10-06" // Example: October 6th, 2024
          manualEndDate="2024-10-10" // Example: October 10th, 2024
        />
        <Card
          title='Apply for Leave'
          description='Generally it takes 2-3 days to get your Leave approved with a valid reason'
          buttonText='Fill Form'
          link='/LeaveForm'
        />
        <Card
          title='Apply for PL'
          description='Generally it takes 2-3 days to get your PL approved with a valid reason'
          buttonText='Fill Form'
          link='/PLform'
        />
      </Flex>
    </Box>
  );
};

export default Dashboard;
