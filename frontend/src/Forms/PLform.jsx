import React, { useState } from 'react';
import { Card as ChakraCard, CardHeader, CardBody, CardFooter, Heading, FormControl, FormLabel, Input, Button, Stack, InputGroup, InputLeftAddon, Textarea, Box, Text } from '@chakra-ui/react';
import Navbar from '../components/navbar/navbar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './Form.module.css';

const PLForm = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [documents, setDocuments] = useState(null);
  const [documentError, setDocumentError] = useState('');
  
  // State variables for the form fields
  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [classesMissed, setClassesMissed] = useState('');
  const [reason, setReason] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) { // 5MB size limit
        setDocumentError('File size should be less than 5MB');
        setDocuments(null);
      } else if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
        setDocumentError('Only PDF, JPEG, and PNG files are allowed');
        setDocuments(null);
      } else {
        setDocumentError('');
        setDocuments(file);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Data extraction
    const formData = {
      name,
      className,
      rollNumber,
      classesMissed,
      reason,
      startDate,
      endDate,
      documents
    };
    console.log('Form Data:', formData);
    // You can now send this data to your API or handle it as needed
  };

  return (
    <>
      <Navbar />
      <div className={styles.main}>
        <ChakraCard borderWidth='1px' borderRadius='md' p={4} boxShadow='md' w='full'>
          <CardHeader>
            <Heading size='lg'>PL Request Form</Heading>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input
                    placeholder='Your Name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles['chakra-input']}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Class</FormLabel>
                  <Input
                    placeholder='Class'
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className={styles['chakra-input']}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Roll Number</FormLabel>
                  <Input
                    placeholder='Roll Number'
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className={styles['chakra-input']}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Number of Classes Missed</FormLabel>
                  <Input
                    type='number'
                    placeholder='Number of Classes Missed'
                    value={classesMissed}
                    onChange={(e) => setClassesMissed(e.target.value)}
                    className={styles['chakra-input']}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Reason for Absence</FormLabel>
                  <Textarea
                    placeholder='Reason for Absence'
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className={styles['chakra-input']}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Supporting Documents</FormLabel>
                  <Box 
                    border='1px solid #e2e8f0' 
                    p={4} 
                    borderRadius='md' 
                    bg='gray.50' 
                    _hover={{ borderColor: 'teal.500' }} 
                    transition='border-color 0.2s'
                    textAlign='center'
                  >
                    <Input 
                      type='file' 
                      accept='.pdf,.jpg,.jpeg,.png' 
                      onChange={handleFileChange} 
                      display='none' 
                      id='file-upload' 
                    />
                    <label htmlFor='file-upload'>
                      <Button colorScheme='teal' variant='outline' as='span'>
                        Upload Document
                      </Button>
                    </label>
                    {documentError && (
                      <Text color='red.500' mt={2}>{documentError}</Text>
                    )}
                    {documents && (
                      <Box mt={2} border='1px solid #e2e8f0' p={2} borderRadius='md' bg='white'>
                        <strong>Selected File:</strong> {documents.name}
                        <br />
                        <small>Size: {(documents.size / 1000000).toFixed(2)} MB</small>
                      </Box>
                    )}
                  </Box>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Date Range</FormLabel>
                  <Stack spacing={4}>
                    <FormControl>
                      <FormLabel>Start Date</FormLabel>
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat='MMMM d, yyyy'
                        className={styles['chakra-input']}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>End Date</FormLabel>
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        dateFormat='MMMM d, yyyy'
                        className={styles['chakra-input']}
                      />
                    </FormControl>
                  </Stack>
                </FormControl>
              </Stack>
            </form>
          </CardBody>
          <CardFooter>
            <Button colorScheme='teal' type='submit'>
              Submit
            </Button>
          </CardFooter>
        </ChakraCard>
      </div>
    </>
  );
};

export default PLForm;
