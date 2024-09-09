import React, { useState } from 'react';
import {
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Stack,
  useToast
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './signIn.module.css';

const SignInCard = () => {
  const [isStudent, setIsStudent] = useState(true);
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: '',
    registrationNumber: '',
    staffId: ''
  });
  const navigate = useNavigate();
  const toast = useToast();

  const handleStudentClick = () => {
    setIsStudent(true);
  };

  const handleStaffClick = () => {
    setIsStudent(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password, registrationNumber } = loginInfo;

    // Validate registration number length
    if (registrationNumber.length < 5 || registrationNumber.length > 6) {
        return handleError('Registration number must be 5 or 6 characters long');
    }

    if (!email || !password || !registrationNumber) {
      return handleError('All fields are required');
    }

    try {
      const url = `http://localhost:8000/auth/login`;
      console.log('Sending request with:', {
        email,
        password,
        registrationNumber,
        isStudent: true
      });

      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
          registrationNumber,
          isStudent: true
        })
      });

      const result = await response.json();
      console.log('API response:', result);

      if (!response.ok) {
        throw new Error(result.message || 'An unexpected error occurred');
      }

      const { success, message, jwtToken, name, error } = result;

      if (success) {
        handleSuccess(message);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('loggedInUser', name);
        // Store the login info in local storage
        localStorage.setItem('loginInfo', JSON.stringify({ email, registrationNumber, isStudent: true }));
        setTimeout(() => {
          navigate('/home');
        }, 1000);
      } else if (error) {
        const details = error?.details && Array.isArray(error.details) ? error.details[0]?.message : error.message;
        handleError(details || message);
      } else {
        handleError(message);
      }
    } catch (err) {
      handleError(err.message || 'An unexpected error occurred');
    }
  };
  

  const staffLogin = async (e) => {
    e.preventDefault();
    const { email, password, staffId } = loginInfo;
  
    if (!email || !password || !staffId) {
      return handleError('All fields are required');
    }
  
    try {
      const url = `http://localhost:8000/auth/loginStaff`;
      console.log('Sending request:', { email, password, staffId, isStudent: false });
  
      const response = await fetch(url, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, staffId, isStudent: false })
      });
  
      const result = await response.json();
      console.log('Full API response:', result);
  
      if (!response.ok) {
        throw new Error(result.message || 'An unexpected error occurred');
      }
  
      const { success, message, jwtToken, staff } = result;
  
      if (success && staff) {
        console.log('Login successful');
        console.log('JWT Token:', jwtToken);
        console.log('Staff details:', staff);
  
        // Log individual staff properties
        console.log('Position:', staff.position);
  
        handleSuccess(message);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('loggedInUser', staff.name);
        localStorage.setItem('loginInfo', JSON.stringify({
          email: staff.email,
          staffId: staff.staffId,
          isStudent: false
        }));
  
        // Navigate based on the position
        if (staff.position === 'Class Teacher') {
          setTimeout(() => navigate('/StaffHome'), 1000);
        } else if (staff.position === 'HOD') {
          setTimeout(() => navigate('/HOD'), 1000);
        } else if (staff.position === 'Warden') {
          setTimeout(() => navigate('/warden'), 1000);
        } else {
          setTimeout(() => navigate('/DefaultStaffHome'), 1000); // Fallback route
        }
      } else if (success && !staff) {
        handleError('Login successful, but staff details are missing');
      } else {
        handleError(message || 'An unexpected error occurred');
      }
    } catch (err) {
      console.error('Login error:', err);
      handleError(err.message || 'An unexpected error occurred');
    }
  };
  

  const handleError = (message) => {
    console.error(message);
    toast({
      title: "Login Failed",
      description: message,
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleSuccess = (message) => {
    console.log(message);
    toast({
      title: "Login Successful",
      description: message,
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <div className={styles.item}>
      <Card
        maxW='md'
        borderWidth='1px'
        borderRadius='md'
        p={4}
        m={4}
        boxShadow='md'
      >
        <CardBody>
          <Stack spacing={4}>
            <Text fontSize='xl' fontWeight='bold'>
              {isStudent ? 'Sign In as Student' : 'Sign In as Staff'}
            </Text>
            <Stack direction='row' spacing={4} mt={4}>
              <Button
                colorScheme='gray'
                flex='1'
                variant={isStudent ? 'solid' : 'outline'}
                color={isStudent ? 'gray.600' : 'gray.400'}
                borderColor={isStudent ? 'gray.600' : 'gray.400'}
                onClick={handleStudentClick}
              >
                Sign In as Student
              </Button>
              <Button
                colorScheme='gray'
                flex='1'
                variant={!isStudent ? 'solid' : 'outline'}
                color={!isStudent ? 'gray.600' : 'gray.400'}
                borderColor={!isStudent ? 'gray.600' : 'gray.400'}
                onClick={handleStaffClick}
              >
                Sign In as Staff
              </Button>
            </Stack>
            <form onSubmit={isStudent ? handleLogin : staffLogin}>
              <FormControl id='email'>
                <FormLabel>Email</FormLabel>
                <Input
                  type='email'
                  name='email'
                  placeholder='Enter your email'
                  value={loginInfo.email}
                  onChange={handleChange}
                  required
                />
              </FormControl>
              {isStudent ? (
                <>
                  <FormControl id='registrationNumber'>
                    <FormLabel>Registration Number</FormLabel>
                    <Input
                      type='text'
                      name='registrationNumber'
                      placeholder='Enter your Registration Number'
                      value={loginInfo.registrationNumber}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                </>
              ) : (
                <>
                  <FormControl id='staffId'>
                    <FormLabel>Staff ID</FormLabel>
                    <Input
                      type='text'
                      name='staffId'
                      placeholder='Enter your staff ID'
                      value={loginInfo.staffId}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                </>
              )}
              <FormControl id='password'>
                <FormLabel>Password</FormLabel>
                <Input
                  type='password'
                  name='password'
                  placeholder='Enter your password'
                  value={loginInfo.password}
                  onChange={handleChange}
                  required
                />
              </FormControl>
              <Button
                type='submit'
                colorScheme='gray'
                variant='solid'
                color='gray.600'
                borderColor='gray.600'
                mt={4}
                width='full'
              >
                {isStudent ? 'Submit as Student' : 'Submit as Staff'}
              </Button>
            </form>
            <Link to={isStudent ? "/Register" : "/Register1"}>
              <Button
                colorScheme='gray'
                variant='solid'
                color='gray.600'
                borderColor='gray.600'
                mt={4}
                width='full'
              >
                {isStudent ? 'Register Here' : 'Register as Staff'}
              </Button>
            </Link>
          </Stack>
        </CardBody>
      </Card>
    </div>
  );
};

export default SignInCard;
