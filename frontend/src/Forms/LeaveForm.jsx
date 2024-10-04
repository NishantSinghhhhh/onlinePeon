import React, { useState, useContext, useEffect } from 'react';
import {
  Card as ChakraCard, useToast, CardHeader, CardBody, CardFooter,
  Heading, FormControl, FormLabel, Input, Button, Stack, Select,
  Box, Alert, AlertIcon, AlertTitle, AlertDescription
} from '@chakra-ui/react';
import Navbar from '../components/navbar/navbar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import styles from './Form.module.css';
import { StudentLoginContext } from '../context/StudentContext';
import useFetchRegistration from '../hooks/StudentInfo';
import { WarningIcon } from "@chakra-ui/icons";
import useSos from '../hooks/useSos';

const classOptions = [
  'FE-COMP-A', 'FE-COMP-B', 'FE-ENTC-A', 'FE-ENTC-B', 'FE-IT-A', 'FE-IT-B',
  'FE-MECH', 'FE-ARE', 'SE-COMP-A', 'SE-COMP-B', 'SE-ENTC-A', 'SE-ENTC-B',
  'SE-IT-A', 'SE-IT-B', 'SE-MECH', 'TE-COMP-A', 'TE-COMP-B', 'TE-ENTC-A',
  'TE-ENTC-B', 'TE-IT-A', 'TE-IT-B', 'TE-MECH', 'BE-COMP-A', 'BE-COMP-B',
  'BE-ENTC-A', 'BE-ENTC-B', 'BE-IT-A', 'BE-IT-B', 'BE-MECH'
];

const LeaveForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    registrationNumber: '',
    rollNumber: '',
    reasonForLeave: '',
    startDate: new Date(),
    endDate: new Date(),
    placeOfResidence: '',
    attendancePercentage: '',
    contactNumber: '',
    className: '',
    extraDataArray: [0, 0, 0, 0]
  });

 
  const { loginInfo } = useContext(StudentLoginContext);
  const regnNum = loginInfo.registrationNumber;

  const { data, loading, error } = useFetchRegistration(regnNum);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && data) {
      const userData = {
        rollNumber: data.rollNumber,
        class: data.class,
        name: data.name,
        contactNumber: data.fatherPhoneNumber,
        registrationNumber: data.registrationNumber,
      };
      const [firstName, ...lastNameParts] = userData.name.split(' ');
      const lastName = lastNameParts.join(' ');
  
      setFormData(prevData => ({
        ...prevData,
        rollNumber: userData.rollNumber,
        className: userData.class,
        contactNumber: userData.contactNumber,
        registrationNumber: userData.registrationNumber,
        firstName,
        lastName,
      }));
    }
  }, [loading, data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => {
      const newData = { ...prevData, [name]: value };
      console.log(`Field '${name}' updated:`, newData[name]);
      return newData;
    });
  };

  const handleDateChange = (date, name) => {
    setFormData(prevData => {
      const newData = { ...prevData, [name]: date };
      console.log(`${name} updated:`, date);
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log('Full formData state:', formData);
  
    const { firstName, lastName, registrationNumber, rollNumber, reasonForLeave, startDate, endDate, placeOfResidence, attendancePercentage, contactNumber, className, extraDataArray } = formData;
  
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
  
    console.log('Form data at submission:', {
      firstName: `"${firstName}"`,
      lastName: `"${lastName}"`,
      registrationNumber: `"${registrationNumber}"`,
      reasonForLeave: `"${reasonForLeave}"`,
      rollNumber: `"${rollNumber}"`,
      startDate: `"${isoStartDate}"`,
      endDate: `"${isoEndDate}"`,
      placeOfResidence: `"${placeOfResidence}"`,
      attendancePercentage: `"${attendancePercentage}"`,
      contactNumber: `"${contactNumber}"`,
      className: `"${className}"`,
      extraDataArray
    });

    const emptyFields = [];
    if (!firstName) emptyFields.push('firstName');
    if (!lastName) emptyFields.push('lastName');
    if (!registrationNumber) emptyFields.push('registrationNumber');
    if (!rollNumber) emptyFields.push('rollNumber');
    if (!reasonForLeave) emptyFields.push('reasonForLeave');
    if (!startDate) emptyFields.push('startDate');
    if (!endDate) emptyFields.push('endDate');
    if (!placeOfResidence) emptyFields.push('placeOfResidence');
    if (!attendancePercentage) emptyFields.push('attendancePercentage');
    if (!contactNumber) emptyFields.push('contactNumber');
    if (!className) emptyFields.push('className');
  
    if (emptyFields.length > 0) {
      console.log('Empty fields:', emptyFields);
      return handleError(`The following fields are required: ${emptyFields.join(', ')}`);
    }
  
    if (!/^\d{5,6}$/.test(registrationNumber)) {
      return handleError('Registration number must be exactly 5 or 6 digits.');
    }
    
    if (!/^\d{4}$/.test(rollNumber)) {
      return handleError('Roll number must be exactly 4 digits.');
    }

    if (!/^\d{10}$/.test(contactNumber)) {
      return handleError('Contact number must be exactly 10 digits.');
    }
  
    try {
      const url = `${process.env.REACT_APP_BASE_URL}/auth/leave`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          registrationNumber,
          rollNumber,
          reasonForLeave,
          startDate: isoStartDate,
          endDate: isoEndDate,
          placeOfResidence,
          attendancePercentage,
          contactNumber,
          className,
          extraDataArray
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server response error:', errorData);
        return handleError(errorData.message || 'An error occurred');
      }
  
      const result = await response.json();
      console.log('Server response:', result);
  
      if (result.success) {
        await sendLeaveMessageToParents();
        await sendLeaveMessageToTeachers();

        handleSuccess(result.message);
        setTimeout(() => navigate('/Home'), 1000);
      } else if (result.error) {
        handleError(result.error.details?.[0]?.message || 'An error occurred');
      } else {
        handleError(result.message || 'An unexpected error occurred.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      handleError('An unexpected error occurred.');
    }
  };
  
  const sendLeaveMessageToParents = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/Message/sendLeaveMessageToParents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contactNumber: formData.contactNumber,
          studentName: `${formData.firstName} ${formData.lastName}`,
          registrationNumber: formData.registrationNumber,
          rollNumber: formData.rollNumber,
          reason: formData.reasonForLeave,
          startHour: formData.startDate.toISOString(),
          endHour: formData.endDate.toISOString(),
          placeOfResidence: formData.placeOfResidence,
          attendancePercentage: formData.attendancePercentage,
          className: formData.className
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server response error:', errorData);
        handleError(errorData.message || 'An error occurred while sending message to parents');
        return;
      }
  
      const result = await response.json();
      handleSuccess(result.message);
    } catch (err) {
      console.error('Fetch error:', err);
      handleError('An unexpected error occurred while sending message to parents.');
    }
  };
  
  const sendLeaveMessageToTeachers = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/Message/sendLeaveMessageToTeachers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contactNumber: formData.contactNumber,
          studentName: `${formData.firstName} ${formData.lastName}`,
          reasonForLeave: formData.reasonForLeave,
          startDate: formData.startDate.toISOString(),
          endDate: formData.endDate.toISOString(),
          placeOfResidence: formData.placeOfResidence,
          attendancePercentage: formData.attendancePercentage,
          className: formData.className
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server response error:', errorData);
        handleError(errorData.message || 'An error occurred while sending message to teachers');
        return;
      }

      const result = await response.json();
      handleSuccess(result.message);
    } catch (err) {
      console.error('Fetch error:', err);
      handleError('An unexpected error occurred while sending message to teachers.');
    }
  };

  const handleError = (message) => {
    console.error('Error:', message);
    toast({
      title: 'Error',
      description: message,
      status: 'error',
      duration: 5000,
      isClosable: true
    });
  };

  const handleSuccess = (message) => {
    console.log('Success:', message);
    toast({
      title: 'Success',
      description: message,
      status: 'success',
      duration: 5000,
      isClosable: true
    });
  };

  const { handleSosSubmit } = useSos();

  return (
    <>
      <Navbar />
      <div className={styles.main}>
       
        <ChakraCard borderWidth='1px' borderRadius='md' p={4} boxShadow='md' w='full'>
          <CardHeader className=''>
            <Heading size='lg'>Leave Request Form</Heading>
            <Box position="relative" mb={4}>
              <Button
                  colorScheme="red"
                  size="lg" // Increase the button size
                  variant="solid" // Change to solid variant for better visibility
                  position="absolute"
                  right="20px" // Adjust right position for better spacing
                  top="20px" // Adjust top position for better spacing
                  leftIcon={<WarningIcon />} // Add an icon to the button
                  boxShadow="md" // Add a shadow for a 3D effect
                  _hover={{ bg: "red.600", transform: "scale(1.05)" }} // Change background color and scale on hover
                  _active={{ bg: "red.700", transform: "scale(0.95)" }} // Darker color and scale effect on active
                  onClick={handleSosSubmit}
                >
              SOS
            </Button>
            </Box>
        
        {!handleSosSubmit && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            <AlertTitle mr={2}>SOS Alert Sent!</AlertTitle>
            <AlertDescription>Your SOS Leave Is approved , All the teachers will be informed</AlertDescription>
          </Alert>
        )}
        
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
                  <FormLabel>Roll Number</FormLabel>
                  <Input 
                    placeholder='Roll Number' 
                    name='rollNumber'
                    value={formData.rollNumber}
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
                    className={styles['chakra-input']}
                    minDate={new Date()}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>End Date</FormLabel>
                  <DatePicker
                    selected={formData.endDate}
                    onChange={(date) => handleDateChange(date, 'endDate')}
                    className={styles['chakra-input']}
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
                    placeholder='Attendance Percentage' 
                    type='number'
                    name='attendancePercentage'
                    value={formData.attendancePercentage}
                    onChange={handleChange}
                    className={styles['chakra-input']}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Contact Number</FormLabel>
                  <Input 
                    placeholder='Contact Number' 
                    name='contactNumber'
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className={styles['chakra-input']}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Class Name</FormLabel>
                  <Select 
                    name='className' 
                    value={formData.className}
                    onChange={handleChange}
                    placeholder='Select Class'
                    className={styles['chakra-input']}
                  >
                    {classOptions.map((classOption, index) => (
                      <option key={index} value={classOption}>
                        {classOption}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <Button type='submit' colorScheme='teal'>Submit</Button>
              </Stack>
            </form>
          </CardBody>
          <CardFooter>
            {/* Any additional footer information can go here */}
          </CardFooter>
        </ChakraCard>
      </div>
    </>
  );
};

export default LeaveForm;