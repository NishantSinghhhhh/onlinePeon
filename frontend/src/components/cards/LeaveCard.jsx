import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  Card,
  CardBody,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Divider,
  Input,
} from '@chakra-ui/react';

const LeaveCard = ({ data, onStatusChange, onDateChange }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [startDate, setStartDate] = useState(new Date(data.startDate).toISOString().substr(0, 10));
  const [endDate, setEndDate] = useState(new Date(data.endDate).toISOString().substr(0, 10));
  
  const handleEdit = async (field, value) => {
    if (field === 'startDate') setStartDate(value);
    if (field === 'endDate') setEndDate(value);
  
    const updatedData = {
      id: data._id, 
      startDate: field === 'startDate' ? value : startDate,
      endDate: field === 'endDate' ? value : endDate,
    };
  
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/edit/editLeave`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log('Leave updated successfully:', result);
      } else {
        const errorData = await response.json();
        console.error('Error updating leave:', errorData.message);
      }
    } catch (error) {
      console.error('An error occurred while updating the leave:', error);
    }
  
    if (onDateChange) {
      onDateChange(updatedData);
    }
  };

  return (
    <>
      <Card
        borderWidth={1}
        mb="20px"
        borderRadius="md"
        boxShadow="md"
        width="90%"
        maxW="800px"
        mx="auto"
        p={4}
        bg="white"
        borderColor="gray.200"
      >
        <CardBody>
          <Flex direction="column" spacing={3}>
            <Text fontWeight="bold" fontSize="xl" mb={2}>
              {data.firstName} {data.lastName}
            </Text>
            <Text fontSize="md" mb={4} color="gray.600">
              {data.reasonForLeave}
            </Text>
            <Button
              mt={4}
              variant="solid"
              onClick={onOpen}
              size="md"
              width="full"
            >
              See More
            </Button>
          </Flex>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Leave Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column" spacing={3} p={4}>
              {[ 
                { label: 'First Name', value: data.firstName },
                { label: 'Last Name', value: data.lastName },
                { label: 'Registration Number', value: data.registrationNumber },
                { label: 'Reason For Leave', value: data.reasonForLeave },
                { label: 'Contact Number', value: data.contactNumber }
              ].map((item, index) => (
                <Box key={index} mb={2}>
                  <Flex justify="space-between" align="center">
                    <Text fontWeight="semibold" color="gray.700">
                      {item.label}:
                    </Text>
                    <Text>{item.value}</Text>
                  </Flex>
                  {index < 5 && <Divider my={2} />}
                </Box>
              ))}

              <Box mb={2}>
                <Flex justify="space-between" align="center">
                  <Text fontWeight="semibold" color="gray.700">
                    Start Date:
                  </Text>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => handleEdit('startDate', e.target.value)}
                  />
                </Flex>
                <Divider my={2} />
              </Box>

              <Box mb={2}>
                <Flex justify="space-between" align="center">
                  <Text fontWeight="semibold" color="gray.700">
                    End Date:
                  </Text>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => handleEdit('endDate', e.target.value)}
                  />
                </Flex>
                <Divider my={2} />
              </Box>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LeaveCard;
