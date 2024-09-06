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
  Divider,
  useToast
} from '@chakra-ui/react';
import axios from 'axios';
import PropTypes from 'prop-types';

const LeaveCard = ({ data, onClick, onUpdate }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleStatusUpdate = async (status) => {
    try {
      const response = await axios.put(`http://localhost:8000/update/updateLeave/${data._id}`, {
        status,
        position: 0
      });

      if (response.data.message === 'Leave status updated successfully') {
        toast({
          title: "Leave Updated",
          description: `Status changed to ${status === 1 ? 'Approved' : 'Declined'}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        if (onUpdate) {
          onUpdate(data._id, status);
        }
      } else {
        toast({
          title: "Update Failed",
          description: `Failed to update leave: ${response.data.message}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `An error occurred while updating the leave: ${error.response ? error.response.data.message : error.message}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    onClose();
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
        onClick={onClick}
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
              onClick={(e) => {
                e.stopPropagation();
                onOpen();
              }}
              size="md"
              width="full"
            >
              See More
            </Button>
          </Flex>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
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
                { label: 'Start Date', value: new Date(data.startDate).toLocaleDateString() },
                { label: 'End Date', value: new Date(data.endDate).toLocaleDateString() },
                { label: 'Place Of Residence', value: data.placeOfResidence },
                { label: 'Attendance Percentage', value: `${data.attendancePercentage}%` },
                { label: 'Contact Number', value: data.contactNumber },
                { label: 'Created At', value: new Date(data.createdAt).toLocaleDateString() },
                { label: 'Updated At', value: new Date(data.updatedAt).toLocaleDateString() }
              ].map((item, index) => (
                <Box key={index} mb={2}>
                  <Flex justify="space-between">
                    <Text fontWeight="semibold" color="gray.700">
                      {item.label}:
                    </Text>
                    <Text>{item.value}</Text>
                  </Flex>
                  {index < 10 && <Divider my={2} />}
                </Box>
              ))}
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={() => handleStatusUpdate(1)}>
              Approve
            </Button>
            <Button variant="outline" onClick={() => handleStatusUpdate(-1)}>
              Decline
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

LeaveCard.propTypes = {
  data: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  onUpdate: PropTypes.func.isRequired,
};

export default LeaveCard;
