import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Box,
  useToast
} from '@chakra-ui/react';

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
    }
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
    formData.append('document', document);

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
    <Box p={5}>
      <form action='/upload' method='POST' enctype="multipart/form-data" onSubmit={handleUpload}>
        <FormControl isRequired>
          <FormLabel>Upload Document</FormLabel>
          <Input 
            type="file" 
            accept=".pdf,.jpg,.jpeg,.png" 
            name="profileimage"
            onChange={handleFileChange} 
          />
          {documentError && <Box color="red.500" mt={2}>{documentError}</Box>}
        </FormControl>
        <Button 
          type="submit" 
          colorScheme="teal" 
          mt={4}
        >
          Upload
        </Button>
      </form>
    </Box>
  );
};

export default Upload;
