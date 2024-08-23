import React, { useState } from 'react';
import {
  Card as ChakraCard, useToast, CardHeader, CardBody, CardFooter,
  Heading, FormControl, FormLabel, Input, Button, Stack, InputGroup, InputLeftAddon
} from '@chakra-ui/react';
import Navbar from '../components/navbar/navbar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import styles from './Form.module.css';

const LeaveForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    registrationNumber: '',
    reasonForLeave: '',
    startDate: new Date(),
    endDate: new Date(),
    placeOfResidence: '',
    attendancePercentage: '',
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

  const handleDateChange = (date, name) => {
    setFormData(prevData => {
      const newData = { ...prevData, [name]: date };
      console.log(`${name} updated:`, date); // Debug log
      return newData;
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Debug: Log the form data before submission
    console.log('Full formData state:', formData);
  
    const { firstName, lastName, registrationNumber, reasonForLeave, startDate, endDate, placeOfResidence, attendancePercentage, contactNumber } = formData;
  
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
  
    // Debug: Log the form data to be sent to the server
    console.log('Form data at submission:', {
      firstName: `"${firstName}"`,
      lastName: `"${lastName}"`,
      registrationNumber: `"${registrationNumber}"`,
      reasonForLeave: `"${reasonForLeave}"`,
      startDate: `"${isoStartDate}"`,
      endDate: `"${isoEndDate}"`,
      placeOfResidence: `"${placeOfResidence}"`,
      attendancePercentage: `"${attendancePercentage}"`,
      contactNumber: `"${contactNumber}"`
    });
  
    // Check for empty fields
    const emptyFields = [];
    if (!firstName) emptyFields.push('firstName');
    if (!lastName) emptyFields.push('lastName');
    if (!registrationNumber) emptyFields.push('registrationNumber');
    if (!reasonForLeave) emptyFields.push('reasonForLeave');
    if (!startDate) emptyFields.push('startDate');
    if (!endDate) emptyFields.push('endDate');
    if (!placeOfResidence) emptyFields.push('placeOfResidence');
    if (!attendancePercentage) emptyFields.push('attendancePercentage');
    if (!contactNumber) emptyFields.push('contactNumber');
  
    if (emptyFields.length > 0) {
      console.log('Empty fields:', emptyFields);
      return handleError(`The following fields are required: ${emptyFields.join(', ')}`);
    }
  
    // Validate registration number and contact number
    if (!/^\d{4}$/.test(registrationNumber)) {
      return handleError('Registration number must be exactly 4 digits.');
    }
  
    if (!/^\d{10}$/.test(contactNumber)) {
      return handleError('Contact number must be exactly 10 digits.');
    }
  
    try {
      const url = 'http://localhost:8000/auth/leave'; // Ensure this URL is correct
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          registrationNumber,
          reasonForLeave,
          startDate: isoStartDate,
          endDate: isoEndDate,
          placeOfResidence,
          attendancePercentage,
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
        setTimeout(() => navigate('/Home'), 1000);
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
            <Heading size='lg'>Leave Request Form</Heading>
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
                  <FormLabel>Reason for Leave</FormLabel>
                  <Input 
                    placeholder='Reason for Leave' 
                    name='reasonForLeave'
                    value={formData.reasonForLeave}
                    onChange={handleChange}
                    className={styles['chakra-input']}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Start Date</FormLabel>
                  <DatePicker
                    selected={formData.startDate}
                    onChange={(date) => handleDateChange(date, 'startDate')}
                    dateFormat='MMMM d, yyyy'
                    className={styles['chakra-input']}
                    wrapperClassName={styles['chakra-datepicker']}
                    popperClassName={styles['chakra-datepicker-popover']}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>End Date</FormLabel>
                  <DatePicker
                    selected={formData.endDate}
                    onChange={(date) => handleDateChange(date, 'endDate')}
                    dateFormat='MMMM d, yyyy'
                    className={styles['chakra-input']}
                    wrapperClassName={styles['chakra-datepicker']}
                    popperClassName={styles['chakra-datepicker-popover']}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Place of Residence</FormLabel>
                  <Input
                    placeholder='Place of Residence'
                    name='placeOfResidence'
                    value={formData.placeOfResidence}
                    onChange={handleChange}
                    className={styles['chakra-input']}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Attendance Percentage</FormLabel>
                  <Input
                    type='number'
                    placeholder='Attendance Percentage'
                    name='attendancePercentage'
                    value={formData.attendancePercentage}
                    onChange={handleChange}
                    className={styles['chakra-input']}
                  />
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
                <Button 
                // colorScheme='teal'
                 type='submit'
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

export default LeaveForm;
