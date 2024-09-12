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
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null);      // Error state

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

  // Fetch students by class name when selected class changes
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);

        // Make an API request to the backend
        const response = await axios.get(`http://localhost:8000/fetchUser/users/${selectedClass}`);

        // Store students in a map for easy access and processing
        const studentMap = new Map();

        response.data.data.forEach(student => {
          studentMap.set(student.rollNumber, student);
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

    fetchStudents();
  }, [selectedClass]);

  // Handle class change
  const handleSelectChange = (e) => {
    setSelectedClass(e.target.value);
    console.log(`Selected class: ${e.target.value}`);
  };

  // Sort students by rollNumber before rendering
  const sortedStudents = Array.from(studentMap.values()).sort((a, b) => {
    // Ensure rollNumber comparison is numeric
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
            sortedStudents.map((student) => (
              <div key={student.rollNumber} className={styles.studentBox}>
                <p> {student.rollNumber}</p>
                <p> {student.name}</p>
              </div>
            ))
          ) : (
            <p>No students found for this class</p>
          )}
        </div>
      )}
    </>
  );
};

export default BoxComponent;
