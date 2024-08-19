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
  Box,
  Text,
  Select
} from '@chakra-ui/react';
import Navbar from '../components/navbar/navbar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './Form.module.css';

// Define classes
const years = ['FE', 'SE', 'TE', 'BE'];
const branches = ['Comp', 'IT', 'ENTC', 'Mech', "ARE"];
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
  const [documents, setDocuments] = useState(null);
  const [documentError, setDocumentError] = useState('');

  const toast = useToast();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) { // 5MB size limit
        setDocumentError('File size should be less than 5MB');
        setDocuments(null);
      } else if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
        setDocumentError('Only PDF, JPEG, and PNG files are allowed');
        setDocuments(null);
      } else {
        setDocumentError('');
        setDocuments(file);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Debugging
    console.log('Form data:', { firstName, lastName, className, rollNumber, classesMissed, reason, startDate, endDate });

    // Check if startDate and endDate are valid
    let isoStartDate = '';
    let isoEndDate = '';

    if (startDate instanceof Date && !isNaN(startDate.getTime())) {
      isoStartDate = startDate.toISOString();
    } else {
      return handleError('Invalid start date selected.');
    }

    if (endDate instanceof Date && !isNaN(endDate.getTime())) {
      isoEndDate = endDate.toISOString();
    } else {
      return handleError('Invalid end date selected.');
    }

    // Check for empty fields
    const emptyFields = [];
    if (!firstName) emptyFields.push('First Name');
    if (!lastName) emptyFields.push('Last Name');
    if (!className) emptyFields.push('Class');
    if (!rollNumber) emptyFields.push('Roll Number');
    if (!classesMissed) emptyFields.push('Number of Classes Missed');
    if (!reason) emptyFields.push('Reason for Absence');
    if (!startDate) emptyFields.push('Start Date');
    if (!endDate) emptyFields.push('End Date');

    if (emptyFields.length > 0) {
      return handleError(`The following fields are required: ${emptyFields.join(', ')}`);
    }

    // Validate roll number
    if (!/^\d{4}$/.test(rollNumber)) {
      return handleError('Roll Number must be exactly 4 digits.');
    }

    try {
      const url = 'http://localhost:8000/auth/PL'; // Ensure this URL is correct
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          className,
          rollNumber,
          classesMissed,
          reason,
          startDate: isoStartDate,
          endDate: isoEndDate,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        return handleError(result.message || 'An error occurred while submitting the form.');
      }

      if (result.success) {
        handleSuccess(result.message);
        setTimeout(() => window.location.href = '/Home', 1000);
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
      isClosable: true
    });
  };

  const handleSuccess = (message) => {
    toast({
      title: 'Success',
      description: message,
      status: 'success',
      duration: 5000,
      isClosable: true
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
                    className={styles['chakra-input']}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    placeholder='Last Name'
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={styles['chakra-input']}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Class</FormLabel>
                  <Select
                    placeholder='Select Class'
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className={styles['chakra-input']}
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
                    className={styles['chakra-input']}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Number of Classes Missed</FormLabel>
                  <Input
                    type='number'
                    placeholder='Number of Classes Missed'
                    value={classesMissed}
                    onChange={(e) => setClassesMissed(e.target.value)}
                    className={styles['chakra-input']}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Reason for Absence</FormLabel>
                  <Textarea
                    placeholder='Reason for Absence'
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className={styles['chakra-input']}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Supporting Documents</FormLabel>
                  <Box 
                    border='1px solid #e2e8f0' 
                    p={4} 
                    borderRadius='md' 
                    bg='gray.50' 
                    _hover={{ borderColor: 'teal.500' }} 
                    transition='border-color 0.2s'
                    textAlign='center'
                  >
                    <Input 
                      type='file' 
                      accept='.pdf,.jpg,.jpeg,.png' 
                      onChange={handleFileChange} 
                      display='none' 
                      id='file-upload' 
                    />
                    <label htmlFor='file-upload'>
                      <Button colorScheme='teal' variant='outline' as='span'>
                        Upload Document
                      </Button>
                    </label>
                    {documentError && (
                      <Text color='red.500' mt={2}>{documentError}</Text>
                    )}
                    {documents && (
                      <Box mt={2} border='1px solid #e2e8f0' p={2} borderRadius='md' bg='gray.100'>
                        <Text fontSize='sm'>{documents.name}</Text>
                      </Box>
                    )}
                  </Box>
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
                  colorScheme='teal' 
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
