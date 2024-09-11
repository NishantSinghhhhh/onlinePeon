import React, { useContext, useState } from 'react';
import { Input, Box, Button, Text } from '@chakra-ui/react';
import axios from 'axios';
import AdminNavbar from '../Admin/pages/AdminNavbar';
import HODNavbar from '../MainHod/pages/navbar';
import WardenNavbar from '../HOD/pages/navbar';
import StaffNavbar from '../StaffNavbar/StaffNavbar';
import { LoginContext } from '../../context/LoginContext';
import OutpassCard from './searchCards/Outpass';
import LeaveCard from './searchCards/Leave'; // Import LeaveCard component
import PLCard from './searchCards/Pls'; // Import PLCard component
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
      case 'Class Teacher':
        return <HODNavbar />;
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
      const userResponse = await axios.get(`http://localhost:8000/fetch/fetchUser/${registrationNumber}`);
      setUserData(userResponse.data.data);

      const outpassesResponse = await axios.get(`http://localhost:8000/fetch/fetchOutpasses/registration/${registrationNumber}`);
      setOutpasses(outpassesResponse.data.data);

      const leavesResponse = await axios.get(`http://localhost:8000/fetch/fetchLeaves/registration/${registrationNumber}`);
      setLeaves(leavesResponse.data.data);

      const plsResponse = await axios.get(`http://localhost:8000/fetch/fetchPLs/registration/${registrationNumber}`);
      setPls(plsResponse.data.data);

      setError('');
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error fetching data. Please try again.');
      setUserData(null);
      setOutpasses([]);
      setLeaves([]);
      setPls([]);
    }
  };

  const isLeaveActive = (startDate, endDate) => {
    const currentDate = new Date();
    return new Date(startDate) <= currentDate && currentDate <= new Date(endDate);
  };

  const activeLeaves = leaves.some((leave) => isLeaveActive(leave.startDate, leave.endDate));

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
        {error && <Box mt="10px" color="red.500">{error}</Box>}
      </Box>

      <div className={styles.main}>
        {userData && (
          <UserCard
            userData={userData}
            outpassesCount={outpasses.length}
            leavesCount={leaves.length}
            plsCount={pls.length}
            activeLeaves={activeLeaves}
          />
        )}

        {outpasses.length > 0 && (
          <Box className={styles.outpass} mt="20px">
            {outpasses.map((outpass) => (
              <OutpassCard key={outpass.id} outpass={outpass} />
            ))}
          </Box>
        )}

        {leaves.length > 0 && (
          <Box className={styles.Leaves} mt="20px">
            {leaves.map((leave) => (
              <LeaveCard
                key={leave.id}
                leave={{ ...leave, isActive: isLeaveActive(leave.startDate, leave.endDate) }}
              />
            ))}
          </Box>
        )}

        {pls.length > 0 && (
          <Box className={styles.Pls} mt="20px">
            {pls.map((pl) => (
              <PLCard key={pl.id} pl={pl} />
            ))}
          </Box>
        )}
      </div>
    </Box>
  );
};

export default Search;