import React, { useEffect, useState } from 'react';
import {
  Box,
  Stack,
  Heading,
  Text,
  Flex,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import Navbar from '../navbar/navbar';
import { HashLoader } from 'react-spinners';
import { format } from 'date-fns';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const Pending = () => {
  const [outpasses, setOutpasses] = useState([]);
  const [plRequests, setPlRequests] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLoader, setShowLoader] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loadingDocument, setLoadingDocument] = useState(false);

  useEffect(() => {
    const fetchPendingData = async () => {
      const loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
      if (!loginInfo) {
        setError('No registration number found. Please log in again.');
        setLoading(false);
        setShowLoader(false);
        return;
      }

      const { registrationNumber } = loginInfo;

      try {
        const response = await fetch(`https://online-peon.vercel.app/fetch/fetchpending/${registrationNumber}`);
        const data = await response.json();

        if (response.ok) {
          setOutpasses(data.outpasses);
          setPlRequests(data.pls);
          setLeaves(data.leaves);
        } else {
          throw new Error(data.message || 'Failed to fetch pending requests');
        }
      } catch (err) {
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
        setShowLoader(false);
      }
    };

    fetchPendingData();
  }, []);

  const handleCardClick = (request) => {
    setSelectedRequest(request);
    setLoadingDocument(true);

    if (request.document) {
      try {
        // Convert base64 string to a Blob
        const byteCharacters = atob(request.document.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        
        // Create a URL for the Blob
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (error) {
        console.error('Error creating PDF Blob:', error);
        setPdfUrl(null);
      }
    } else {
      setPdfUrl(null);
    }

    onOpen();
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
    return <Text>{error}</Text>;
  }

  return (
    <>
      <Navbar />
      <Flex direction="column" align="center" justify="center" p={5}>
        {/* Render Outpasses */}
        <Heading as="h2" size="lg" mb={4}>Outpasses</Heading>
        {outpasses.length > 0 ? (
          <Stack spacing={4} maxW="md" w="full">
            {outpasses.map((card, index) => (
              <Box
                key={`outpass-${index}`}
                p={5}
                shadow="md"
                borderWidth="1px"
                borderRadius="md"
                bg="white"
              >
                <Flex align="center" mb={2}>
                  <Heading fontSize="lg" mr={2}>
                    {card.reason || 'Pending Outpass'}
                  </Heading>
                  <Badge colorScheme="yellow">Pending</Badge>
                </Flex>
                <Text mb={2}>{card.reason || 'Details about the pending outpass'}</Text>
                <Text fontWeight="bold">
                  From: {card.startHour || '00:00'} 
                  &nbsp; to &nbsp; 
                  {card.endHour || '00:00'}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <Text>No pending outpasses.</Text>
        )}

        {/* Render PL Requests */}
        <Heading as="h2" size="lg" mt={8} mb={4}>Permitted Leaves</Heading>
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
                onClick={() => handleCardClick(card)}
              >
                <Flex align="center" mb={2}>
                  <Heading fontSize="lg" mr={2}>
                    {card.reason || 'Pending PL'}
                  </Heading>
                  <Badge colorScheme="yellow">Pending</Badge>
                </Flex>
                <Text mb={2}>{card.reason || 'Details about the pending PL'}</Text>
                <Text fontWeight="bold">
                  From: {format(new Date(card.startDate), 'yyyy-MM-dd')} 
                  &nbsp; to &nbsp; 
                  {format(new Date(card.endDate), 'yyyy-MM-dd')}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <Text>No pending PLs.</Text>
        )}

        {/* Render Leaves */}
        <Heading as="h2" mt={8} size="lg" mb={4}>Leaves</Heading>
        {leaves.length > 0 ? (
          <Stack spacing={4} maxW="md" w="full">
            {leaves.map((card, index) => (
              <Box
                key={`leave-${index}`}
                p={5}
                shadow="md"
                borderWidth="1px"
                borderRadius="md"
                bg="white"
                onClick={() => handleCardClick(card)}
              >
                <Flex align="center" mb={2}>
                  <Heading fontSize="lg" mr={2}>
                    {card.reason || 'Pending Leave'}
                  </Heading>
                  <Badge colorScheme="yellow">Pending</Badge>
                </Flex>
                <Text mb={2}>{card.reason || 'Details about the pending leave'}</Text>
                <Text fontWeight="bold">
                  From: {format(new Date(card.startDate), 'yyyy-MM-dd')} 
                  &nbsp; to &nbsp; 
                  {format(new Date(card.endDate), 'yyyy-MM-dd')}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <Text>No pending leaves.</Text>
        )}
      </Flex>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Request Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedRequest && (
              <Box>
                <Text><strong>Name:</strong> {selectedRequest.firstName} {selectedRequest.lastName}</Text>
                <Text><strong>Class:</strong> {selectedRequest.className}</Text>
                <Text><strong>Roll Number:</strong> {selectedRequest.rollNumber}</Text>
                <Text><strong>Registration Number:</strong> {selectedRequest.registrationNumber}</Text>
                <Text><strong>Classes Missed:</strong> {selectedRequest.classesMissed}</Text>
                <Text><strong>Reason:</strong> {selectedRequest.reason}</Text>
                <Text><strong>From:</strong> {format(new Date(selectedRequest.startDate), 'yyyy-MM-dd')}</Text>
                <Text><strong>To:</strong> {format(new Date(selectedRequest.endDate), 'yyyy-MM-dd')}</Text>
                <Text><strong>Document:</strong></Text>
                {loadingDocument ? (
                  <Text>Loading document...</Text>
                ) : (
                  pdfUrl && (
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.15.349/build/pdf.worker.min.js">
                      <Viewer fileUrl={pdfUrl} />
                    </Worker>
                  )
                )}
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Pending;

// find a good function for base64 and convert string into an image ort pdf