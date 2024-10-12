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

const LeaveCard = ({ data, onStatusChange, onEdit }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isStartDateOpen, onOpen: onStartDateOpen, onClose: onStartDateClose } = useDisclosure();
  const { isOpen: isEndDateOpen, onOpen: onEndDateOpen, onClose: onEndDateClose } = useDisclosure();

  const [editedStartDate, setEditedStartDate] = useState(data.startDate);
  const [editedEndDate, setEditedEndDate] = useState(data.endDate);

  const handleEdit = async (field, value) => {
    if (field === 'startDate') setEditedStartDate(value);
    if (field === 'endDate') setEditedEndDate(value);

    const updatedData = {
      id: data._id,
      startDate: field === 'startDate' ? value : editedStartDate,
      endDate: field === 'endDate' ? value : editedEndDate,
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
                {
                  label: 'Start Date',
                  value: new Date(editedStartDate).toLocaleDateString(),
                  editable: true,
                  onEditOpen: onStartDateOpen
                },
                {
                  label: 'End Date',
                  value: new Date(editedEndDate).toLocaleDateString(),
                  editable: true,
                  onEditOpen: onEndDateOpen
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
                  {index < 6 && <Divider my={2} />}
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

      <Modal isOpen={isStartDateOpen} onClose={onStartDateClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Start Date</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              type="date"
              value={editedStartDate}
              onChange={(e) => setEditedStartDate(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={() => {
                handleEdit('startDate', editedStartDate);
                onStartDateClose();
              }}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isEndDateOpen} onClose={onEndDateClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit End Date</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              type="date"
              value={editedEndDate}
              onChange={(e) => setEditedEndDate(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={() => {
                handleEdit('endDate', editedEndDate);
                onEndDateClose();
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

export default LeaveCard;
