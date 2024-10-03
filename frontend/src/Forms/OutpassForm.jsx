import React, { useState, useContext, useEffect } from 'react';
import {
  Card as ChakraCard,
  useToast,
  CardHeader,
  CardBody,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  Select
} from '@chakra-ui/react';
import Navbar from '../components/navbar/navbar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import styles from './Form.module.css';
import { StudentLoginContext } from '../context/StudentContext'; // Adjust path as necessary
import useFetchRegistration from '../hooks/StudentInfo';

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
    rollNumber: '',
    reason: '',
    date: new Date(),
    startHour: '',
    endHour: '',
    contactNumber: '',
    className: '',
    extraDataArray: [0, 0, 0, 0],
  });

  const { loginInfo } = useContext(StudentLoginContext);
  const regnNum = loginInfo.registrationNumber;

  const { data, loading, error } = useFetchRegistration(regnNum);

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
      const lastName = lastNameParts.join(' '); // Join remaining parts for last name
  
      setFormData(prevData => ({
        ...prevData,
        rollNumber: userData.rollNumber,
        className: userData.class,
        contactNumber: userData.contactNumber,
        registrationNumber: userData.registrationNumber,
        firstName, // Update firstName directly
        lastName, // Update lastName directly
      }));
    }
  }, [loading, data]);
  
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prevData => ({
      ...prevData,
      date
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      firstName, lastName, registrationNumber, rollNumber, reason, date,
      startHour, endHour, contactNumber, className, extraDataArray
    } = formData;
    const isoDate = date.toISOString();

    const emptyFields = [];
    if (!firstName) emptyFields.push('firstName');
    if (!lastName) emptyFields.push('lastName');
    if (!registrationNumber) emptyFields.push('registrationNumber');
    if (!rollNumber) emptyFields.push('rollNumber');
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

    if (!/^\d{4}$/.test(rollNumber)) {
      return handleError('Roll number must be exactly 4 digits.');
    }

    if (!/^\d{10}$/.test(contactNumber)) {
      return handleError('Contact number must be exactly 10 digits.');
    }

    try {
      const outpassUrl = `${process.env.REACT_APP_BASE_URL}/auth/outpass`;
      const response = await fetch(outpassUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          registrationNumber,
          rollNumber,
          reason,
          date: isoDate,
          startHour,
          endHour,
          contactNumber,
          className,
          extraDataArray,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return handleError(errorData.message || 'An error occurred');
      }

      const result = await response.json();
      if (result.success) {
        await handleOutpassMessage();
        handleSuccess(result.message);
        setTimeout(() => navigate('/Home'), 1000);
      } else {
        handleError(result.message || 'An unexpected error occurred.');
      }
    } catch (err) {
      handleError('An unexpected error occurred.');
    }
  };

  const handleOutpassMessage = async () => {
    try {
      const outpassUrl = `${process.env.REACT_APP_BASE_URL}/Message/send`;
      const teacherUrl = `${process.env.REACT_APP_BASE_URL}/Message/sendTeacher`;

      const {
        firstName,
        lastName,
        registrationNumber,
        rollNumber,
        reason,
        date,
        startHour,
        endHour,
        contactNumber,
        className,
      } = formData;

      const outpassMessageBody = {
        contactNumber,
        studentName: `${firstName} ${lastName}`,
        registrationNumber,
        rollNumber,
        reason,
        leaveDate: date.toISOString(),
        startHour,
        endHour,
        className,
      };

      const teacherMessageBody = {
        contactNumber,
        studentName: `${firstName} ${lastName}`,
        reason,
        returnDate: '',
        startHour,
        endHour,
        className,
      };

      const outpassResponse = await fetch(outpassUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(outpassMessageBody),
      });

      if (!outpassResponse.ok) {
        const outpassData = await outpassResponse.json();
        handleError(outpassData.error || 'Failed to send outpass message.');
        return;
      }

      const teacherResponse = await fetch(teacherUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teacherMessageBody),
      });

      if (!teacherResponse.ok) {
        const teacherData = await teacherResponse.json();
        handleError(teacherData.error || 'Failed to send teacher message.');
      }
    } catch (err) {
      handleError('Failed to send the message.');
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
                  <FormLabel>Reason for Outpass</FormLabel>
                  <Input
                    placeholder='Reason'
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
                    className={styles['chakra-input']}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Start Hour</FormLabel>
                  <Input
                    placeholder='Start Hour (HH:MM)'
                    name='startHour'
                    value={formData.startHour}
                    onChange={handleChange}
                    className={styles['chakra-input']}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>End Hour</FormLabel>
                  <Input
                    placeholder='End Hour (HH:MM)'
                    name='endHour'
                    value={formData.endHour}
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
                  <FormLabel>Class</FormLabel>
                  <Select
                    placeholder='Select Class'
                    name='className'
                    value={formData.className}
                    onChange={handleChange}
                    className={styles['chakra-input']}
                  >
                    {classOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <Button type='submit' colorScheme='teal' size='lg'>
                  Submit
                </Button>
              </Stack>
            </form>
          </CardBody>
        </ChakraCard>
      </div>
    </>
  );
};

export default OutpassForm;
