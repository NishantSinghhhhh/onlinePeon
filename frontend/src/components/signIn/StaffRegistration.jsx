import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  Card as ChakraCard,
  CardBody,
  CardHeader,
  CardFooter,
  useToast,
  Select
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import styles from './Form.module.css'; // Import the CSS module

const branches = ['COMP', 'ENTC', 'IT', 'Mech'];
const years = ['FE', 'SE', 'TE', 'BE'];
const classes = ['A', 'B'];
const numbers = [1, 2, 3, 4, 5, 6];

// Generate all possible class options
const generateClassOptions = () => {
  const options = [];
  branches.forEach(branch => {
    years.forEach(year => {
      classes.forEach(cls => {
        options.push(`${year}-${branch}-${cls}`);
      });
    });
  });
  return options;
};

// Generate pairs of letters with numbers
const generateCounselorOptions = () => {
  const options = [];
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  numbers.forEach(number => {
    letters.forEach(letter => {
      options.push(`${letter}-${number}`);
    });
  });
  return options;
};

// Sample list of department heads
const departmentHeads = [
  'Mr. James White',
  'Ms. Olivia Brown',
  'Dr. Robert Green',
  'Ms. Emma Black'
];

const StaffRegistration = () => {
  const [signupInfo, setSignupInfo] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    classTeacher: '',
    counselor: '',
    staffId: '',
    contactNumber: '',
  });

  const toast = useToast(); // Initialize useToast
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  const handleSignup = async (e) => {
    e.preventDefault();
    
    console.log('Signup Info:', signupInfo); // Debugging

    const { 
        name, 
        email, 
        password, 
        department, 
        classTeacher, 
        counselor,
        staffId, 
        contactNumber,
    } = signupInfo;

    // Check for empty fields
    if (!name || !email || !password || !department || !classTeacher || !counselor || !staffId || !contactNumber ) {
        return handleError('All fields are required.');
    }

    // Validate staff ID and contact number
    if (!/^\d{5,6}$/.test(staffId)) {
        return handleError('Staff ID must be a 5-6 digit number.');
    }
    if (!/^\d{10}$/.test(contactNumber)) {
        return handleError('Contact number must be a 10-digit number.');
    }

    try {
        const url = `http://localhost:8000/auth/signupStaff`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                password,
                department,
                classTeacher,
                counselor,
                staffId,
                contactNumber,
            })
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
                navigate('/'); // Navigate to login page on successful signup
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
      <div className={styles.Upper}>Register Here</div>
      <div className={styles.DIvision}>

        <Box display="flex" mt='100px' flexDirection="column" justifyContent="center" alignItems="center" height="100vh" width="90vw">
          <ChakraCard
            borderWidth='1px'
            borderRadius='md'
            w='110vh'
            p={6}
            m='auto'
            boxShadow='md'
            className={styles.card}
          >
            <CardHeader>
              <Text fontSize="2xl" fontWeight="bold" textAlign="center">
                Staff Registration Form
              </Text>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSignup}>
                <Stack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      value={signupInfo.name}
                      onChange={handleChange}
                      className={styles.chakraInput}
                      w='70vw'
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={signupInfo.email}
                      onChange={handleChange}
                      className={styles.chakraInput}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      value={signupInfo.password}
                      onChange={handleChange}
                      className={styles.chakraInput}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Staff ID</FormLabel>
                    <Input
                      type="number"
                      name="staffId"
                      placeholder="Enter your staff ID (5-6 digits)"
                      value={signupInfo.staffId}
                      onChange={handleChange}
                      className={styles.chakraInput}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Contact Number</FormLabel>
                    <Input
                      type="tel"
                      name="contactNumber"
                      placeholder="Enter your contact number (10 digits)"
                      value={signupInfo.contactNumber}
                      onChange={handleChange}
                      className={styles.chakraInput}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Department</FormLabel>
                    <Select
                      name="department"
                      placeholder="Select your department"
                      value={signupInfo.department}
                      onChange={handleChange}
                      className={styles.chakraInput}
                    >
                      {branches.map(branch => (
                        <option key={branch} value={branch}>
                          {branch}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Class Teacher</FormLabel>
                    <Select
                      name="classTeacher"
                      placeholder="Select your class"
                      value={signupInfo.classTeacher}
                      onChange={handleChange}
                      className={styles.chakraInput}
                    >
                      {generateClassOptions().map(option => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Batches (for Counselor)</FormLabel>
                    <Select
                      name="counselor"
                      placeholder="Select your batch"
                      value={signupInfo.counselor}
                      onChange={handleChange}
                      className={styles.chakraInput}
                    >
                      {generateCounselorOptions().map(option => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <Button type="submit" colorScheme="teal" size="lg">
                    Register
                  </Button>
                </Stack>
              </form>
            </CardBody>

          </ChakraCard>
        </Box>
      </div>
    </>
  );
};

export default StaffRegistration;
