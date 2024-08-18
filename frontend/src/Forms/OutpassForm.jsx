import React, { useState } from 'react';
import { Card as ChakraCard, useToast, CardHeader, CardBody, CardFooter, Heading, FormControl, FormLabel, Input, Button, Stack, InputGroup, InputLeftAddon } from '@chakra-ui/react';
import Navbar from '../components/navbar/navbar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import styles from './Form.module.css'; // Import the CSS module

const OutpassForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    regNumber: '',
    reason: '',
    date: new Date(),
    startHour: '',
    endHour: '',
    contactNumber: '',
  });
  
  const toast = useToast(); // Initialize useToast
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      date
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Destructure formData
    const { firstName, lastName, regNumber, reason, date, startHour, endHour, contactNumber } = formData;

    // Check for empty fields
    if (!firstName || !lastName || !regNumber || !reason || !date || !startHour || !endHour || !contactNumber) {
      return handleError('All fields are required.');
    }
    
     // Validate regNumber (exactly 4 digits)
     if (!/^\d{4}$/.test(regNumber)) {
      return handleError('Registration number must be exactly 4 digits.');
    }

    // Validate contactNumber (exactly 10 digits)
    if (!/^\d{10}$/.test(contactNumber)) {
      return handleError('Contact number must be exactly 10 digits.');
    }

    try {
      const url = 'http://localhost:8000/auth/outpass';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          regNumber,
          reason,
          date,
          startHour,
          endHour,
          contactNumber,
        }),
      });

      // Check if response is OK (status code in the range 200-299)
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || 'An error occurred';
        return handleError(errorMessage);
      }

      // Parse the JSON response
      const result = await response.json();
      const { success, message, error } = result;

      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate('/'); // Navigate to the home page
        }, 1000);
      } else if (error) {
        const details = error?.details[0]?.message || 'An error occurred';
        handleError(details);
      } else {
        handleError(message || 'An unexpected error occurred.');
      }
    } catch (err) {
      handleError('An unexpected error occurred.');
    }
    
    // Print all form data to the console
    console.log('Form data being sent:');
    console.log('First Name:', formData.firstName);
    console.log('Last Name:', formData.lastName);
    console.log('Registration Number:', formData.regNumber);
    console.log('Reason:', formData.reason);
    console.log('Date:', formData.date);
    console.log('Start Hour:', formData.startHour);
    console.log('End Hour:', formData.endHour);
    console.log('Contact Number:', formData.contactNumber);

    // Handle form submission here
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
            <Heading size='lg'>Outpass Request Form</Heading>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>First Name</FormLabel>
                  <Input 
                    placeholder='First name' 
                    name='firstName'
                    value={formData.firstName}
                    onChange={handleChange}
                    className={styles['chakra-input']}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Last Name</FormLabel>
                  <Input 
                    placeholder='Last name' 
                    name='lastName'
                    value={formData.lastName}
                    onChange={handleChange}
                    className={styles['chakra-input']}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Registration Number</FormLabel>
                  <Input 
                    placeholder='Registration Number' 
                    name='regNumber'
                    value={formData.regNumber}
                    onChange={handleChange}
                    className={styles['chakra-input']}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Reason for Outpass</FormLabel>
                  <Input 
                    placeholder='Reason for Outpass' 
                    name='reason'
                    value={formData.reason}
                    onChange={handleChange}
                    className={styles['chakra-input']}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Date</FormLabel>
                  <DatePicker
                    selected={formData.date}
                    onChange={handleDateChange}
                    dateFormat='MMMM d, yyyy'
                    className={styles['chakra-input']}
                    wrapperClassName={styles['chakra-datepicker']}
                    popperClassName={styles['chakra-datepicker-popover']}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Outing Hours</FormLabel>
                  <Stack spacing={3}>
                    <FormControl>
                      <FormLabel>Start Hour</FormLabel>
                      <Input
                        type='time'
                        name='startHour'
                        value={formData.startHour}
                        onChange={handleChange}
                        className={styles['chakra-input']}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>End Hour</FormLabel>
                      <Input
                        type='time'
                        name='endHour'
                        value={formData.endHour}
                        onChange={handleChange}
                        className={styles['chakra-input']}
                      />
                    </FormControl>
                  </Stack>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Contact Number</FormLabel>
                  <InputGroup>
                    <InputLeftAddon children='+91' />
                    <Input 
                      placeholder='Contact Number' 
                      name='contactNumber'
                      value={formData.contactNumber}
                      onChange={handleChange}
                      className={styles['chakra-input']}
                    />
                  </InputGroup>
                </FormControl>
              </Stack>
              <CardFooter>
                <Button colorScheme='teal' type='submit'>
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

export default OutpassForm;
