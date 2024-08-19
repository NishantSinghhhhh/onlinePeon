import React, { useState } from 'react';
import { Card as ChakraCard, useToast, CardHeader, CardBody, CardFooter, Heading, FormControl, FormLabel, Input, Button, Stack, InputGroup, InputLeftAddon } from '@chakra-ui/react';
import Navbar from '../components/navbar/navbar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import styles from './Form.module.css';

const OutpassForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    registrationNumber: '',
    reason: '',
    date: new Date(),
    startHour: '',
    endHour: '',
    contactNumber: '',
  });
  
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => {
      const newData = { ...prevData, [name]: value };
      console.log(`Field '${name}' updated:`, newData[name]); // Debug log
      return newData;
    });
  };

  const handleDateChange = (date) => {
    setFormData(prevData => {
      const newData = { ...prevData, date };
      console.log('Date updated:', date); // Debug log
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log('Full formData state:', formData);

    const { firstName, lastName, registrationNumber, reason, date, startHour, endHour, contactNumber } = formData;
    const isoDate = date.toISOString();
  
    console.log('Form data at submission:', {
      firstName: `"${firstName}"`,
      lastName: `"${lastName}"`,
      registrationNumber: `"${registrationNumber}"`,
      reason: `"${reason}"`,
      date: `"${isoDate}"`,
      startHour: `"${startHour}"`,
      endHour: `"${endHour}"`,
      contactNumber: `"${contactNumber}"`
    });

    console.log('Empty fields check:', {
      firstName: !firstName,
      lastName: !lastName,
      registrationNumber: !registrationNumber,
      reason: !reason,
      date: !date,
      startHour: !startHour,
      endHour: !endHour,
      contactNumber: !contactNumber
    });

    const emptyFields = [];
    if (!firstName) emptyFields.push('firstName');
    if (!lastName) emptyFields.push('lastName');
    if (!registrationNumber) emptyFields.push('registrationNumber');
    if (!reason) emptyFields.push('reason');
    if (!date) emptyFields.push('date');
    if (!startHour) emptyFields.push('startHour');
    if (!endHour) emptyFields.push('endHour');
    if (!contactNumber) emptyFields.push('contactNumber');

    if (emptyFields.length > 0) {
      console.log('Empty fields:', emptyFields);
      return handleError(`The following fields are required: ${emptyFields.join(', ')}`);
    }
    
    if (!/^\d{4}$/.test(registrationNumber)) {
      return handleError('Registration number must be exactly 4 digits.');
    }
  
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
          registrationNumber,
          reason,
          date: isoDate,
          startHour,
          endHour,
          contactNumber,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server response error:', errorData); // Debug log
        return handleError(errorData.message || 'An error occurred');
      }
  
      const result = await response.json();
      console.log('Server response:', result); // Debug log

      if (result.success) {
        handleSuccess(result.message);
        setTimeout(() => navigate('/'), 1000);
      } else if (result.error) {
        handleError(result.error.details?.[0]?.message || 'An error occurred');
      } else {
        handleError(result.message || 'An unexpected error occurred.');
      }
    } catch (err) {
      console.error('Fetch error:', err); // Debug log
      handleError('An unexpected error occurred.');
    }
  };
  
  const handleError = (message) => {
    console.error('Error:', message); // Debug log
    toast({
      title: 'Error',
      description: message,
      status: 'error',
      duration: 5000,
      isClosable: true
    });
  };

  const handleSuccess = (message) => {
    console.log('Success:', message); // Debug log
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
                    name='registrationNumber'
                    value={formData.registrationNumber}
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
