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

const HODNavbar = () => {
  const location = useLocation(); // Get the current location
  const { loginInfo } = useContext(LoginContext); // Access loginInfo from LoginContext

//   import HODLeavePage from './components/MainHod/pages/LeavePage'
//   import HODOutpassPage from './components/MainHod/pages/OutpassPage'
//   import HOUPLpage from './components/MainHod/pages/PLpage'
{/* <Route path='/HODPLpage' element={<HODPLpage/>}/>
<Route path='/HODdonePage' element={<HODdonePage/>}/> */}

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
                to='/HODOutpassPage'
                className={styles['breadcrumb-link']}
                bg={location.pathname === '/HODOutpassPage' ? 'gray.600' : 'transparent'}
                color={location.pathname === '/HODOutpassPage' ? 'white' : 'gray.300'}
                fontWeight={location.pathname === '/HODOutpassPage' ? 'bold' : 'normal'}
              >
                Outpass
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <BreadcrumbLink
                as={Link}
                to='/HODLeavePage'
                className={styles['breadcrumb-link']}
                bg={location.pathname === '/HODLeavePage' ? 'gray.600' : 'transparent'}
                color={location.pathname === '/HODLeavePage' ? 'white' : 'gray.300'}
                fontWeight={location.pathname === '/HODLeavePage' ? 'bold' : 'normal'}
              >
                Leave
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <BreadcrumbLink
                as={Link}
                to='/HODPLpage'
                className={styles['breadcrumb-link']}
                bg={location.pathname === '/HODPLpage' ? 'gray.600' : 'transparent'}
                color={location.pathname === '/HODPLpage' ? 'white' : 'gray.300'}
                fontWeight={location.pathname === '/HODPLpage' ? 'bold' : 'normal'}
              >
                PL
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <BreadcrumbLink
                as={Link}
                to='/HODdonepage'
                className={styles['breadcrumb-link']}
                bg={location.pathname === '/HODdonepage' ? 'gray.600' : 'transparent'}
                color={location.pathname === '/HODdonepage' ? 'white' : 'gray.300'}
                fontWeight={location.pathname === '/HODdonepage' ? 'bold' : 'normal'}
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

export default HODNavbar;
