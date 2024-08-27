import React from 'react';
import { Box, Flex, Text, Button, Card, CardBody, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react';

const PLCard = ({ data }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Card borderWidth={1} mb="40px" borderRadius="md" boxShadow="md" width="900px" p={4}>
        <CardBody>
          <Flex direction="column" spacing={3}>
            <Text fontWeight="bold" fontSize="lg">{data.firstName} {data.lastName}</Text>
            <Text fontSize="md" mb={4}>{data.reason}</Text>
            <Button mt={4} colorScheme="gray" variant="solid" onClick={onOpen}>
              See More
            </Button>
          </Flex>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay bg="blackAlpha.300" />
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
                <Text fontWeight="semibold">Class Name:</Text>
                <Text>{data.className}</Text>
              </Flex>
              <Flex justify="space-between" mb={2}>
                <Text fontWeight="semibold">Roll Number:</Text>
                <Text>{data.rollNumber}</Text>
              </Flex>
              <Flex justify="space-between" mb={2}>
                <Text fontWeight="semibold">Classes Missed:</Text>
                <Text>{data.classesMissed}</Text>
              </Flex>
              <Flex justify="space-between" mb={2}>
                <Text fontWeight="semibold">Reason:</Text>
                <Text>{data.reason}</Text>
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
                <Text fontWeight="semibold">Created At:</Text>
                <Text>{new Date(data.createdAt).toLocaleString()}</Text>
              </Flex>
              <Flex justify="space-between" mb={2}>
                <Text fontWeight="semibold">Updated At:</Text>
                <Text>{new Date(data.updatedAt).toLocaleString()}</Text>
              </Flex>
              {/* You can remove or handle the Document part if not needed */}
              <Flex justify="space-between" mb={2}>
                <Text fontWeight="semibold">Document:</Text>
                <Box border="1px solid gray" borderRadius="md" p={2} mt={2}>
                  {/* Display a placeholder or handle the document */}
                  <Text>No Document Available</Text>
                </Box>
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

export default PLCard;