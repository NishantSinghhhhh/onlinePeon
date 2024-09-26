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
                to='/AdminOutpass'
                className={styles['breadcrumb-link']}
                bg={location.pathname === '/AdminOutpass' ? 'gray.600' : 'transparent'}
                color={location.pathname === '/AdminOutpass' ? 'white' : 'gray.300'}
                fontWeight={location.pathname === '/AdminOutpass' ? 'bold' : 'normal'}
              >
                Outpass
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <BreadcrumbLink
                as={Link}
                to='/AdminLeavePage'
                className={styles['breadcrumb-link']}
                bg={location.pathname === '/AdminLeavePage' ? 'gray.600' : 'transparent'}
                color={location.pathname === '/AdminLeavePage' ? 'white' : 'gray.300'}
                fontWeight={location.pathname === '/AdminLeavePage' ? 'bold' : 'normal'}
              >
                Leave
              </BreadcrumbLink>
            </BreadcrumbItem>

           
              <BreadcrumbItem>
                <BreadcrumbLink
                  as={Link}
                  to='/AdminPLpage'
                  className={styles['breadcrumb-link']}
                  bg={location.pathname === '/AdminPLpage' ? 'gray.600' : 'transparent'}
                  color={location.pathname === '/AdminPLpage' ? 'white' : 'gray.300'}
                  fontWeight={location.pathname === '/AdminPLpage' ? 'bold' : 'normal'}
                >
                  PL
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
           

              <BreadcrumbItem>
                <BreadcrumbLink
                  as={Link}
                  to='/Box'
                  className={styles['breadcrumb-link']}
                  bg={location.pathname === '/Box' ? 'gray.600' : 'transparent'}
                  color={location.pathname === '/Box' ? 'white' : 'gray.300'}
                  fontWeight={location.pathname === '/Box' ? 'bold' : 'normal'}
                >
                    Box
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbItem>
                <BreadcrumbLink
                  as={Link}
                  to='/AdminInOut'
                  className={styles['breadcrumb-link']}
                  bg={location.pathname === '/AdminInOut' ? 'gray.600' : 'transparent'}
                  color={location.pathname === '/AdminInOut' ? 'white' : 'gray.300'}
                  fontWeight={location.pathname === '/AdminInOut' ? 'bold' : 'normal'}
                >
                    AdminInOut
                </BreadcrumbLink>
              </BreadcrumbItem>
           

            {/* <BreadcrumbItem>
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
            </BreadcrumbItem> */}
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
