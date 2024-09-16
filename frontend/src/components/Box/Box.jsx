import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../Admin/pages/AdminNavbar';
import HODNavbar from '../MainHod/pages/navbar';
import WardenNavbar from '../HOD/pages/navbar';
import StaffNavbar from '../StaffNavbar/StaffNavbar';
import { LoginContext } from '../../context/LoginContext';
import styles from './Box.module.css'; // Import the CSS module

const BoxComponent = () => {
  const { loginInfo } = useContext(LoginContext);
  const [selectedClass, setSelectedClass] = useState('FE-COMP-A');
  const [studentMap, setStudentMap] = useState(new Map());  // Store fetched students in a Map
  const [leavesMap, setLeavesMap] = useState(new Map());  // Store fetched leaves in a Map
  const [outpassesMap, setOutpassesMap] = useState(new Map());  // Store fetched outpasses in a Map
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null);      // Error state
  const [modalContent, setModalContent] = useState(null);  // State to manage modal content
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility

  // List of class options
  const classOptions = [
    'FE-COMP-A', 'FE-COMP-B', 'FE-ENTC-A', 'FE-ENTC-B', 'FE-IT-A', 'FE-IT-B',
    'FE-MECH', 'FE-ARE', 'SE-COMP-A', 'SE-COMP-B', 'SE-ENTC-A', 'SE-ENTC-B',
    'SE-IT-A', 'SE-IT-B', 'SE-MECH', 'TE-COMP-A', 'TE-COMP-B', 'TE-ENTC-A',
    'TE-ENTC-B', 'TE-IT-A', 'TE-IT-B', 'TE-MECH', 'BE-COMP-A', 'BE-COMP-B',
    'BE-ENTC-A', 'BE-ENTC-B', 'BE-IT-A', 'BE-IT-B', 'BE-MECH'
  ];

  // Function to render navbar based on the login position
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

  // Function to check if a leave is active
  const isActiveLeave = (leave) => {
    const now = new Date();
    const startDate = new Date(leave.startDate);
    const endDate = new Date(leave.endDate);

    return now >= startDate && now <= endDate;
  };

  // Fetch students, leaves, and outpasses when selected class changes
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);

        // Make an API request to fetch students
        const response = await axios.get(`https://online-peon.vercel.app/fetchUser/users/${selectedClass}`);
        const studentMap = new Map();

        response.data.data.forEach(student => {
          studentMap.set(student.rollNumber, { ...student, leaves: 0, outpasses: 0 });
        });

        // Update the state with the fetched students
        setStudentMap(studentMap);
      } catch (err) {
        setError('Failed to fetch students');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchLeaves = async () => {
      try {
        const response = await fetch('https://online-peon.vercel.app/fetchAll/fetchAllLeaves');
        if (!response.ok) throw new Error('Failed to fetch leaves');
        const result = await response.json();
        
        const leavesMap = new Map();
        result.data.forEach(leave => {
          if (!leavesMap.has(leave.rollNumber)) {
            leavesMap.set(leave.rollNumber, []);
          }
          leavesMap.get(leave.rollNumber).push(leave);
        });

        setLeavesMap(leavesMap);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchOutpasses = async () => {
      try {
        const response = await fetch('https://online-peon.vercel.app/fetchAll/fetchAllOutpasses');
        if (!response.ok) throw new Error('Failed to fetch outpasses');
        const result = await response.json();
        
        const outpassesMap = new Map();
        result.data.forEach(outpass => {
          if (!outpassesMap.has(outpass.rollNumber)) {
            outpassesMap.set(outpass.rollNumber, []);
          }
          outpassesMap.get(outpass.rollNumber).push(outpass);
        });

        setOutpassesMap(outpassesMap);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStudents();
    fetchLeaves();
    fetchOutpasses();
  }, [selectedClass]);

  // Handle class change
  const handleSelectChange = (e) => {
    setSelectedClass(e.target.value);
    console.log(`Selected class: ${e.target.value}`);
  };

  const handleBoxClick = (student) => {
    const studentLeaves = leavesMap.get(student.rollNumber) || [];
    const activeLeaves = studentLeaves.filter(isActiveLeave);
    const totalLeaves = studentLeaves.length;
    const totalOutpasses = (outpassesMap.get(student.rollNumber) || []).length;

    setModalContent({ student, totalLeaves, totalOutpasses, activeLeaves });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalContent(null);
  };

  const sortedStudents = Array.from(studentMap.values()).sort((a, b) => {
    return parseInt(a.rollNumber, 10) - parseInt(b.rollNumber, 10);
  });

  return (
    <>
      <div className={styles.container}>
        {renderNavbar()}
        <div className={styles.page}>
          <label className={styles.label} htmlFor="classDropdown">Select a Class</label>
          <select
            id="classDropdown"
            className={styles.dropdown}
            value={selectedClass}
            onChange={handleSelectChange}
          >
            {classOptions.map((classOption) => (
              <option key={classOption} value={classOption}>
                {classOption}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading and error handling */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className={styles.boxes}>
          {sortedStudents.length > 0 ? (
            sortedStudents.map((student) => {
              const studentLeaves = leavesMap.get(student.rollNumber) || [];
              const hasActiveLeave = studentLeaves.some(isActiveLeave);

              return (
                <div
                  key={student.rollNumber}
                  className={`${styles.studentBox} ${hasActiveLeave ? styles.activeLeave : ''}`}
                  onClick={() => handleBoxClick(student)}
                >
                  <p>{student.rollNumber}</p>
                  <p>{student.name}</p>
                </div>
              );
            })
          ) : (
            <p>No students found for this class</p>
          )}
        </div>
      )}

      {showModal && modalContent && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>{modalContent.student.name}</h2>
            <p>Roll Number: {modalContent.student.rollNumber}</p>
            <p>Total Leaves: {modalContent.totalLeaves}</p>
            <p>Total Outpasses: {modalContent.totalOutpasses}</p>
            {modalContent.activeLeaves.length > 0 && (
              <>
                <h3>Active Leaves:</h3>
                <ul>
                  {modalContent.activeLeaves.map((leave, index) => (
                    <li key={index}>
                      <p>Reason: {leave.reasonForLeave}</p>
                      <p>Start Date: {new Date(leave.startDate).toLocaleDateString()}</p>
                      <p>End Date: {new Date(leave.endDate).toLocaleDateString()}</p>
                      <p>Place of Residence: {leave.placeOfResidence}</p>
                      <p>Attendance Percentage: {leave.attendancePercentage}</p>
                      <p>Contact Number: {leave.contactNumber}</p>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default BoxComponent;
