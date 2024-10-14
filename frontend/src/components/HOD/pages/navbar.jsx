import React, { useContext } from 'react';
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
import { LoginContext } from '../../../context/LoginContext'; // Import the context

const StaffNavbar = () => {
  const location = useLocation(); 
  const { loginInfo } = useContext(LoginContext); // Access loginInfo from LoginContext

  const isWarden = loginInfo.position.toLowerCase() === 'warden';

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
                to='/WARDENOutpassPage'
                className={styles['breadcrumb-link']}
                bg={location.pathname === '/WARDENOutpassPage' ? 'gray.600' : 'transparent'}
                color={location.pathname === '/WARDENOutpassPage' ? 'white' : 'gray.300'}
                fontWeight={location.pathname === '/WARDENOutpassPage' ? 'bold' : 'normal'}
              >
                Outpass
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <BreadcrumbLink
                as={Link}
                to='/WARDENLeavePage'
                className={styles['breadcrumb-link']}
                bg={location.pathname === '/WARDENLeavePage' ? 'gray.600' : 'transparent'}
                color={location.pathname === '/WARDENLeavePage' ? 'white' : 'gray.300'}
                fontWeight={location.pathname === '/WARDENLeavePage' ? 'bold' : 'normal'}
              >
                Leave
              </BreadcrumbLink>
            </BreadcrumbItem>

            {!isWarden && ( // Conditionally render the PL section
              <BreadcrumbItem>
                <BreadcrumbLink
                  as={Link}
                  to='/WARDENPLpage'
                  className={styles['breadcrumb-link']}
                  bg={location.pathname === '/WARDENPLpage' ? 'gray.600' : 'transparent'}
                  color={location.pathname === '/WARDENPLpage' ? 'white' : 'gray.300'}
                  fontWeight={location.pathname === '/WARDENPLpage' ? 'bold' : 'normal'}
                >
                  PL
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}

            <BreadcrumbItem>
              <BreadcrumbLink
                as={Link}
                to='/WARDENdonepage'
                className={styles['breadcrumb-link']}
                bg={location.pathname === '/WARDENdonepage' ? 'gray.600' : 'transparent'}
                color={location.pathname === '/WARDENdonepage' ? 'white' : 'gray.300'}
                fontWeight={location.pathname === '/WARDENdonepage' ? 'bold' : 'normal'}
              >
                Seen
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
