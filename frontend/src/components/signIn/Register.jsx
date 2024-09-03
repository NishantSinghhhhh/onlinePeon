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

const branches = ['COMP', 'ENTC', 'IT', 'Mech'];
const years = ['FE', 'SE', 'TE', 'BE'];
const classes = ['A', 'B'];

const Register = () => {
  const [signupInfo, setSignupInfo] = useState({
    name: '',
    email: '',
    password: '',
    branch: '',
    year: '',
    class: '',
    rollNumber: '',
    registrationNumber: '',
    fatherName: '',
    fatherPhoneNumber: '',
    classTeacherName: ''
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
        const response = await fetch('http://localhost:8000/fetch/fetchTeachers');
        if (!response.ok) {
          throw new Error('Failed to fetch class teachers');
        }
        const data = await response.json();
        
        console.log('Fetched class teachers:', data); // Debug log
        
        // Check the structure of data and update state accordingly
        // Assuming the teacher names are in data.data
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
      branch,
      year,
      class: className,
      rollNumber,
      registrationNumber,
      fatherName,
      fatherPhoneNumber,
      classTeacherName
    } = signupInfo;

    if (!name || !email || !password || !branch || !year || !className || !rollNumber || !registrationNumber || !fatherName || !fatherPhoneNumber || !classTeacherName) {
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
      branch,
      year,
      className,
      rollNumber,
      registrationNumber,
      fatherName,
      fatherPhoneNumber,
      classTeacherName
    });

    try {
      const url = `http://localhost:8000/auth/signUp`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          password,
          branch,
          year,
          class: className,
          rollNumber,
          registrationNumber,
          fatherName,
          fatherPhoneNumber,
          classTeacherName
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
        <Box display="flex" mt='100px' flexDirection="column" justifyContent="center" alignItems="center" height="100vh" width="100vw">
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
                    <FormLabel>Roll Number</FormLabel>
                    <Input
                      type="number"
                      name="rollNumber"
                      placeholder="Enter your roll number (4 digits)"
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
                      placeholder="Enter your registration number (5-6 digits)"
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
                      placeholder="Enter your father's phone number (10 digits)"
                      value={signupInfo.fatherPhoneNumber}
                      onChange={handleChange}
                      className={styles.chakraInput}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Class Teacher's Name</FormLabel>
                    {loading ? (
                      <Text>Loading...</Text>
                    ) : error ? (
                      <Text color="red.500">{error}</Text>
                    ) : (
                      <Select
                        name="classTeacherName"
                        placeholder="Select your class teacher"
                        value={signupInfo.classTeacherName}
                        onChange={handleChange}
                        className={styles.chakraInput}
                      >
                        {classTeachers.map(teacher => (
                          <option key={teacher._id} value={teacher.name}>
                            {teacher.name}
                          </option>
                        ))}
                      </Select>
                    )}
                  </FormControl>


                  <FormControl isRequired>
                    <FormLabel>Branch</FormLabel>
                    <Select
                      name="branch"
                      placeholder="Select branch"
                      value={signupInfo.branch}
                      onChange={handleChange}
                      className={styles.chakraSelect}
                    >
                      {branches.map((branch) => (
                        <option key={branch} value={branch}>
                          {branch}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Year</FormLabel>
                    <Select
                      name="year"
                      placeholder="Select year"
                      value={signupInfo.year}
                      onChange={handleChange}
                      className={styles.chakraSelect}
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Class</FormLabel>
                    <Select
                      name="class"
                      placeholder="Select class"
                      value={signupInfo.class}
                      onChange={handleChange}
                      className={styles.chakraSelect}
                    >
                      {classes.map((className) => (
                        <option key={className} value={className}>
                          {className}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <Button type="submit" colorScheme="teal">
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

export default Register;
