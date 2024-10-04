import React from 'react';
import { Card as ChakraCard, CardHeader, CardBody, CardFooter, Heading, Text, Button, Flex, Box } from '@chakra-ui/react';
import { Link } from 'react-router-dom'; 
import styles from './cards.module.css'; // Custom CSS for additional styles

// Card Component
const Card = ({ title, description, buttonText, link }) => {
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
        <Link to={link}>
          <Button 
            colorScheme='blue' 
            variant='solid' 
            size='md'
            _hover={{
              bg: 'blue.600',
              transform: 'translateY(-2px)',
            }}
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
          title='Apply for Leave'
          description='Generally it takes 2-3 days to get your Leave approved with a valid reason'
          buttonText='Fill Form'
          link='/LeaveForm' 
        />
        <Card
          title='Apply for Outpass [Holidays]'
          description='A QR code will be generated instantly. Get it scanned by the guard okay..'
          buttonText='Fill Form'
          link='/PLform' 
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
