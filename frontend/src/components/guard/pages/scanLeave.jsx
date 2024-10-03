import { React, useEffect, useState, useRef } from 'react';
import { Box, Flex, Text, useToast } from '@chakra-ui/react';
import { Html5Qrcode } from 'html5-qrcode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import { useLeave  } from '../../../context/LeaveNumContext'; // Import the leave context

const ScanLeave = () => {
  const toast = useToast();
  const readerRef = useRef(null);
  const [objectId, setObjectId] = useState(null);
  const [error, setError] = useState(null);
  const [scannedOnce, setScannedOnce] = useState(false);
  const [animation, setAnimation] = useState(null);
  const html5QrCodeRef = useRef(null);
  const navigate = useNavigate();

  // Get the context values
  const { setSuccessLeaves, setFailureLeaves } = useLeave();

  useEffect(() => {
    html5QrCodeRef.current = new Html5Qrcode("reader");
    const html5QrCode = html5QrCodeRef.current;

    const config = {
      fps: 10,
      qrbox: { width: 600, height: 600 },
    };

    const onScanSuccess = (decodedText, decodedResult) => {
      console.log('Scan Success:', decodedText);
      console.log('Decoded Result:', decodedResult);
      
      if (!scannedOnce) {
        try {
          let id;

          // First, check if the scanned text follows a known pattern (like "Leave ID: ")
          if (decodedText.startsWith("Leave ID: ")) {
            id = decodedText.split("Leave ID: ")[1].trim();
          } else if (decodedText.startsWith("Card ID: ")) {
            // Handle the "Card ID: " pattern
            id = decodedText.split("Card ID: ")[1].trim();
          } else {
            // Try to parse as JSON, but handle parsing errors
            try {
              const scannedData = JSON.parse(decodedText);
              id = scannedData._id || scannedData.id;
            } catch (jsonErr) {
              console.error('Not a valid JSON format:', jsonErr);
              id = decodedText; // Handle non-JSON format
            }
          }

          if (id) {
            setObjectId(id);
            toast({
              title: 'Leave Scanned!',
              description: `Leave ID: ${id}`,
              status: 'success',
              duration: 5000,
              isClosable: true,
            });
            setScannedOnce(true);
            stopScanner(html5QrCodeRef.current);
            // Trigger the updateLeaveValidation function
            updateLeaveValidation(id); // Call this function here
          }
        } catch (err) {
          console.error('Error processing scanned data:', err);
          toast({
            title: 'Scan Error',
            description: 'Unable to process scanned data.',
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

  const updateLeaveValidation = async (id) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/update/updateLeave/guard/${id}`);

      if (response.status === 200 && response.data.success) {
        setAnimation('success');
        setSuccessLeaves(prev => prev + 1); // Increment success count
        setTimeout(() => {
          setAnimation(null);
          navigate('/guard'); // Redirect to /guard after success
        }, 2000);
      } else {
        setFailureLeaves(prev => prev + 1); // Increment failure count if applicable
        toast({
          title: 'Update Error',
          description: response.data.message || 'Failed to update leave validation.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error('Error updating leave validation:', err);
      setFailureLeaves(prev => prev + 1); // Increment failure count on error
      toast({
        title: 'Update Error',
        description: 'Failed to update leave validation.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <div>
      <Navbar />
      <Box display="flex" flexDirection="column" alignItems="center" mt="50px">
        <Text fontSize="2xl" mb="20px">Leave QR Code Scanner</Text>
        <Flex
          border="2px solid #333"
          borderRadius="10px"
          p="20px"
          boxShadow="0 4px 10px rgba(0, 0, 0, 0.1)"
          bg="#f9f9f9"
          width="600px"
          height="600px"
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
          <Text>Leave Successfully Processed!</Text>
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
          <Text>Leave Processing Failed!</Text>
        </Box>
      )}
    </div>
  );
};

export default ScanLeave;
