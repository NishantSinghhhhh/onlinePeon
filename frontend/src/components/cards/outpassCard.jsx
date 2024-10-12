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
  IconButton,
  Input
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';

const OutpassCard = ({ data, onStatusChange, onEdit }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDateOpen, onOpen: onDateOpen, onClose: onDateClose } = useDisclosure();
  const { isOpen: isStartHourOpen, onOpen: onStartHourOpen, onClose: onStartHourClose } = useDisclosure();
  const { isOpen: isEndHourOpen, onOpen: onEndHourOpen, onClose: onEndHourClose } = useDisclosure();

  const [editedDate, setEditedDate] = useState(data.date);
  const [editedStartHour, setEditedStartHour] = useState(data.startHour);
  const [editedEndHour, setEditedEndHour] = useState(data.endHour);

  const handleEdit = async (field, value) => {
    if (field === 'date') setEditedDate(value);
    if (field === 'startHour') setEditedStartHour(value);
    if (field === 'endHour') setEditedEndHour(value);
  
    const updatedData = {
      id: data._id,
      date: field === 'date' ? value : editedDate,
      startHour: field === 'startHour' ? value : editedStartHour,
      endHour: field === 'endHour' ? value : editedEndHour,
    };
  
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/edit/editOutpass`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log('Outpass updated successfully:', result);
       
      } else {
        const errorData = await response.json();
        console.error('Error updating outpass:', errorData.message);
      }
    } catch (error) {
      console.error('An error occurred while updating the outpass:', error);
    }
  
    if (onEdit) {
      onEdit(updatedData);
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

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Outpass Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column" spacing={3} p={4}>
              {[
                { label: 'First Name', value: data.firstName },
                { label: 'Last Name', value: data.lastName },
                { label: 'Class Name', value: data.className },
                { label: 'Registration Number', value: data.registrationNumber },
                { label: 'Reason', value: data.reason },
                {
                  label: 'Date',
                  value: new Date(data.date).toLocaleDateString(),
                  editable: true,
                  onEditOpen: onDateOpen
                },
                {
                  label: 'Start Hour',
                  value: data.startHour,
                  editable: true,
                  onEditOpen: onStartHourOpen
                },
                {
                  label: 'End Hour',
                  value: data.endHour,
                  editable: true,
                  onEditOpen: onEndHourOpen
                },
                { label: 'Contact Number', value: data.contactNumber }
              ].map((item, index) => (
                <Box key={index} mb={2}>
                  <Flex justify="space-between" align="center">
                    <Text fontWeight="semibold" color="gray.700">
                      {item.label}:
                    </Text>
                    <Text>{item.value}</Text>
                    {item.editable && (
                      <IconButton
                        aria-label={`Edit ${item.label}`}
                        icon={<EditIcon />}
                        size="sm"
                        ml={2}
                        onClick={item.onEditOpen}
                      />
                    )}
                  </Flex>
                  {index < 8 && <Divider my={2} />}
                </Box>
              ))}
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="green"
              mr={3}
              onClick={() => onStatusChange(data._id, 1)}
            >
              Approve
            </Button>
            <Button
              variant="outline"
              onClick={() => onStatusChange(data._id, -1)}
            >
              Decline
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isDateOpen} onClose={onDateClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Date</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              type="date"
              value={editedDate}
              onChange={(e) => setEditedDate(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={() => {
                handleEdit('date', editedDate);
                onDateClose();
              }}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isStartHourOpen} onClose={onStartHourClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Start Hour</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              type="time"
              value={editedStartHour}
              onChange={(e) => setEditedStartHour(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={() => {
                handleEdit('startHour', editedStartHour);
                onStartHourClose();
              }}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isEndHourOpen} onClose={onEndHourClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit End Hour</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              type="time"
              value={editedEndHour}
              onChange={(e) => setEditedEndHour(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={() => {
                handleEdit('endHour', editedEndHour);
                onEndHourClose();
              }}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default OutpassCard;
