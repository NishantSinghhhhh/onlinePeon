import React from 'react';
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
  Divider
} from '@chakra-ui/react';
import axios from 'axios'; 

const PLCard = ({ data, onStatusChange }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
              {data.reason}
            </Text>
            <Button
              mt={4}
              variant="solid"
              onClick={onOpen} // Opens the modal
              size="md"
              width="full"
            >
              See More
            </Button>
          </Flex>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay bg="rgba(0, 0, 0, 0.6)" />
        <ModalContent>
          <ModalHeader>PL Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column" spacing={3} p={4}>
              {[
                { label: 'First Name', value: data.firstName },
                { label: 'Last Name', value: data.lastName },
                { label: 'Class Name', value: data.className },
                { label: 'Roll Number', value: data.rollNumber },
                { label: 'Classes Missed', value: data.classesMissed },
                { label: 'Reason', value: data.reason },
                { label: 'Start Date', value: new Date(data.startDate).toLocaleDateString() },
                { label: 'End Date', value: new Date(data.endDate).toLocaleDateString() },
                { label: 'Created At', value: new Date(data.createdAt).toLocaleString() },
                { label: 'Updated At', value: new Date(data.updatedAt).toLocaleString() },
              ].map((item, index) => (
                <Box key={index} mb={2}>
                  <Flex justify="space-between" align="center">
                    <Text fontWeight="semibold" color="gray.700">
                      {item.label}:
                    </Text>
                    <Text>{item.value}</Text>
                  </Flex>
                  {index < 8 && <Divider my={2} />}
                </Box>
              ))}

              <Box mb={2}>
                <Flex justify="space-between" align="center">
                  <Text fontWeight="semibold" color="gray.700">
                    Document:
                  </Text>
                  <Box border="1px solid gray" borderRadius="md" p={2} mt={2} bg="gray.50">
                    <Text>No Document Available</Text>
                  </Box>
                </Flex>
              </Box>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button 
              colorScheme="green" 
              mr={3} 
              onClick={() => onStatusChange(data._id, 1)} // Approve: send status=1
            >
              Approve
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onStatusChange(data._id, -1)} // Decline: send status=-1
            >
              Decline
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PLCard;
