import React, { useState, useEffect, useContext } from 'react';
import HODnavbar from './navbar'; // Adjust the path to HODnavbar
import SeenOutpassCard from '../../seenCard/seenOutpassCard'; // Adjust the path to SeenOutpassCard
import SeenLeaveCard from '../../seenCard/seenLeaveCard'; // Adjust the path to SeenLeaveCard
import SeenPLCard from '../../seenCard/seenPLcard'; // Adjust the path to SeenPLCard
import { LoginContext } from '../../../context/LoginContext'; // Adjust the path to LoginContext
import styles from './navbar.module.css'; // Import CSS Module for DonePage

const DonePage = () => {
  const [outpasses, setOutpasses] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [PLs, setPLs] = useState([]); // New state for PLs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { loginInfo } = useContext(LoginContext); // Assuming loginInfo contains branch/class info

  useEffect(() => {
    if (loginInfo.position === 'HOD') {
      fetchOutpasses();
      fetchLeaves();
      fetchPLs(); // Fetch PLs when the component mounts
    } else {
      setError('You do not have permission to view this page.');
      setLoading(false);
    }
  }, [loginInfo.position]);

  const fetchOutpasses = async () => {
    try {
      const response = await fetch('http://localhost:8000/fetchAll/fetchAllOutpasses');
      if (!response.ok) throw new Error('Failed to fetch outpasses');
      const result = await response.json();

      if (result.success) {
        const filteredOutpasses = filterOutpassesByStatusAndBranch(result.data);
        setOutpasses(filteredOutpasses);
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
        const filteredLeaves = filterLeavesByStatusAndBranch(result.data);
        setLeaves(filteredLeaves);
      } else {
        throw new Error('Failed to fetch leaves');
      }
    } catch (error) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchPLs = async () => {
    try {
      const response = await fetch('http://localhost:8000/fetchAll/fetchAllPLs');
      if (!response.ok) throw new Error('Failed to fetch PL requests');
      const result = await response.json();

      if (result.success) {
        setPLs(result.data);
        filterAndSortPLs(result.data); // Implement filter and sort logic for PLs
      } else {
        throw new Error('Failed to fetch PL requests');
      }
    } catch (error) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filterOutpassesByStatusAndBranch = (data) => {
    return data
      .filter(outpass => 
        outpass.branch === loginInfo.branch && 
        (arraysEqual(outpass.extraDataArray, [1, 1, 0, 0]) || arraysEqual(outpass.extraDataArray, [1, -1, 0, 0]))
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const filterLeavesByStatusAndBranch = (data) => {
    return data
      .filter(leave => 
        leave.branch === loginInfo.branch && 
        (arraysEqual(leave.extraDataArray, [1, 1, 0, 0]) || arraysEqual(leave.extraDataArray, [1, -1, 0, 0]))
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const filterAndSortPLs = (data) => {
    return data
      .filter(pl => 
        pl.branch === loginInfo.branch && 
        (arraysEqual(pl.extraDataArray, [1, 1, 0, 0]) || arraysEqual(pl.extraDataArray, [1, -1, 0, 0]))
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const arraysEqual = (arr1, arr2) => {
    return arr1.length === arr2.length && arr1.every((val, index) => val === arr2[index]);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  const approvedOutpasses = outpasses.filter(outpass => arraysEqual(outpass.extraDataArray, [1, 1, 0, 0]));
  const declinedOutpasses = outpasses.filter(outpass => arraysEqual(outpass.extraDataArray, [1, -1, 0, 0]));

  const approvedLeaves = leaves.filter(leave => arraysEqual(leave.extraDataArray, [1, 1, 0, 0]));
  const declinedLeaves = leaves.filter(leave => arraysEqual(leave.extraDataArray, [1, -1, 0, 0]));

  const approvedPLs = PLs.filter(pl => arraysEqual(pl.extraDataArray, [1, 1, 0, 0]));
  const declinedPLs = PLs.filter(pl => arraysEqual(pl.extraDataArray, [1, -1, 0, 0]));

  return (
    <div className={styles.container}>
      <HODnavbar />
      <div className={styles.main}>
        <h2 className={styles.title}>Seen Outpasses, Leaves, and PLs</h2>
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
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Approved Leaves</h3>
            {approvedLeaves.map(leave => (
              <SeenLeaveCard key={leave._id} data={leave} />
            ))}
          </div>
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Declined Leaves</h3>
            {declinedLeaves.map(leave => (
              <SeenLeaveCard key={leave._id} data={leave} />
            ))}
          </div>
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Approved PLs</h3>
            {approvedPLs.map(pl => (
              <SeenPLCard key={pl._id} data={pl} />
            ))}
          </div>
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Declined PLs</h3>
            {declinedPLs.map(pl => (
              <SeenPLCard key={pl._id} data={pl} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonePage;
