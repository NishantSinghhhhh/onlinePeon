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
} from '@chakra-ui/react';

const OutpassCard = ({ data }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Card borderWidth={1} m="auto" mb="40px" borderRadius="md" boxShadow="md" width="800px" p={4}>
        <CardBody>
          <Flex direction="column" spacing={3}>
            <Text fontWeight="bold" fontSize="lg">
              {data.firstName} {data.lastName}
            </Text>
            <Text fontSize="md" mb={4}>
              {data.reason}
            </Text>
            <Button mt={4} colorScheme="gray" variant="solid" onClick={onOpen}>
              See More
            </Button>
          </Flex>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay bg='rgba(0, 0, 0, 0.6)' />
        <ModalContent>
          <ModalHeader>Outpass Details</ModalHeader>
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
                <Text fontWeight="semibold">Reason:</Text>
                <Text>{data.reason}</Text>
              </Flex>
              <Flex justify="space-between" mb={2}>
                <Text fontWeight="semibold">Date:</Text>
                <Text>{new Date(data.date).toLocaleDateString()}</Text>
              </Flex>
              <Flex justify="space-between" mb={2}>
                <Text fontWeight="semibold">Start Hour:</Text>
                <Text>{data.startHour}</Text>
              </Flex>
              <Flex justify="space-between" mb={2}>
                <Text fontWeight="semibold">End Hour:</Text>
                <Text>{data.endHour}</Text>
              </Flex>
              <Flex justify="space-between" mb={2}>
                <Text fontWeight="semibold">Contact Number:</Text>
                <Text>{data.contactNumber}</Text>
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

export default OutpassCard;