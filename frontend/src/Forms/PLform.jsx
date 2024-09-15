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
  Select,
  Box,
  Text
} from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './Form.module.css';
import { useRollNumber } from '../context/RollNumberContext';

const classOptions = [
  'FE-COMP-A', 'FE-COMP-B', 'FE-ENTC-A', 'FE-ENTC-B', 'FE-IT-A', 'FE-IT-B',
  'FE-MECH', 'FE-ARE', 'SE-COMP-A', 'SE-COMP-B', 'SE-ENTC-A', 'SE-ENTC-B',
  'SE-IT-A', 'SE-IT-B', 'SE-MECH', 'TE-COMP-A', 'TE-COMP-B', 'TE-ENTC-A',
  'TE-ENTC-B', 'TE-IT-A', 'TE-IT-B', 'TE-MECH', 'BE-COMP-A', 'BE-COMP-B',
  'BE-ENTC-A', 'BE-ENTC-B', 'BE-IT-A', 'BE-IT-B', 'BE-MECH'
];

const PLForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [className, setClassName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState(''); // New state for registration number
  const [classesMissed, setClassesMissed] = useState('');
  const [reason, setReason] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [document, setDocument] = useState('');
  const [extraDataArray] = useState([0, 0, 0, 0]); // Initialize extraDataArray

  const toast = useToast();
  const { setRollNumber: setRollNumberContext } = useRollNumber();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !className || !rollNumber || !registrationNumber || !classesMissed || !reason || !startDate || !endDate || !document) {
      return handleError('Please fill in all required fields.');
    }

    const formData = {
      firstName,
      lastName,
      className,
      rollNumber,
      registrationNumber, // Add registration number here
      classesMissed,
      reason,
      startDate,
      endDate,
      document, // Base64-encoded document
      extraDataArray, // Add extraDataArray here
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
        handleSuccess('PL request submitted successfully!');
        console.log('Roll Number:', rollNumber); // Print the roll number to the console
        console.log('Registration Number:', registrationNumber); // Print the registration number to the console
        setRollNumberContext(rollNumber); // Update the roll number in context
        await sendPLMessageToParents(formData); // Call function to send message to parents
        await sendPLMessageToTeachers(formData); 
        setTimeout(() => window.location.href = '/Home', 1000);
      } else {
        handleError(result.message || 'An unexpected error occurred.');
      }
    } catch (err) {
      handleError('An unexpected error occurred.');
    }
  };
  
  const sendPLMessageToParents = async (formData) => {
    console.log("Sending PL message to parents with the following data:", formData); // Debugging log
  
    try {
      const response = await fetch('http://localhost:8000/message/sendPLMessageToParents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contactNumber: formData.contactNumber,
          studentName: `${formData.firstName} ${formData.lastName}`,
          registrationNumber: formData.registrationNumber,
          rollNumber: formData.rollNumber,
          reason: formData.reason,
          startDate: formData.startDate.toISOString(), // Convert to ISO string
          endDate: formData.endDate.toISOString(), // Convert to ISO string
          classesMissed: formData.classesMissed, // Include classesMissed field
          className: formData.className
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response from server:', errorData); // Detailed error logging
        handleError(errorData.message || 'An error occurred while sending the message to parents');
        return;
      }
  
      const result = await response.json();
      console.log("Response from server (parents):", result); // Log server response for debugging
      handleSuccess(result.message);
    } catch (err) {
      console.error('Fetch error:', err); // Detailed fetch error log
      handleError('An unexpected error occurred while sending the message to parents.');
    }
  };
  
  const sendPLMessageToTeachers = async (formData) => {
    console.log("Sending PL message to teachers with the following data:", formData); // Debugging log
  
    try {
      const response = await fetch('http://localhost:8000/message/sendPLMessageToTeachers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contactNumber: formData.contactNumber,
          studentName: `${formData.firstName} ${formData.lastName}`,
          registrationNumber: formData.registrationNumber,
          rollNumber: formData.rollNumber,
          reason: formData.reason,
          startDate: formData.startDate.toISOString(), // Convert to ISO string
          endDate: formData.endDate.toISOString(), // Convert to ISO string
          classesMissed: formData.classesMissed, // Include classesMissed field
          className: formData.className
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response from server:', errorData); // Detailed error logging
        handleError(errorData.message || 'An error occurred while sending the message to teachers');
        return;
      }
  
      const result = await response.json();
      console.log("Response from server (teachers):", result); // Log server response for debugging
      handleSuccess(result.message);
    } catch (err) {
      console.error('Fetch error:', err); // Detailed fetch error log
      handleError('An unexpected error occurred while sending the message to teachers.');
    }
  };
  
  
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    
    console.log("Base64 Encoded String: ", base64); // Print the base64 string to the console
    
    setDocument(base64); // Set base64-encoded document in state
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
                    {classOptions.map((cls, index) => (
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
                    onChange={(e) => setRollNumber(e.target.value.trim())} // Trim spaces
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Registration Number</FormLabel>
                  <Input
                    placeholder='Registration Number'
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value.trim())} // Trim spaces
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

                <FormControl isRequired>
                  <FormLabel>Upload Document</FormLabel>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                  />
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    Please upload a PDF or Word document (max 5MB)
                  </Text>
                </FormControl>

                {document && (
                  <Box mt={2}>
                    <Text fontWeight="bold">Selected file:</Text>
                    <Text>{document.split(',')[1].slice(0, 50)}...</Text> {/* Display first 50 chars of base64 */}
                  </Box>
                )}
              </Stack>
              <CardFooter mt={4}>
                <Button colorScheme='blue' type='submit'>
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

function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result)
    };
    fileReader.onerror = (error) => {
      reject(error)
    }
  });
}
