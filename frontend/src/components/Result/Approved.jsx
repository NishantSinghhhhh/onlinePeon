import React, { useEffect, useState } from 'react';
import { Box, Stack, Heading, Text, Flex, Badge, Image, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react';
import Navbar from '../navbar/navbar';
import { HashLoader } from 'react-spinners';
import { format } from 'date-fns';

const Approved = () => {
  const [outpasses, setOutpasses] = useState([]);
  const [plRequests, setPlRequests] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLoader, setShowLoader] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState(''); // State to hold the QR code URL
  const { isOpen, onOpen, onClose } = useDisclosure(); // Chakra modal control

  useEffect(() => {
    const fetchApprovedData = async () => {
      const loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
      if (!loginInfo) {
        setError('No registration number found. Please log in again.');
        setLoading(false);
        setShowLoader(false);
        return;
      }

      const { registrationNumber } = loginInfo;

      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/fetch/fetchapproved/${registrationNumber}`);
        const data = await response.json();
        console.log(data)
        if (response.ok) {
          setOutpasses(data.outpasses);
          setPlRequests(data.pls);
          setLeaves(data.leaves);
        } else {
          throw new Error(data.message || 'Failed to fetch approved requests');
        }
      } catch (err) {
        console.error('Error fetching approved data:', err.message);
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedData();

    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Function to handle button click and fetch QR code
  const handleShowQrCode = async (id) => {
    try {
      const qrText = encodeURIComponent(`Card ID: ${id}`);
      const qrUrl = `https://quickchart.io/qr?text=${qrText}&size=150`;

      setQrCodeUrl(qrUrl); // Set the QR code URL
      onOpen(); // Open the modal to display the QR code
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  };

  if (loading || showLoader) {
    return (
      <Flex direction="column" align="center" justify="center" p={5} minH="100vh">
        <HashLoader color="#000000" loading={loading || showLoader} size={50} />
        <Text mt={4}>Loading...</Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex direction="column" align="center" justify="center" p={5} minH="100vh">
        <Text color="red.500">{error}</Text>
      </Flex>
    );
  }

  return (
    <>
      <Navbar />
      <Flex direction="column" align="center" justify="center" p={5}>
        {/* Render Approved Outpasses */}
    {/* Render Approved Outpasses */}
<Heading as="h2" size="lg" mb={4}>
  Approved  Outpasses
</Heading>

{outpasses.length > 0 ? (
  <Stack spacing={4} maxW="md" w="full">
    {outpasses
      .filter((card) => !card.extraValidation || card.extraValidation.toString() !== '1,1') // Filter outpasses where extraValidation is [1,1]
      .map((card, index) => (
        <Box
          key={`outpass-${index}`}
          p={5}
          shadow="md"
          borderWidth="1px"
          borderRadius="md"
          bg="white"
          cursor="pointer"
        >
          <Flex align="center" mb={2}>
            <Heading fontSize="lg" mr={2}>
              {card.reason || 'Approved Outpass'}
            </Heading>
            <Badge colorScheme="green">Approved</Badge>
          </Flex>
          <Text mb={2}>{card.reason || 'Details about the approved outpass'}</Text>
          <Button
            colorScheme="green"
            variant="outline"
            size="sm"
            mt={3}
            borderRadius="full"
            px={4}
            fontWeight="bold"
            _hover={{ bg: 'green.100' }}
            onClick={() => handleShowQrCode(card._id)}
          >
            Show QR Code
          </Button>
        </Box>
      ))}
  </Stack>
) : (
  <Text>No outpasses present.</Text>
)}

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>QR Code</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {qrCodeUrl ? (
                  <Flex justify="center" align="center">
                    <Image src={qrCodeUrl} alt="QR Code" />
                  </Flex>
                ) : (
                  <Text>No QR Code available.</Text>
                )}
              </ModalBody>
              <ModalFooter>
                {/* <Button colorScheme="gray" mr={3} onClick={onClose}>
                 Close
                </Button> */}
              </ModalFooter>
            </ModalContent>
          </Modal>

        {/* Render Approved PL Requests */}
       

   {/* Render Approved Leaves */}
<Heading as="h2" mt={8} size="lg" mb={4}>
  Approved Leaves
</Heading>

{leaves.length > 0 ? (
  <Stack spacing={4} maxW="md" w="full">
    {leaves
      .filter((card) => !card.extraValidation || card.extraValidation.toString() !== '1,1') // Filter leaves where extraValidation is [1,1]
      .map((card, index) => (
        <Box
          key={`leave-${index}`}
          p={5}
          shadow="md"
          borderWidth="1px"
          borderRadius="md"
          bg="white"
          cursor="pointer"
        >
          <Flex align="center" mb={2}>
            <Heading fontSize="lg" mr={2}>
              {card.reason || 'Approved Leave'}
            </Heading>
            <Badge colorScheme="green">Approved</Badge>
          </Flex>
          <Text mb={2}>{card.reason || 'Details about the approved leave'}</Text>
          <Text fontWeight="bold">
            Date: {format(new Date(card.startDate), 'yyyy-MM-dd')} 
            &nbsp; to &nbsp; 
            {format(new Date(card.endDate), 'yyyy-MM-dd')}
          </Text>
          <Button
            colorScheme="green"
            variant="outline"
            size="sm"
            mt={3}
            borderRadius="full"
            px={4}
            fontWeight="bold"
            _hover={{ bg: 'green.100' }}
            onClick={() => handleShowQrCode(card._id)}
          >
            Show QR Code
          </Button>
        </Box>
      ))}
  </Stack>
) : (
  <Text>No approved leaves.</Text>
)}

       <Heading as="h2" size="lg" mt={8} mb={4}>Approved Permitted Leaves</Heading>
{plRequests.length > 0 ? (
  <Stack spacing={4} maxW="md" w="full">
    {plRequests.map((card, index) => (
      <Box
        key={`pl-${index}`}
        p={5}
        shadow="md"
        borderWidth="1px"
        borderRadius="md"
        bg="white"
        cursor="pointer"
      >
        <Flex align="center" mb={2}>
          <Heading fontSize="lg" mr={2}>
            {card.reason || 'Approved PL'}
          </Heading>
          <Badge colorScheme="green">Approved</Badge>
        </Flex>
        <Text mb={2}>{card.reason || 'Details about the approved PL'}</Text>
        <Text fontWeight="bold">
          Date: {format(new Date(card.startDate), 'yyyy-MM-dd')} 
          &nbsp; to &nbsp; 
          {format(new Date(card.endDate), 'yyyy-MM-dd')}
        </Text>
      </Box>
    ))}
  </Stack>
) : (
  <Text>No approved PLs.</Text>
)}
      </Flex>
    </>
  );
};

export default Approved;
