import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Text,
  Card as ChakraCard,
  CardBody,
  CardHeader,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import styles from './Form.module.css'; // Import the CSS module

const StaffRegistration = () => {
  const [signupInfo, setSignupInfo] = useState({
    name: '',
    email: '',
    password: '',
    staffId: '',
    contactNumber: '',
    position: '', // Add position state
    classAssigned: '', // Add classAssigned state
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
        staffId, 
        contactNumber,
        position,
        classAssigned, // Add classAssigned to destructuring
    } = signupInfo;

    // Check for empty fields
    if (!name || !email || !password || !staffId || !contactNumber || !position || 
        (position === 'Class Teacher' && !classAssigned) ||
        (position === 'HOD' && !classAssigned) ||
        (position === 'Warden' && !classAssigned)) { // Validation for Class Teacher, HOD, and Warden
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
                staffId,
                contactNumber,
                position,
                classAssigned: (position === 'Class Teacher' || position === 'HOD' || position === 'Warden') ? classAssigned : undefined, // Only send classAssigned if position is "Class Teacher", "HOD", or "Warden"
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

        <Box display="flex" mt='-100px' flexDirection="column" justifyContent="center" alignItems="center" height="100vh" width="100vw">
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
                Administration Registration Form
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
                    <FormLabel>Position</FormLabel>
                    <Select
                      name="position"
                      placeholder="Select your position"
                      value={signupInfo.position}
                      onChange={handleChange}
                      className={styles.chakraInput}
                    >
                      <option value="HOD">HOD</option>
                      <option value="Class Teacher">Class Teacher</option>
                      <option value="Warden">Warden</option>
                      <option value="Joint Director">Joint Director</option>
                      <option value="Director">Director</option>
                    </Select>
                  </FormControl>

                  {(signupInfo.position === 'Class Teacher' || signupInfo.position === 'HOD' || signupInfo.position === 'Warden') && (
                    <FormControl isRequired>
                      <FormLabel>Assigned Class</FormLabel>
                      <Select
                        name="classAssigned"
                        placeholder="Select your class"
                        value={signupInfo.classAssigned}
                        onChange={handleChange}
                        className={styles.chakraInput}
                      >
                        {[
                          'FE-Comp-A', 'FE-Comp-B', 'FE-IT-A', 'FE-IT-B', 'FE-ENTC-A', 'FE-ENTC-B', 'FE-Mech-A', 'FE-Mech-B',
                          'SE-Comp-A', 'SE-Comp-B', 'SE-IT-A', 'SE-IT-B', 'SE-ENTC-A', 'SE-ENTC-B', 'SE-Mech-A', 'SE-Mech-B',
                          'TE-Comp-A', 'TE-Comp-B', 'TE-IT-A', 'TE-IT-B', 'TE-ENTC-A', 'TE-ENTC-B', 'TE-Mech-A', 'TE-Mech-B',
                          'BE-Comp-A', 'BE-Comp-B', 'BE-IT-A', 'BE-IT-B', 'BE-ENTC-A', 'BE-ENTC-B', 'BE-Mech-A', 'BE-Mech-B',
                          'ARE'
                        ].map((cls) => (
                          <option key={cls} value={cls}>{cls}</option>
                        ))}
                      </Select>
                    </FormControl>
                  )}

                  <Button type="submit" 
                  >Register</Button>
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
