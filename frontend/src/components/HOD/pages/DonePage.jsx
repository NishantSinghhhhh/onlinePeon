import React, { useState, useEffect, useContext } from 'react';
import { Spinner } from '@chakra-ui/react'; // Assuming you're using Chakra UI
import { LoginContext } from '../../../context/LoginContext'; // Assuming you have a login context
import HodNavbar from './navbar';
import OutpassCard from '../../cards/outpassCard'; // Import OutpassCard
import LeaveCard from '../../cards/LeaveCard'; // Import LeaveCard

const DonePage = () => {
  const [outpasses, setOutpasses] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [filteredOutpasses, setFilteredOutpasses] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { loginInfo } = useContext(LoginContext); // Fetch login info from context

  useEffect(() => {
    fetchOutpasses();
    fetchLeaves();
  }, []);

  const extractClassLevel = (className) => {
    const match = className.match(/(FE|SE|TE|BE)/);
    return match ? match[0] : null;
  };

  const fetchOutpasses = async () => {
    try {
      const response = await fetch('http://localhost:8000/fetchAll/fetchAllOutpasses');
      if (!response.ok) throw new Error('Failed to fetch outpasses');
      const result = await response.json();

      if (result.success) {
        setOutpasses(result.data);
        filterAndSortOutpasses(result.data);
      } else {
        throw new Error('Failed to fetch outpasses');
      }
    } catch (error) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaves = async () => {
    try {
      const response = await fetch('http://localhost:8000/fetchAll/fetchAllLeaves');
      if (!response.ok) throw new Error('Failed to fetch leaves');
      const result = await response.json();

      if (result.success) {
        setLeaves(result.data);
        filterAndSortLeaves(result.data);
      } else {
        throw new Error('Failed to fetch leaves');
      }
    } catch (error) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortOutpasses = (outpasses) => {
    const assignedClassLevel = extractClassLevel(loginInfo.classAssigned);
    if (!assignedClassLevel) {
      setError('Invalid class assigned in your login info. Please log in again.');
      return;
    }

    let filtered;
    if (loginInfo.position.toLowerCase() === 'warden') {
      filtered = outpasses.filter(outpass => {
        const outpassClassLevel = extractClassLevel(outpass.className);
        return (
          outpassClassLevel === assignedClassLevel &&
          JSON.stringify(outpass.extraDataArray) === JSON.stringify([1, 1, 0, 0])
        );
      });
    } else {
      filtered = outpasses.filter(outpass => {
        const outpassClassLevel = extractClassLevel(outpass.className);
        return (
          outpassClassLevel === assignedClassLevel &&
          !outpass.className.toLowerCase().includes('fe') &&
          outpass.extraDataArray && outpass.extraDataArray[0] === 1
        );
      });
    }

    const sorted = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    setFilteredOutpasses(sorted);
  };

  const filterAndSortLeaves = (leaves) => {
    const assignedClassLevel = extractClassLevel(loginInfo.classAssigned);
    if (!assignedClassLevel) {
      setError('Invalid class assigned in your login info. Please log in again.');
      return;
    }

    let filtered;
    if (loginInfo.position.toLowerCase() === 'warden') {
      filtered = leaves.filter(leave => {
        const leaveClassLevel = extractClassLevel(leave.className);
        return (
          leaveClassLevel === assignedClassLevel &&
          JSON.stringify(leave.extraDataArray) === JSON.stringify([1, 1, 0, 0])
        );
      });
    } else {
      filtered = leaves.filter(leave => {
        const leaveClassLevel = extractClassLevel(leave.className);
        return (
          leaveClassLevel === assignedClassLevel &&
          !leave.className.toLowerCase().includes('fe') &&
          leave.extraDataArray && leave.extraDataArray[0] === 1
        );
      });
    }

    const sorted = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    setFilteredLeaves(sorted);
  };

  const handleStatusChange = (id, status) => {
    // Handle status change logic here
    console.log(`Outpass/Leave with ID ${id} status changed to ${status}`);
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <HodNavbar />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <h2>Outpasses</h2>
      {filteredOutpasses.map(outpass => (
        <OutpassCard key={outpass._id} data={outpass} onStatusChange={handleStatusChange} />
      ))}

      <h2>Leaves</h2>
      {filteredLeaves.map(leave => (
        <LeaveCard key={leave._id} data={leave} onStatusChange={handleStatusChange} />
      ))}
    </div>
  );
};

export default DonePage;
