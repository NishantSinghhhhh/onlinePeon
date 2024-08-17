import React from 'react';
import { Card as ChakraCard, CardHeader, CardBody, CardFooter, Heading, Text, Button, Flex } from '@chakra-ui/react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import styles from './cards.module.css';

// Card Component
const Card = ({ title, description, buttonText, link }) => {
  return (
    <ChakraCard 
      className={styles.card} // Add this class for custom styles
      _hover={{ 
        boxShadow: 'xl', 
        transform: 'scale(1.05)',
        transition: 'all 0.3s ease-in-out' 
      }}
    >
      <CardHeader>
        <Heading size='md'>{title}</Heading>
      </CardHeader>
      <CardBody>
        <Text>{description}</Text>
      </CardBody>
      <CardFooter>
        <Link to={link}>
          <Button>{buttonText}</Button>
        </Link>
      </CardFooter>
    </ChakraCard>
  );
};

// Dashboard Component
const Dashboard = () => {
  return (
    <div className={styles.main}>
      <Flex pt='100px' wrap='wrap' spacing={4} gap='100px' display='flex' flexDirection='column' justify='center' align='center'>
        <Card
          title='Apply for Outpass'
          description='Generally it takes 1 day to get your outpass approved with a valid reason'
          buttonText='Fill Form'
          link='/OutpassForm' // Update with the appropriate route
        />
        <Card
          title='Apply for Leave'
          description='Generally it takes 2-3 days to get your Leave approved with a valid reason'
          buttonText='Fill Form'
          link='/LeaveForm' // Update with the appropriate route
        />
        <Card
          title='Apply for PL'
          description='Generally it takes 2-3 days to get your PL approved with a valid reason'
          buttonText='Fill Form'
          link='/PLform' // Update with the appropriate route
        />
      </Flex>
    </div>
  );
};

export default Dashboard;
