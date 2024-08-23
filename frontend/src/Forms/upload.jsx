import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Box,
  useToast,
  HStack,
} from '@chakra-ui/react';
import styles from './Form.module.css';

const Upload = () => {
  const [document, setDocument] = useState(null);
  const [documentError, setDocumentError] = useState('');
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

    const formData = new FormData();
    formData.append('profileimage', document);

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
    setDocument(null); // Reset the file input
  };

  return (
    <div className={styles.upload}>
      <Box className={styles.box1} p={5} bg="white" borderRadius="md" boxShadow="md">
        <form onSubmit={handleUpload}>
          <h1 className={styles.heading}>Submit Document Supporting your Permitted Leave (PL)</h1>
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
              // colorScheme="teal"
              disabled={!document} // Disable button if no file is selected
            >
              Upload
            </Button>
            <Button 
              className={styles.button1}
              // colorScheme="#EDF2F7"
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
