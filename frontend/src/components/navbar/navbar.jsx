import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Box,
  Avatar,
  AvatarGroup,
  Flex,
} from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import styles from './navbar.module.css';

const Navbar = () => {
  const location = useLocation(); // Get the current location

  return (
    <Box
      as='nav'
      bg='rgba(0, 0, 0, 1)'
      color='white'
      p={4}
      mb={4}
      border='1px solid rgba(255, 255, 255, 0.2)'
    >
      <Flex className={styles.items} align='center' justify='space-between'>
        <Flex flex='1' justify='center'>
          <Breadcrumb
            spacing='16px'
            separator={null}
            fontSize='lg'
            fontWeight='medium'
            color='white'
          >
            <BreadcrumbItem>
              <BreadcrumbLink
                as={Link}
                to='/Approved'
                mr={10}
                p={3}
                borderRadius='md'
                _hover={{
                  textDecoration: 'none',
                  bg: 'gray.700',
                  color: 'white',
                }}
                bg={location.pathname === '/Approved' ? 'gray.600' : 'transparent'}
                color={location.pathname === '/Approved' ? 'white' : 'gray.300'}
                fontWeight={location.pathname === '/Approved' ? 'bold' : 'normal'}
                border='1px'
                borderColor={location.pathname === '/Approved' ? 'gray.700' : 'transparent'}
              >
                Approved
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <BreadcrumbLink
                as={Link}
                to='/Pending'
                mr={10}
                p={3}
                borderRadius='md'
                _hover={{
                  textDecoration: 'none',
                  bg: 'gray.700',
                  color: 'white',
                }}
                bg={location.pathname === '/Pending' ? 'gray.600' : 'transparent'}
                color={location.pathname === '/Pending' ? 'white' : 'gray.300'}
                fontWeight={location.pathname === '/Pending' ? 'bold' : 'normal'}
                border='1px'
                borderColor={location.pathname === '/Pending' ? 'gray.700' : 'transparent'}
              >
                Pending
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <BreadcrumbLink
                as={Link}
                to='/Declined'
                mr={10}
                p={3}
                borderRadius='md'
                _hover={{
                  textDecoration: 'none',
                  bg: 'gray.700',
                  color: 'white',
                }}
                bg={location.pathname === '/Declined' ? 'gray.600' : 'transparent'}
                color={location.pathname === '/Declined' ? 'white' : 'gray.300'}
                fontWeight={location.pathname === '/Declined' ? 'bold' : 'normal'}
                border='1px'
                borderColor={location.pathname === '/Declined' ? 'gray.700' : 'transparent'}
              >
                Declined
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <BreadcrumbLink
                as={Link}
                to='/Expired'
                mr={10}
                p={3}
                borderRadius='md'
                _hover={{
                  textDecoration: 'none',
                  bg: 'gray.700',
                  color: 'white',
                }}
                bg={location.pathname === '/Expired' ? 'gray.600' : 'transparent'}
                color={location.pathname === '/Expired' ? 'white' : 'gray.300'}
                fontWeight={location.pathname === '/Expired' ? 'bold' : 'normal'}
                border='1px'
                borderColor={location.pathname === '/Expired' ? 'gray.700' : 'transparent'}
              >
                Expired
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Flex>

        <AvatarGroup spacing='1rem'>
          <Avatar bg='gray.500' />
        </AvatarGroup>
      </Flex>
    </Box>
  );
}

export default Navbar;
