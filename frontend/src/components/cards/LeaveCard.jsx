import React from 'react';
import { Box, Flex, Text, Button, Card, CardBody, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react';

const LeaveCard = ({ data }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Card borderWidth={1} mb="40px" borderRadius="md" boxShadow="md" width="800px" p={4}>
        <CardBody>
          <Flex direction="column" spacing={3}>
            <Text fontWeight="bold" fontSize="lg">{data.firstName} {data.lastName}</Text>
            <Text fontSize="md" mb={4}>{data.reasonForLeave}</Text>
            <Button mt={4} colorScheme="gray" variant="solid" onClick={onOpen}>
              See More
            </Button>
          </Flex>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay bg="blackAlpha.700" />
        <ModalContent>
          <ModalHeader>Leave Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column" spacing={3}>
              <Flex justify="space-between" mb={2}>
                <Text fontWeight="semibold">First Name:</Text>
                <Text>{data.firstName}</Text>
              </Flex>
              <Flex justify="space-between" mb={2}>
                <Text fontWeight="semibold">Last Name:</Text>
                <Text>{data.lastName}</Text>
              </Flex>
              <Flex justify="space-between" mb={2}>
                <Text fontWeight="semibold">Registration Number:</Text>
                <Text>{data.registrationNumber}</Text>
              </Flex>
              <Flex justify="space-between" mb={2}>
                <Text fontWeight="semibold">Reason For Leave:</Text>
                <Text>{data.reasonForLeave}</Text>
              </Flex>
              <Flex justify="space-between" mb={2}>
                <Text fontWeight="semibold">Start Date:</Text>
                <Text>{new Date(data.startDate).toLocaleDateString()}</Text>
              </Flex>
              <Flex justify="space-between" mb={2}>
                <Text fontWeight="semibold">End Date:</Text>
                <Text>{new Date(data.endDate).toLocaleDateString()}</Text>
              </Flex>
              <Flex justify="space-between" mb={2}>
                <Text fontWeight="semibold">Place Of Residence:</Text>
                <Text>{data.placeOfResidence}</Text>
              </Flex>
              <Flex justify="space-between" mb={2}>
                <Text fontWeight="semibold">Attendance Percentage:</Text>
                <Text>{data.attendancePercentage}%</Text>
              </Flex>
              <Flex justify="space-between" mb={2}>
                <Text fontWeight="semibold">Contact Number:</Text>
                <Text>{data.contactNumber}</Text>
              </Flex>
              <Flex justify="space-between" mb={2}>
                <Text fontWeight="semibold">Created At:</Text>
                <Text>{new Date(data.createdAt).toLocaleDateString()}</Text>
              </Flex>
              <Flex justify="space-between" mb={2}>
                <Text fontWeight="semibold">Updated At:</Text>
                <Text>{new Date(data.updatedAt).toLocaleDateString()}</Text>
              </Flex>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3}>
              Approve
            </Button>
            <Button variant="outline" onClick={onClose}>
              Decline
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LeaveCard;
