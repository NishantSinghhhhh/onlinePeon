import React, { useState } from 'react';
import { Card as ChakraCard, useToast, CardHeader, CardBody, CardFooter, Heading, FormControl, FormLabel, Input, Button, Stack, InputGroup, InputLeftAddon, Select } from '@chakra-ui/react';
import Navbar from '../components/navbar/navbar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import styles from './Form.module.css';

const classOptions = [
  'FE-COMP-A', 'FE-COMP-B', 'FE-ENTC-A', 'FE-ENTC-B', 'FE-IT-A', 'FE-IT-B',
  'FE-MECH', 'FE-ARE', 'SE-COMP-A', 'SE-COMP-B', 'SE-ENTC-A', 'SE-ENTC-B',
  'SE-IT-A', 'SE-IT-B', 'SE-MECH', 'TE-COMP-A', 'TE-COMP-B', 'TE-ENTC-A',
  'TE-ENTC-B', 'TE-IT-A', 'TE-IT-B', 'TE-MECH', 'BE-COMP-A', 'BE-COMP-B',
  'BE-ENTC-A', 'BE-ENTC-B', 'BE-IT-A', 'BE-IT-B', 'BE-MECH'
];

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
    className: '',
    extraDataArray: [0, 0, 0, 0], // Hidden array with 4 numbers
  });

  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => {
      const newData = { ...prevData, [name]: value };
      return newData;
    });
  };

  const handleDateChange = (date) => {
    setFormData(prevData => {
      const newData = { ...prevData, date };
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { firstName, lastName, registrationNumber, reason, date, startHour, endHour, contactNumber, className, extraDataArray } = formData;
    const isoDate = date.toISOString();

    const emptyFields = [];
    if (!firstName) emptyFields.push('firstName');
    if (!lastName) emptyFields.push('lastName');
    if (!registrationNumber) emptyFields.push('registrationNumber');
    if (!reason) emptyFields.push('reason');
    if (!date) emptyFields.push('date');
    if (!startHour) emptyFields.push('startHour');
    if (!endHour) emptyFields.push('endHour');
    if (!contactNumber) emptyFields.push('contactNumber');
    if (!className) emptyFields.push('className');

    if (emptyFields.length > 0) {
      return handleError(`The following fields are required: ${emptyFields.join(', ')}`);
    }

    if (!/^\d{5,6}$/.test(registrationNumber)) {
      return handleError('Registration number must be 5 or 6 digits long.');
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
          className,
          extraDataArray, // Hidden array included in request body
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return handleError(errorData.message || 'An error occurred');
      }

      const result = await response.json();
      if (result.success) {
        handleSuccess(result.message);
        setTimeout(() => navigate('/Home'), 1000);
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

                <FormControl isRequired>
                  <FormLabel>Class Name</FormLabel>
                  <Select
                    placeholder='Select Class'
                    name='className'
                    value={formData.className}
                    onChange={handleChange}
                    className={styles['chakra-input']}
                  >
                    {classOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <Button type='submit' colorScheme='blue' size='lg'>
                  Submit
                </Button>
              </Stack>
            </form>
          </CardBody>
          <CardFooter>
            <Button variant='ghost' onClick={() => navigate('/Home')}>Back to Home</Button>
          </CardFooter>
        </ChakraCard>
      </div>
    </>
  );
};

export default OutpassForm;
