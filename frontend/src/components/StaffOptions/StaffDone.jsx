import React, { useState, useEffect } from 'react';
import {
  Flex,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  Alert,
  AlertIcon,
  Button,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import HashLoader from 'react-spinners/HashLoader';
import StaffNavbar from '../StaffNavbar/StaffNavbar';
import OutpassCard from '../cards/outpassCard';
import LeaveCard from '../cards/LeaveCard';
import PLCard from '../cards/PLCard';

const StaffDone = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [placement, setPlacement] = useState('right');
  const [selectedDrawerOption, setSelectedDrawerOption] = useState('Outpasses');
  const [activeTab, setActiveTab] = useState('Approved');
  const [outpasses, setOutpasses] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [pls, setPls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLoader, setShowLoader] = useState(true);

  const fetchOutpass = async (classAssigned) => {
    try {
      const response = await fetch(`https://online-peon.vercel.app/fetch/fetchOutpasses/${classAssigned}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  };

  const fetchLeaves = async (classAssigned) => {
    try {
      const response = await fetch(`https://online-peon.vercel.app/fetch/fetchLeaves/${classAssigned}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  };

  const fetchPLs = async (classAssigned) => {
    try {
      const response = await fetch(`https://online-peon.vercel.app/fetch/fetchPLs/${classAssigned}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    const fetchTeacherAndData = async () => {
      const loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
      if (!loginInfo) {
        setError('No login information found. Please log in again.');
        setLoading(false);
        setShowLoader(false);
        return;
      }

      const { staffId } = loginInfo;

      try {
        const teacherResponse = await fetch(`https://online-peon.vercel.app/fetch/fetchTeacher/${staffId}`);
        if (!teacherResponse.ok) {
          const teacherError = await teacherResponse.json();
          throw new Error(teacherError.message || 'Failed to fetch teacher information');
        }

        const teacherData = await teacherResponse.json();
        const classAssigned = teacherData.teacher?.classAssigned;

        if (classAssigned) {
          if (selectedDrawerOption === 'Outpasses') {
            const outpassData = await fetchOutpass(classAssigned);
            setOutpasses(outpassData.data || []);
          } else if (selectedDrawerOption === 'Leaves') {
            const leavesData = await fetchLeaves(classAssigned);
            setLeaves(leavesData.data || []);
          } else if (selectedDrawerOption === 'Pls') {
            const plsData = await fetchPLs(classAssigned);
            setPls(plsData.data || []);
          }
        } else {
          setError('No class assigned for the teacher.');
        }
      } catch (err) {
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
        setShowLoader(false);
      }
    };

    fetchTeacherAndData();

    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [selectedDrawerOption]);

  if (loading || showLoader) {
    return (
      <Flex direction="column" align="center" justify="center" p={5} minH="100vh">
        <HashLoader color="#000000" loading={loading || showLoader} size={50} />
        <Text mt={4}>Loading...</Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex direction="column" align="center" justify="center" p={5} minH="100vh">
        <Alert status="error" variant="left-accent" borderRadius="md" boxShadow="lg" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
        <Button colorScheme="teal" onClick={() => window.location.reload()}>Try Again</Button>
      </Flex>
    );
  }

  const handleTabClick = (option) => {
    setSelectedDrawerOption(option);
    onClose(); // Close the drawer
  };

  const handleCardClick = (data) => {
    console.log(data); // Log card data to the console
  };

  const renderContent = () => {
    switch (selectedDrawerOption) {
      case 'Outpasses':
        return <OutpassesContent data={outpasses} onClick={handleCardClick} />;
      case 'Leaves':
        return <LeavesContent data={leaves} onClick={handleCardClick} />;
      case 'Pls':
        return <PLContent data={pls} onClick={handleCardClick} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <StaffNavbar />
      <Flex justify="flex-end" mt={4} pr={4}>
        <IconButton
          icon={<HamburgerIcon />}
          onClick={onOpen}
          aria-label="Open Drawer"
          size="lg"
          variant="solid"
        />
      </Flex>

      <Drawer placement={placement} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent borderRadius="md" boxShadow="md" borderColor="gray.300">
          <DrawerHeader borderBottomWidth="1px" bg="gray.600" color="white">
            Select Option
          </DrawerHeader>
          <DrawerBody bg="gray.100" p={4}>
            <Flex direction="column" align="center" justify="center" height="100%">
              <Tabs variant="soft-rounded" colorScheme="blue" orientation="vertical">
                <TabList>
                  <Tab
                    onClick={() => handleTabClick('Outpasses')}
                    isActive={selectedDrawerOption === 'Outpasses'}
                  >
                    Outpasses
                  </Tab>
                  <Tab
                    onClick={() => handleTabClick('Leaves')}
                    isActive={selectedDrawerOption === 'Leaves'}
                  >
                    Leaves
                  </Tab>
                  <Tab
                    onClick={() => handleTabClick('Pls')}
                    isActive={selectedDrawerOption === 'Pls'}
                  >
                    Pls
                  </Tab>
                </TabList>
              </Tabs>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Flex justify="center" mt={4}>
        <Tabs isFitted variant="enclosed" width="80%" index={activeTab === 'Approved' ? 0 : 1}>
          <TabList mb="1em">
            <Tab
              onClick={() => setActiveTab('Approved')}
              bg={activeTab === 'Approved' ? 'green.400' : 'gray.200'}
              color={activeTab === 'Approved' ? 'white' : 'black'}
            >
              Approved
            </Tab>
            <Tab
              onClick={() => setActiveTab('Rejected')}
              bg={activeTab === 'Rejected' ? 'red.400' : 'gray.200'}
              color={activeTab === 'Rejected' ? 'white' : 'black'}
            >
              Rejected
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {renderContent()}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </div>
  );
};

// Components to display content based on the data
const OutpassesContent = ({ data, onClick }) => (
  <Flex direction="column" align="center">
    {data.length ? (
      data.map((item, index) => (
        <OutpassCard key={index} data={item} onClick={onClick} />
      ))
    ) : (
      <Text>No Outpasses available</Text>
    )}
  </Flex>
);

const LeavesContent = ({ data, onClick }) => (
  <Flex direction="column" align="center">
    {data.length ? (
      data.map((item, index) => (
        <LeaveCard key={index} data={item} onClick={onClick} />
      ))
    ) : (
      <Text>No Leaves available</Text>
    )}
  </Flex>
);

const PLContent = ({ data, onClick }) => (
  <Flex direction="column" align="center">
    {data.length ? (
      data.map((item, index) => (
        <PLCard key={index} data={item} onClick={onClick} />
      ))
    ) : (
      <Text>No PLs available</Text>
    )}
  </Flex>
);

export default StaffDone;
