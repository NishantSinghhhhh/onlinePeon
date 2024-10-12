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
import styles from './StaffNavbar.module.css';

const StaffNavbar = () => {
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
                to='/StaffOutpass'
                className={styles['breadcrumb-link']}
                bg={location.pathname === '/StaffOutpass' ? 'gray.600' : 'transparent'}
                color={location.pathname === '/StaffOutpass' ? 'white' : 'gray.300'}
                fontWeight={location.pathname === '/StaffOutpass' ? 'bold' : 'normal'}
              >
                Outpass
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <BreadcrumbLink
                as={Link}
                to='/StaffLeave'
                className={styles['breadcrumb-link']}
                bg={location.pathname === '/StaffLeave' ? 'gray.600' : 'transparent'}
                color={location.pathname === '/StaffLeave' ? 'white' : 'gray.300'}
                fontWeight={location.pathname === '/StaffLeave' ? 'bold' : 'normal'}
              >
                Leave
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <BreadcrumbLink
                as={Link}
                to='/StaffPL'
                className={styles['breadcrumb-link']}
                bg={location.pathname === '/StaffPL' ? 'gray.600' : 'transparent'}
                color={location.pathname === '/StaffPL' ? 'white' : 'gray.300'}
                fontWeight={location.pathname === '/StaffPL' ? 'bold' : 'normal'}
              >
                PL
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <BreadcrumbLink
                as={Link}
                to='/StaffDone'
                className={styles['breadcrumb-link']}
                bg={location.pathname === '/StaffDone' ? 'gray.600' : 'transparent'}
                color={location.pathname === '/StaffDone' ? 'white' : 'gray.300'}
                fontWeight={location.pathname === '/StaffDone' ? 'bold' : 'normal'}
              >
                Seen
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <BreadcrumbLink
                as={Link}
                to='/Search'
                className={styles['breadcrumb-link']}
                bg={location.pathname === '/Search' ? 'gray.600' : 'transparent'}
                color={location.pathname === '/Search' ? 'white' : 'gray.300'}
                fontWeight={location.pathname === '/Search' ? 'bold' : 'normal'}
              >
                Search
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
};

export default StaffNavbar;
