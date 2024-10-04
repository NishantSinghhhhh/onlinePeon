import React, { useEffect, useState, useContext } from 'react';
import { Card as ChakraCard, CardHeader, CardBody, CardFooter, Heading, Text, Button, Flex, Box, useToast, Spinner } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { StudentLoginContext } from '../../context/StudentContext'; // Ensure you have this in your context
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

// Card Component
const Card = ({ title, description, buttonText, link, isDisabled, manualStartDate, manualEndDate }) => {
  const buttonEnabled = !isDisabled && (!manualStartDate || !manualEndDate || isWeekend() || isInDateRange(manualStartDate, manualEndDate));
  const toast = useToast();

  const handleButtonClick = (e) => {
    if (!buttonEnabled) {
      e.preventDefault(); // Prevent navigation
      toast({
        title: "Notice",
        description: "There are pending requests, so you cannot apply for this at the moment.",
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
        transform: buttonEnabled ? 'scale(1.05)' : 'none',
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
  const { loginInfo } = useContext(StudentLoginContext); // Get login info from context
  const [outpasses, setOutpasses] = useState([]);
  const [plRequests, setPlRequests] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoader, setShowLoader] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/fetch/fetchpending/${loginInfo.registrationNumber}`);
        const data = await response.json();
        console.log(data)
        if (response.ok) {
          setOutpasses(data.outpasses);
          setPlRequests(data.pls);
          setLeaves(data.leaves);
        } else {
          throw new Error(data.message || 'Failed to fetch pending requests');
        }
      } catch (err) {
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
        setShowLoader(false);
      }
    };

    if (loginInfo.registrationNumber) {
      fetchPendingRequests();
    }
  }, [loginInfo.registrationNumber]);

  if (loading) {
    return <Spinner size="xl" color="blue.500" />;
  }

  if (error) {
    toast({
      title: "Error",
      description: error,
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  }

  // Check for pending requests to disable the buttons
  const hasPendingOutpasses = outpasses.length > 0;
  const hasPendingPls = plRequests.length > 0;
  const hasPendingLeaves = leaves.length > 0;

  return (
    <Box bg="gray.50" minH="100vh" py={10}>
      <Flex 
        className={styles.main}
        wrap='wrap'
        justify='center' 
        align='center'
        gap={8}
      >
        {/* Disable the Academic Hour Outpass button if there are pending outpasses */}
        <Card
          title='Apply for Outpass [Academic Hour]'
          description='Generally it takes 1 day to get your outpass approved with a valid reason'
          buttonText='Fill Form'
          link='/OutpassForm'
          isDisabled={hasPendingOutpasses}
        />
        
        {/* Holiday outpass is always available based on weekend and manual date range logic */}
        <Card
          title='Apply for Outpass [Holidays]'
          description='A QR code will be generated instantly. Get it scanned by the guard okay..'
          buttonText='Fill Form'
          link='/HolidayOutpassForm'
          manualStartDate="2024-10-06" // Example: October 6th, 2024
          manualEndDate="2024-10-10" // Example: October 10th, 2024
        />

        {/* Disable the Leave button if there are pending leaves */}
        <Card
          title='Apply for Leave'
          description='Generally it takes 2-3 days to get your Leave approved with a valid reason'
          buttonText='Fill Form'
          link='/LeaveForm'
          isDisabled={hasPendingLeaves}
        />

        {/* Disable the PL button if there are pending PL requests */}
        <Card
          title='Apply for PL'
          description='Generally it takes 2-3 days to get your PL approved with a valid reason'
          buttonText='Fill Form'
          link='/PLform'
          isDisabled={hasPendingPls}
        />
      </Flex>
    </Box>
  );
};

export default Dashboard;
