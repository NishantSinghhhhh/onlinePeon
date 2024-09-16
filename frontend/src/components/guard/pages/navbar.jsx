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

const Navbar = () => {
  const location = useLocation(); 
  const { loginInfo } = useContext(LoginContext); // Access loginInfo from LoginContext

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
                to='/Scan'
                className={styles['breadcrumb-link']}
                bg={location.pathname === '/Scan' ? 'gray.600' : 'transparent'}
                color={location.pathname === '/Scan' ? 'white' : 'gray.300'}
                fontWeight={location.pathname === '/Scan' ? 'bold' : 'normal'}
              >
                Scan
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

export default Navbar;
