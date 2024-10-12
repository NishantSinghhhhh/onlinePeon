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
  useToast,
  Icon,
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import axios from 'axios';

const PLCard = ({ data, onStatusChange }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isFieldModalOpen, setFieldModalOpen] = useState(false);
  const [currentField, setCurrentField] = useState(null);
  const toast = useToast();

  const [editedClassesMissed, setEditedClassesMissed] = useState(data.classesMissed);
  const [editedStartDate, setEditedStartDate] = useState(new Date(data.startDate).toISOString().substr(0, 10));
  const [editedEndDate, setEditedEndDate] = useState(new Date(data.endDate).toISOString().substr(0, 10));

  const handleFieldClick = (field) => {
    setCurrentField(field);
    setFieldModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/edit/editPL`, {
        id: data._id, // Send the current PL ObjectId
        classesMissed: editedClassesMissed,
        startDate: editedStartDate,
        endDate: editedEndDate,
      });

      console.log(response)
      
      toast({
        title: 'Success',
        description: 'Leave details updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setFieldModalOpen(false);
    } catch (error) {
      console.error('Error updating leave details:', error);
      toast({
        title: 'Error',
        description: 'Failed to update leave details',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
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
            <Text fontSize="md" mb={2} color="gray.600">
              {data.className}
            </Text>
            <Text fontSize="md" mb={4} color="gray.600">
              {data.reason}
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

      {/* Main Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>PL Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column" spacing={3} p={4}>
              {[{ label: 'First Name', value: data.firstName }, { label: 'Last Name', value: data.lastName }, { label: 'Class Name', value: data.className }, { label: 'Roll Number', value: data.rollNumber }, { label: 'Reason', value: data.reason }].map((item, index) => (
                <Box key={index} mb={2}>
                  <Flex justify="space-between" align="center">
                    <Text fontWeight="semibold" color="gray.700">
                      {item.label}:
                    </Text>
                    <Text>{item.value}</Text>
                  </Flex>
                  {index < 9 && <Divider my={2} />}
                </Box>
              ))}

              {/* Editable Fields */}
              <Box mb={2}>
                <Flex justify="space-between" align="center" onClick={() => handleFieldClick('classesMissed')}>
                  <Flex align="center" cursor="pointer">
                    <Text fontWeight="semibold" color="gray.700" mr={2}>
                      Classes Missed:
                    </Text>
                    <Icon as={EditIcon} boxSize={4} color="blue.500" />
                  </Flex>
                  <Text
                    cursor="pointer"
                    color="blue.500"
                    _hover={{ textDecoration: 'underline' }}
                  >
                    {editedClassesMissed}
                  </Text>
                </Flex>
              </Box>

              <Box mb={2}>
                <Flex justify="space-between" align="center" onClick={() => handleFieldClick('startDate')}>
                  <Flex align="center" cursor="pointer">
                    <Text fontWeight="semibold" color="gray.700" mr={2}>
                      Start Date:
                    </Text>
                    <Icon as={EditIcon} boxSize={4} color="blue.500" />
                  </Flex>
                  <Text
                    cursor="pointer"
                    color="blue.500"
                    _hover={{ textDecoration: 'underline' }}
                  >
                    {editedStartDate}
                  </Text>
                </Flex>
              </Box>

              <Box mb={2}>
                <Flex justify="space-between" align="center" onClick={() => handleFieldClick('endDate')}>
                  <Flex align="center" cursor="pointer">
                    <Text fontWeight="semibold" color="gray.700" mr={2}>
                      End Date:
                    </Text>
                    <Icon as={EditIcon} boxSize={4} color="blue.500" />
                  </Flex>
                  <Text
                    cursor="pointer"
                    color="blue.500"
                    _hover={{ textDecoration: 'underline' }}
                  >
                    {editedEndDate}
                  </Text>
                </Flex>
              </Box>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={() => onStatusChange(data._id, 1)}>
              Approve
            </Button>
            <Button variant="outline" onClick={() => onStatusChange(data._id, -1)}>
              Decline
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Field Edit Modal */}
      <Modal isOpen={isFieldModalOpen} onClose={() => setFieldModalOpen(false)} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit {currentField === 'classesMissed' ? 'Classes Missed' : currentField === 'startDate' ? 'Start Date' : 'End Date'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              type={currentField === 'classesMissed' ? 'number' : 'date'}
              value={currentField === 'classesMissed' ? editedClassesMissed : currentField === 'startDate' ? editedStartDate : editedEndDate}
              onChange={(e) => {
                if (currentField === 'classesMissed') setEditedClassesMissed(e.target.value);
                if (currentField === 'startDate') setEditedStartDate(e.target.value);
                if (currentField === 'endDate') setEditedEndDate(e.target.value);
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSave}>
              Save
            </Button>
            <Button variant="outline" onClick={() => setFieldModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PLCard;
