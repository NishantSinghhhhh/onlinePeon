import React, { useState } from 'react';
import {
  Card as ChakraCard,
  CardHeader,
  CardBody,
  CardFooter,
  useToast,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  Textarea,
  Select
} from '@chakra-ui/react';
import Navbar from '../components/navbar/navbar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './Form.module.css';

const years = ['FE', 'SE', 'TE', 'BE'];
const branches = ['Comp', 'IT', 'ENTC', 'Mech', 'ARE'];
const classesPerYear = ['A', 'B'];

const generateClasses = () => {
  const classOptions = [];
  for (const year of years) {
    for (const branch of branches) {
      for (const cls of classesPerYear) {
        classOptions.push(`${year}-${branch}-${cls}`);
      }
    }
  }
  return classOptions;
};

const PLForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [className, setClassName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [classesMissed, setClassesMissed] = useState('');
  const [reason, setReason] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      firstName,
      lastName,
      className,
      rollNumber,
      classesMissed,
      reason,
      startDate,
      endDate,
    };

    try {
      const url = 'http://localhost:8000/auth/PL'; // Ensure this URL is correct
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        return handleError(result.message || 'An error occurred while submitting the form.');
      }

      if (result.success) {
        handleSuccess(result.message);
        setTimeout(() => window.location.href = '/uploaddoc', 1000);
      } else {
        handleError(result.message || 'An unexpected error occurred.');
      }
    } catch (err) {
      handleError('An unexpected error occurred.');
    }
  };

  const handleError = (message) => {
    toast({
      title: 'Error',
      description: message,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  };

  const handleSuccess = (message) => {
    toast({
      title: 'Success',
      description: message,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <>
      <Navbar />
      <div className={styles.main}>
        <ChakraCard borderWidth='1px' borderRadius='md' p={4} boxShadow='md' w='full'>
          <CardHeader>
            <Heading size='lg'>PL Request Form</Heading>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>First Name</FormLabel>
                  <Input
                    placeholder='First Name'
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    placeholder='Last Name'
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Class</FormLabel>
                  <Select
                    placeholder='Select Class'
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                  >
                    {generateClasses().map((cls, index) => (
                      <option key={index} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Roll Number</FormLabel>
                  <Input
                    placeholder='Roll Number'
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Number of Classes Missed</FormLabel>
                  <Input
                    type='number'
                    placeholder='Number of Classes Missed'
                    value={classesMissed}
                    onChange={(e) => setClassesMissed(e.target.value)}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Reason for Absence</FormLabel>
                  <Textarea
                    placeholder='Reason for Absence'
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Start Date</FormLabel>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    dateFormat='yyyy-MM-dd'
                    className={styles['chakra-input']}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>End Date</FormLabel>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    dateFormat='yyyy-MM-dd'
                    className={styles['chakra-input']}
                  />
                </FormControl>
              </Stack>
              <CardFooter>
                <Button 
                  type='submit' 
                  // colorScheme='teal' 
                  mt={4} 
                  size='lg'
                >
                  Submit
                </Button>
              </CardFooter>
            </form>
          </CardBody>
        </ChakraCard>
      </div>
    </>
  );
};

export default PLForm;
