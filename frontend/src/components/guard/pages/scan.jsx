import React, { useEffect, useState, useRef } from 'react';
import { Box, Flex, Text, useToast } from '@chakra-ui/react';
import { Html5Qrcode } from 'html5-qrcode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Scan = ({ setSuccessLeaves, setFailureLeaves, setSuccessOutpasses, setFailureOutpasses }) => {
  const toast = useToast();
  const readerRef = useRef(null);
  const [objectId, setObjectId] = useState(null);
  const [error, setError] = useState(null);
  const [scannedOnce, setScannedOnce] = useState(false);
  const [animation, setAnimation] = useState(null); // New state for animation
  const html5QrCodeRef = useRef(null);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    html5QrCodeRef.current = new Html5Qrcode("reader");

    const html5QrCode = html5QrCodeRef.current;

    const config = {
      fps: 10,
      qrbox: { width: 600, height: 600 }, // Increased QR code scanning area size
    };

    const onScanSuccess = (decodedText, decodedResult) => {
      console.log('Scan Success:', decodedText);
      console.log('Decoded Result:', decodedResult);

      if (!scannedOnce) {
        try {
          let id;
          if (decodedText.startsWith("Card ID: ")) {
            id = decodedText.split("Card ID: ")[1].trim();
          } else {
            const scannedData = JSON.parse(decodedText);
            id = scannedData._id || scannedData.id;
          }

          if (id) {
            setObjectId(id);
            toast({
              title: 'QR Code Scanned!',
              description: `Object ID: ${id}`,
              status: 'success',
              duration: 5000,
              isClosable: true,
            });
            setScannedOnce(true);
            stopScanner(html5QrCode);
            // Send the objectId to the backend
            sendObjectIdToBackend(id);
          }
        } catch (err) {
          console.error('Error parsing scanned data:', err);
          toast({
            title: 'Scan Error',
            description: 'Unable to parse scanned data.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      }
    };

    html5QrCode.start(
      { facingMode: "environment" },
      config,
      onScanSuccess,
      // onScanFailure
    ).catch(err => {
      console.error("Start failed: ", err);
      toast({
        title: 'Camera Error',
        description: 'Unable to start QR code scanner.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    });

    return () => {
      stopScanner(html5QrCode);
    };
  }, [toast, scannedOnce]);

  const stopScanner = (scanner) => {
    if (scanner && scanner.isScanning) {
      scanner.stop().catch(err => {
        console.error("Stop failed: ", err);
        toast({
          title: 'Error',
          description: 'Failed to stop QR code scanner.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
    }
  };

  const sendObjectIdToBackend = async (id) => {
    try {
      const response = await axios.post('https://online-peon.vercel.app/check/checkOutpass', { objectId: id });
      
      if (response.data.success) {
        // Trigger success animation
        setAnimation('success'); 
        setSuccessOutpasses(prev => prev + 1); // Increment success outpass count
        
        // Call function to update validation array
        await updateValidationArray(id);
      } else {
        setAnimation('failure'); // Trigger failure animation
        setFailureOutpasses(prev => prev + 1); // Increment failure outpass count
        setTimeout(() => setAnimation(null), 2000); // Hide animation after 2 seconds
        toast({
          title: 'Failure',
          description: response.data.message || 'Processing failed.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error('Error sending object ID to backend:', err);
      setAnimation('failure'); // Trigger failure animation
      setFailureOutpasses(prev => prev + 1); // Increment failure outpass count
      setTimeout(() => setAnimation(null), 2000); // Hide animation after 2 seconds
      toast({
        title: 'Server Error',
        description: 'Failed to process object ID.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  const updateValidationArray = async (id) => {
    try {
        // Debugging: Log the incoming request ID
        console.log(`Attempting to update validation array for object ID: ${id}`);

        // Make the PUT request to update the validation array
        const response = await axios.put(`https://online-peon.vercel.app/update/updateOutpass/guard/${id}`);

        // Debugging: Log the response from the server
        console.log('Response from updateValidationArray request:', response);

        if (response.status === 200 && response.data.success) {
            // Debugging: Log success status
            console.log('Validation array updated successfully.');

            // Trigger success animation and handle navigation
            setAnimation('success');
            setTimeout(() => {
                setAnimation(null);
                navigate('/guard'); // Redirect to /guard
            }, 2000); // Hide animation after 2 seconds
        } else {
            // Debugging: Log the failure message from the server
            console.log('Failed to update validation array:', response.data.message);

            toast({
                title: 'Update Error',
                description: response.data.message || 'Failed to update validation array.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    } catch (err) {
        // Enhanced error logging
        console.error('Error updating validation array:', {
            message: err.message,
            stack: err.stack,
            requestId: id, // Log the ID associated with the request
            timestamp: new Date().toISOString() // Log the timestamp of the error
        });

        toast({
            title: 'Update Error',
            description: 'Failed to update validation array.',
            status: 'error',
            duration: 5000,
            isClosable: true,
        });
    }
};

  return (
    <div>
      {/* Render your scanner here */}
      <Box display="flex" flexDirection="column" alignItems="center" mt="50px">
        <Text fontSize="2xl" mb="20px">QR Code Scanner</Text>
        <Flex
          border="2px solid #333"
          borderRadius="10px"
          p="20px"
          boxShadow="0 4px 10px rgba(0, 0, 0, 0.1)"
          bg="#f9f9f9"
          width="600px" // Increased width
          height="600px" // Increased height
          position="relative"
        >
          <div id="reader" style={{ width: '100%', height: '100%' }} ref={readerRef}></div>
        </Flex>
      </Box>

      {animation === 'success' && (
        <Box
          position="fixed"
          top="0"
          left="0"
          width="100%"
          height="100%"
          bg="green.500"
          color="white"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex="overlay"
          fontSize="2xl"
        >
          <Text>Success!</Text>
        </Box>
      )}
      {animation === 'failure' && (
        <Box
          position="fixed"
          top="0"
          left="0"
          width="100%"
          height="100%"
          bg="red.500"
          color="white"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex="overlay"
          fontSize="2xl"
        >
          <Text>Failure!</Text>
        </Box>
      )}
    </div>
  );
};

export default Scan;
