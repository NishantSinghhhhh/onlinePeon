import React, { useState, useEffect, useContext } from 'react';
import HodNavbar from './navbar'; // Adjust the path to HodNavbar
import SeenOutpassCard from '../../seenCard/seenOutpassCard'; // Adjust the path to SeenOutpassCard
import SeenLeaveCard from '../../seenCard/seenLeaveCard'; // Import the SeenLeaveCard
import { LoginContext } from '../../../context/LoginContext'; // Adjust the path to LoginContext
import styles from './navbar.module.css'; // Import CSS Module for DonePage

const DonePage = () => {
  const [outpasses, setOutpasses] = useState([]);
  const [leaves, setLeaves] = useState([]); // State for leaves
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { loginInfo } = useContext(LoginContext);

  useEffect(() => {
    fetchOutpasses();
    fetchLeaves(); // Fetch leaves when the component mounts
  }, []);

  const fetchOutpasses = async () => {
    try {
      const response = await fetch('http://localhost:8000/fetchAll/fetchAllOutpasses');
      if (!response.ok) throw new Error('Failed to fetch outpasses');
      const result = await response.json();

      if (result.success) {
        const filteredOutpasses = filterAndSortOutpasses(result.data);
        setOutpasses(filteredOutpasses);
        console.log('Filtered Outpasses:', filteredOutpasses);

        // Log the position of the user from the context
        console.log('Logged in as:', loginInfo.name);
        console.log('User Position:', loginInfo.position);
        console.log('Class of the User', loginInfo.classAssigned);
      } else {
        throw new Error('Failed to fetch outpasses');
      }
    } catch (error) {
      setError(error.message || 'An unexpected error occurred');
    }
  };

  const fetchLeaves = async () => {
    try {
      const response = await fetch('http://localhost:8000/fetchAll/fetchAllLeaves');
      if (!response.ok) throw new Error('Failed to fetch leaves');
      const result = await response.json();

      if (result.success) {
        const filteredLeaves = filterAndSortLeaves(result.data);
        setLeaves(filteredLeaves);
        console.log('All Leaves:', result.data);
      } else {
        throw new Error('Failed to fetch leaves');
      }
    } catch (error) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortOutpasses = (data) => {
    const assignedClassLevel = extractClassLevel(loginInfo.classAssigned);
    let approvedStatus, declinedStatus;

    if (loginInfo.position === 'Warden') {
      approvedStatus = [1, 1, 1, 0];
      declinedStatus = [1, 1, -1, 0];
    } else if (loginInfo.position === 'HOD') {
      approvedStatus = [1, 1, 0, 0];
      declinedStatus = [1, -1, 0, 0];
    } else {
      return [];
    }

    return data
      .filter(item => {
        const itemClassLevel = extractClassLevel(item.className);
        return itemClassLevel === assignedClassLevel &&
          (arraysEqual(item.extraDataArray, approvedStatus) || arraysEqual(item.extraDataArray, declinedStatus));
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const filterAndSortLeaves = (data) => {
    const assignedClassLevel = extractClassLevel(loginInfo.classAssigned);
    let approvedStatus, declinedStatus;

    if (loginInfo.position === 'Warden') {
      approvedStatus = [1, 1, 1, 0];
      declinedStatus = [1, 1, -1, 0];
    } else if (loginInfo.position === 'HOD') {
      approvedStatus = [1, 1, 0, 0];
      declinedStatus = [1, -1, 0, 0];
    } else {
      return [];
    }

    return data
      .filter(item => {
        const itemClassLevel = extractClassLevel(item.className);
        return itemClassLevel === assignedClassLevel &&
          (arraysEqual(item.extraDataArray, approvedStatus) || arraysEqual(item.extraDataArray, declinedStatus));
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const extractClassLevel = (className) => {
    return className.split('-')[0];
  };

  const arraysEqual = (arr1, arr2) => {
    return arr1.length === arr2.length && arr1.every((val, index) => val === arr2[index]);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  const approvedOutpasses = outpasses.filter(outpass => outpass.extraDataArray[2] === 1);
  const declinedOutpasses = outpasses.filter(outpass => outpass.extraDataArray[2] === -1);

  return (
    <div className={styles.container}>
      <HodNavbar />
      <div className={styles.main}>
        <h2 className={styles.title}>Seen Outpasses</h2>
        <div className={styles.grid}>
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Approved Outpasses</h3>
            {approvedOutpasses.map(outpass => (
              <SeenOutpassCard key={outpass._id} data={outpass} />
            ))}
          </div>
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Declined Outpasses</h3>
            {declinedOutpasses.map(outpass => (
              <SeenOutpassCard key={outpass._id} data={outpass} />
            ))}
          </div>
        </div>

        <h2 className={styles.title}>Seen Leaves</h2>
        <div className={styles.grid}>
          {leaves.map(leave => (
            <SeenLeaveCard key={leave._id} data={leave} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DonePage;
