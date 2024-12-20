import React, { useEffect, useState, useRef } from 'react';
import { Box, Flex, Text, useToast } from '@chakra-ui/react';
import { Html5Qrcode } from 'html5-qrcode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Navbar from './navbar';

const Scan = () => {
  const toast = useToast();
  const readerRef = useRef(null);
  const [objectId, setObjectId] = useState(null);
  const [error, setError] = useState(null);
  const [scannedOnce, setScannedOnce] = useState(false);
  const [animation, setAnimation] = useState(null); // New state for animation
  const html5QrCodeRef = useRef(null);
  const navigate = useNavigate(); // Initialize navigate

  const [successOutpasses, setSuccessOutpasses] = useState(0); // Local state for success count
  const [failureOutpasses, setFailureOutpasses] = useState(0); // Local state for failure count

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
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/check/checkOutpass`, { objectId: id });
      
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
        const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/update/updateOutpass/guard/${id}`);

        if (response.status === 200 && response.data.success) {
            setAnimation('success');
            setTimeout(() => {
                setAnimation(null);
                navigate('/guard'); // Redirect to /guard
            }, 2000); // Hide animation after 2 seconds
        } else {
            toast({
                title: 'Update Error',
                description: response.data.message || 'Failed to update validation array.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    } catch (err) {
        console.error('Error updating validation array:', err);

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
      <Navbar/>
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
