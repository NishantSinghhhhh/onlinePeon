import React, { useState, useEffect } from 'react';
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

// Replace the classes array with the provided class names
const classNames = [
  'FE-COMP-A', 'FE-COMP-B', 'FE-ENTC-A', 'FE-ENTC-B', 'FE-IT-A', 'FE-IT-B',
  'FE-MECH', 'FE-ARE', 'SE-COMP-A', 'SE-COMP-B', 'SE-ENTC-A', 'SE-ENTC-B',
  'SE-IT-A', 'SE-IT-B', 'SE-MECH', 'TE-COMP-A', 'TE-COMP-B', 'TE-ENTC-A',
  'TE-ENTC-B', 'TE-IT-A', 'TE-IT-B', 'TE-MECH', 'BE-COMP-A', 'BE-COMP-B',
  'BE-ENTC-A', 'BE-ENTC-B', 'BE-IT-A', 'BE-IT-B', 'BE-MECH'
];

const Register = () => {
  const [signupInfo, setSignupInfo] = useState({
    name: '',
    email: '',
    password: '',
    class: '',
    rollNumber: '',
    registrationNumber: '',
    fatherName: '',
    fatherPhoneNumber: '',
    classTeacherName: '',
    gender: '' 
  });
  const [classTeachers, setClassTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch class teachers when the component mounts
    const fetchClassTeachers = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/fetch/fetchTeachers`);
        if (!response.ok) {
          throw new Error('Failed to fetch class teachers');
        }
        const data = await response.json();
        
        console.log('Fetched class teachers:', data); // Debug log
        
        setClassTeachers(data.data || []);
      } catch (err) {
        console.error('Failed to load class teachers:', err); // Debug log
        setError('Failed to load class teachers');
      } finally {
        setLoading(false);
      }
    };
  
    fetchClassTeachers();
  }, []);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    const {
      name,
      email,
      password,
      class: className,
      rollNumber,
      registrationNumber,
      fatherName,
      fatherPhoneNumber,
      classTeacherName,
      gender
    } = signupInfo;

    if (!name || !email || !password || !className || !rollNumber || !registrationNumber || !fatherName || !fatherPhoneNumber || !classTeacherName || !gender) {
      return handleError('All fields are required.');
    }

    if (!/^\d{4}$/.test(rollNumber)) {
      return handleError('Roll number must be a 4-digit number.');
    }
    if (!/^\d{5,6}$/.test(registrationNumber)) {
      return handleError('Registration number must be a 5-6 digit number.');
    }
    if (!/^\d{10}$/.test(fatherPhoneNumber)) {
      return handleError('Father\'s phone number must be a 10-digit number.');
    }

    console.log('Signup Info:', {
      name,
      email,
      password,
      className,
      rollNumber,
      registrationNumber,
      fatherName,
      fatherPhoneNumber,
      classTeacherName,
      gender 
    });

    try {
      const url = `${process.env.REACT_APP_BASE_URL}/auth/signUp`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          password,
          class: className,
          rollNumber,
          registrationNumber,
          fatherName,
          fatherPhoneNumber,
          classTeacherName,
          gender 
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || 'An error occurred';
        return handleError(errorMessage);
      }

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
        <Box display="flex" mt='50px' flexDirection="column" justifyContent="center" alignItems="center" height="100vh" width="100vw">
          <ChakraCard
            borderWidth='1px'
            borderRadius='md'
            w='100vh'
            p={6}
            m='auto'
            boxShadow='md'
            className={styles.card}
          >
            <CardHeader>
              <Text fontSize="2xl" fontWeight="bold" textAlign="center">
                Registration Form 
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
                    <FormLabel>Roll Number</FormLabel>
                    <Input
                      type="number"
                      name="rollNumber"
                      placeholder="Enter your roll number (4-digit number)"
                      value={signupInfo.rollNumber}
                      onChange={handleChange}
                      className={styles.chakraInput}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Registration Number</FormLabel>
                    <Input
                      type="number"
                      name="registrationNumber"
                      placeholder="Enter your registration number (5-6 digit number)"
                      value={signupInfo.registrationNumber}
                      onChange={handleChange}
                      className={styles.chakraInput}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Father's Name</FormLabel>
                    <Input
                      type="text"
                      name="fatherName"
                      placeholder="Enter your father's name"
                      value={signupInfo.fatherName}
                      onChange={handleChange}
                      className={styles.chakraInput}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Father's Phone Number</FormLabel>
                    <Input
                      type="tel"
                      name="fatherPhoneNumber"
                      placeholder="Enter your father's phone number (10-digit number)"
                      value={signupInfo.fatherPhoneNumber}
                      onChange={handleChange}
                      className={styles.chakraInput}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      name="gender"
                      placeholder="Select your gender"
                      value={signupInfo.gender}
                      onChange={handleChange}
                      className={styles.chakraInput}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Class</FormLabel>
                    <Select
                      name="class"
                      placeholder="Select your class"
                      value={signupInfo.class}
                      onChange={handleChange}
                      className={styles.chakraInput}
                    >
                      {classNames.map((className, index) => (
                        <option key={index} value={className}>{className}</option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Class Teacher's Name</FormLabel>
                    {loading ? (
                      <Text>Loading...</Text>
                    ) : error ? (
                      <Text>{error}</Text>
                    ) : (
                      <Select
                        name="classTeacherName"
                        placeholder="Select your class teacher"
                        value={signupInfo.classTeacherName}
                        onChange={handleChange}
                        className={styles.chakraInput}
                      >
                        {classTeachers.map((teacher, index) => (
                          <option key={index} value={teacher.name}>{teacher.name}</option>
                        ))}
                      </Select>
                    )}
                  </FormControl>
                </Stack>
                <CardFooter >
                  <Button ml={-5} type="submit"  className={styles.submitButton}>
                    Register
                  </Button>
                </CardFooter>
              </form>
            </CardBody>
          </ChakraCard>
        </Box>
      </div>
    </>
  );
};

export default Register;
