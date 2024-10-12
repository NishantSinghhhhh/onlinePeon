import React, { useContext, useState } from 'react';
import { Input, Box, Button, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';
import axios from 'axios';
import AdminNavbar from '../Admin/pages/AdminNavbar';
import HODNavbar from '../MainHod/pages/navbar';
import WardenNavbar from '../HOD/pages/navbar';
import StaffNavbar from '../StaffNavbar/StaffNavbar';
import { LoginContext } from '../../context/LoginContext';
import OutpassCard from './searchCards/Outpass';
import LeaveCard from './searchCards/Leave';
import PLCard from './searchCards/Pls';
import styles from './User.module.css';
import UserCard from './UserCard';

const Search = ({ selectedClass }) => {
  const { loginInfo } = useContext(LoginContext);
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [userData, setUserData] = useState(null);
  const [outpasses, setOutpasses] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [pls, setPls] = useState([]);
  const [error, setError] = useState('');

  const renderNavbar = () => {
    switch (loginInfo.position) {
      case 'HOD':
        return <HODNavbar />;
      case 'Class Teacher':
        return <StaffNavbar />;
      case 'Warden':
        return <WardenNavbar />;
      case 'Joint Director':
      case 'Director':
      case 'Principal':
        return <AdminNavbar />;
      default:
        return <StaffNavbar />;
    }
  };

  const handleInputChange = (e) => {
    setRegistrationNumber(e.target.value);
  };

  const handleSearch = async () => {
    try {
      // Fetch user data
      const userResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/fetch/teachers/fetchUser/${registrationNumber}`);
      console.log('User data:', userResponse.data.data);
      setUserData(userResponse.data.data);
      setError(''); // Clear error if user is found
  
      // Fetch outpasses
      try {
        const outpassesResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/fetch/teachers/fetchOutpasses/registration/${registrationNumber}`);
        console.log('Outpasses:', outpassesResponse.data.data);
        setOutpasses(outpassesResponse.data.data);
      } catch (err) {
        console.error('Error fetching outpasses:', err);
        setOutpasses([]); // Set to empty if error occurs
        // Optionally set an error message for outpasses
      }
  
      // Fetch leaves
      try {
        const leavesResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/fetch/teachers/fetchLeaves/registration/${registrationNumber}`);
        console.log('Leaves:', leavesResponse.data.data);
        setLeaves(leavesResponse.data.data);
      } catch (err) {
        console.error('Error fetching leaves:', err);
        setLeaves([]); // Set to empty if error occurs
        // Optionally set an error message for leaves
      }
  
      // Fetch PLs
      try {
        const plsResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/fetch/teachers/fetchPLs/registration/${registrationNumber}`);
        console.log('PLs:', plsResponse.data.data);
        setPls(plsResponse.data.data);
      } catch (err) {
        console.error('Error fetching PLs:', err);
        setPls([]); // Set to empty if error occurs
        // Optionally set an error message for PLs
      }
  
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('No Student Found with This Registration');
      setUserData(null);
      setOutpasses([]); // Clear outpasses
      setLeaves([]); // Clear leaves
      setPls([]); // Clear PLs
    }
  };
  

  const isLeaveActive = (startDate, endDate) => {
    const currentDate = new Date();
    return new Date(startDate) <= currentDate && currentDate <= new Date(endDate);
  };

  const activeLeaves = leaves.some((leave) => isLeaveActive(leave.startDate, leave.endDate));

  const handleStatusChange = async (id, status, type) => {
    try {
      const positionMapping = {
        'Class Teacher': 0,
        'HOD': 1,
        'Warden': 2,
        'Joint Director': 3,
        'Director': 3,
        'Principal': 3,
      };

      const position = positionMapping[loginInfo.position] || 3;

      console.log(`Sending update request for ${type} ${id} with status ${status} and position ${position}`);

      const endpoint = type === 'outpass' 
        ? `${process.env.REACT_APP_BASE_URL}/update/updateOutpass/${id}`
        : type === 'leave'
        ? `${process.env.REACT_APP_BASE_URL}/update/updateLeave/${id}`
        : `${process.env.REACT_APP_BASE_URL}/update/updatePL/${id}`;

      const response = await axios.put(endpoint, {
        status,
        position,
      });

      if (response.data.success) {
        console.log(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully:`, response.data);

        switch (type) {
          case 'outpass':
            setOutpasses((prevOutpasses) => prevOutpasses.filter((outpass) => outpass._id !== id));
            break;
          case 'leave':
            setLeaves((prevLeaves) => prevLeaves.filter((leave) => leave._id !== id));
            break;
          case 'pl':
            setPls((prevPls) => prevPls.filter((pl) => pl._id !== id));
            break;
          default:
            break;
        }
      } else {
        console.error('Failed to update:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating:', error.message);
    }
  };

  return (
    <Box>
      {renderNavbar()}

      <Box m="auto" mt="20px" display="flex" flexDirection="row" gap="20px" justifyContent="center" alignItems="center">
        <Input
          placeholder="Enter Student's Registration Number"
          size="md"
          maxWidth="400px"
          borderColor="gray.400"
          focusBorderColor="blue.500"
          value={registrationNumber}
          onChange={handleInputChange}
        />
        <Button mt="10px" display="flex" alignItems="center" justifyContent="center" onClick={handleSearch}>
          Search
        </Button>
      </Box>

      {error && (
        <Alert status="error" mt="20px">
          <AlertIcon />
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className={styles.main}>
        {userData && (
          <UserCard
            userData={userData}
            outpassesCount={outpasses.length || 0}
            leavesCount={leaves.length || 0}
            plsCount={pls.length || 0}
            activeLeaves={activeLeaves || false}
          />
        )}

        {/* Render message if there are no records but userData exists */}
        {userData && outpasses.length === 0 && leaves.length === 0 && pls.length === 0 && (
          <Box mt="20px" textAlign="center">
            <p>No record of outpasses, leaves, or PLs found.</p>
          </Box>
        )}

        {outpasses.length > 0 && (
          <Box className={styles.outpass} mt="20px">
            {outpasses.map((outpass) => (
              <OutpassCard 
                key={outpass._id}
                outpass={outpass}
                onStatusChange={(status) => handleStatusChange(outpass._id, status, 'outpass')}
              />
            ))}
          </Box>
        )}

        {leaves.length > 0 && (
          <Box className={styles.Leaves} mt="20px">
            {leaves.map((leave) => (
              <LeaveCard
                key={leave._id}
                leave={leave}
                onStatusChange={(status) => handleStatusChange(leave._id, status, 'leave')}
              />
            ))}
          </Box>
        )}

        {pls.length > 0 && (
          <Box className={styles.Pls} mt="20px">
            {pls.map((pl) => (
              <PLCard
                key={pl._id}
                pl={pl}
                onStatusChange={(status) => handleStatusChange(pl._id, status, 'pl')}
              />
            ))}
          </Box>
        )}
      </div>
    </Box>
  );
};

export default Search;
