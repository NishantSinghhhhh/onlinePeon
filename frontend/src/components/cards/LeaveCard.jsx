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

const LeaveCard = ({ data }) => {
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
