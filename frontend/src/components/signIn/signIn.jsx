import React, { useState, useContext } from 'react';
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
import { LoginContext } from '../../context/LoginContext';

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
  const { updateLoginInfo } = useContext(LoginContext);

  const handleStudentClick = () => setIsStudent(true);
  const handleStaffClick = () => setIsStudent(false);

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

    if (registrationNumber.length < 5 || registrationNumber.length > 6) {
      return handleError('Registration number must be 5 or 6 characters long');
    }

    if (!email || !password || !registrationNumber) {
      return handleError('All fields are required');
    }

    try {
      const url = `http://localhost:8000/auth/login`;
      const response = await fetch(url, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          registrationNumber,
          isStudent: true
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'An unexpected error occurred');
      }

      const { success, message, jwtToken, name, error } = result;

      if (success) {
        handleSuccess(message);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('loggedInUser', name);
        localStorage.setItem('loginInfo', JSON.stringify({ email, registrationNumber, isStudent: true }));

        updateLoginInfo({
          email,
          registrationNumber,
          isStudent: true
        });

        setTimeout(() => navigate('/home'), 1000);
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
      const response = await fetch(url, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, staffId, isStudent: false })
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || 'An unexpected error occurred');
      }
  
      const { success, message, jwtToken, staff } = result;
  
      if (success && staff) {
        handleSuccess(message);
        localStorage.setItem('token', jwtToken);
  
        updateLoginInfo({
          name: staff.name,
          position: staff.position,
          staffId: staff.staffId,
          email: staff.email,
          contactNumber: staff.contactNumber,
          classAssigned: staff.classAssigned,
          branchAssigned: staff.branchAssigned
        });
  
        // Redirect based on position
        switch (staff.position) {
          case 'Class Teacher':
            setTimeout(() => navigate('/StaffHome'), 1000);
            break;
          case 'HOD':
            setTimeout(() => navigate('/HOD'), 1000);
            break;
          case 'Warden':
            setTimeout(() => navigate('/WARDEN'), 1000);
            break;
          case 'Joint Director':
          case 'Director':
          case 'Principal':
            setTimeout(() => navigate('/Admin'), 1000);
            break;
          case 'Security Guard':
            setTimeout(() => navigate('/Guard'), 1000); // Redirect to the security guard home page
            break;
          default:
            setTimeout(() => navigate('/DefaultStaffHome'), 1000);
            break;
        }
      } else if (success && !staff) {
        handleError('Login successful, but staff details are missing');
      } else {
        handleError(message || 'An unexpected error occurred');
      }
    } catch (err) {
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
              ) : (
                <FormControl id='staffId'>
                  <FormLabel>Staff ID</FormLabel>
                  <Input
                    type='text'
                    name='staffId'
                    placeholder='Enter your Staff ID'
                    value={loginInfo.staffId}
                    onChange={handleChange}
                    required
                  />
                </FormControl>
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
                mt={4}
                colorScheme='blue'
                type='submit'
                width='full'
              >
                {isStudent ? 'Sign In as Student' : 'Sign In as Staff'}
              </Button>
            </form>
            <Text mt={4}>
              {isStudent ? (
                <>
                  New to the platform? <Link to='/Register'>Register here</Link>
                </>
              ) : (
                <>
                  New staff? <Link to='/Register1'>Register here</Link>
                </>
              )}
            </Text>
          </Stack>
        </CardBody>
      </Card>
    </div>
  );
};

export default SignInCard;
