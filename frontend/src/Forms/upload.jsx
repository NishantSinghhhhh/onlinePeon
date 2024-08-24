import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Box,
  useToast,
  HStack,
  Text
} from '@chakra-ui/react';
import styles from './Form.module.css';

const Upload = () => {
  const [document, setDocument] = useState(null);
  const [documentError, setDocumentError] = useState('');
  const [rollNumberInput, setRollNumberInput] = useState('');
  const toast = useToast();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) { // 5MB size limit
        setDocumentError('File size should be less than 5MB');
        setDocument(null);
      } else if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
        setDocumentError('Only PDF, JPEG, and PNG files are allowed');
        setDocument(null);
      } else {
        setDocumentError('');
        setDocument(file);
      }
    } else {
      setDocument(null); // Clear document if no file is selected
    }
  };

  const handleCancel = () => {
    setDocument(null);
    setDocumentError('');
    setRollNumberInput(''); // Clear roll number input
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!document) {
      toast({
        title: 'Error',
        description: 'Please select a document to upload.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!rollNumberInput) {
      toast({
        title: 'Error',
        description: 'Please enter your roll number.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append('profileimage', document);
    formData.append('rollNumber', rollNumberInput);

    try {
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        return handleError(result.message || 'An error occurred while uploading the document.');
      }

      if (result.success) {
        handleSuccess(result.message);
      } else {
        handleError(result.message || 'An unexpected error occurred.');
      }
    } catch (err) {
      handleError('An unexpected error occurred.');
    }

    try {
      const url = 'http://localhost:8000/auth/upload'; // Ensure this URL is correct
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
      description: `Document uploaded successfully. Roll Number: ${rollNumberInput}`,
      status: 'success',
      duration: 5000,
      isClosable: true
    });
    setDocument(null); // Reset the file input
    setRollNumberInput(''); // Clear roll number input
    console.log(`Roll Number: ${rollNumberInput}`); // Print roll number to console
  };

  return (
    <div className={styles.upload}>
      <Box className={styles.box1} p={5} bg="white" borderRadius="md" boxShadow="md">
        <form onSubmit={handleUpload}>
          <h1 className={styles.heading}>Submit Document Supporting your Permitted Leave (PL)</h1>
          <FormControl isRequired>
            <FormLabel className={styles.box2}>Enter Roll Number</FormLabel>
            <Input 
              type="text" 
              placeholder="Enter your roll number" 
              value={rollNumberInput}
              onChange={(e) => setRollNumberInput(e.target.value)}
            />
          </FormControl>
          {/* <Text mb={4}>Roll Number from Context: {rollNumberInput}</Text> Display the roll number from input */}
          <FormControl isRequired>
            <FormLabel className={styles.box2}>Select Document</FormLabel>
            <Input 
              type="file" 
              accept=".pdf,.jpg,.jpeg,.png" 
              onChange={handleFileChange} 
            />
            {documentError && <Box color="red.500" mt={2}>{documentError}</Box>}
          </FormControl>
          <HStack spacing={4} mt={4}>
            <Button 
              className={styles.button1}
              type="submit" 
              disabled={!document} // Disable button if no file is selected
            >
              Upload
            </Button>
            <Button 
              className={styles.button1}
              onClick={handleCancel}
              disabled={!document} // Disable cancel button if no file is selected
            >
              Cancel
            </Button>
          </HStack>
        </form>
      </Box>
    </div>
  );
};

export default Upload;
