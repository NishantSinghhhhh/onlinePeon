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
  const [studentMap, setStudentMap] = useState(new Map());  
  const [leavesMap, setLeavesMap] = useState(new Map()); 
  const [outpassesMap, setOutpassesMap] = useState(new Map()); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);     
  const [modalContent, setModalContent] = useState(null);  
  const [showModal, setShowModal] = useState(false); 
  const [activeStudents, setActiveStudents] = useState([]); // Add activeStudents state

  const classOptions = [
    'FE-COMP-A', 'FE-COMP-B', 'FE-ENTC-A', 'FE-ENTC-B', 'FE-IT-A', 'FE-IT-B',
    'FE-MECH', 'FE-ARE', 'SE-COMP-A', 'SE-COMP-B', 'SE-ENTC-A', 'SE-ENTC-B',
    'SE-IT-A', 'SE-IT-B', 'SE-MECH', 'TE-COMP-A', 'TE-COMP-B', 'TE-ENTC-A',
    'TE-ENTC-B', 'TE-IT-A', 'TE-IT-B', 'TE-MECH', 'BE-COMP-A', 'BE-COMP-B',
    'BE-ENTC-A', 'BE-ENTC-B', 'BE-IT-A', 'BE-IT-B', 'BE-MECH'
  ];

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

  const isActiveLeave = (leave) => {
    const now = new Date();
    const startDate = new Date(leave.startDate);
    const endDate = new Date(leave.endDate);
    
    const isApproved = leave.extraDataArray && leave.extraDataArray.every(value => value === 1);
    
    return now >= startDate && now <= endDate && isApproved;
  };

  const isActiveOutpass = (outpass) => {
    const now = new Date();
  
    const [startHour, startMinute] = outpass.startHour.split(':').map(Number);
    const [endHour, endMinute] = outpass.endHour.split(':').map(Number);
  
    const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, startMinute);
    const endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHour, endMinute);
  
    const isApproved = outpass.extraDataArray && outpass.extraDataArray.every(value => value === 1);
  
    return now >= startTime && now <= endTime && isApproved;
  };
  
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`https://online-peon.vercel.app/fetchUser/users/${selectedClass}`);
        const studentMap = new Map();

        response.data.data.forEach(student => {
          studentMap.set(student.rollNumber, { ...student, leaves: 0, outpasses: 0 });
        });

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

  useEffect(() => {
    const activeList = [];

    studentMap.forEach(student => {
      const studentLeaves = leavesMap.get(student.rollNumber) || [];
      const studentOutpasses = outpassesMap.get(student.rollNumber) || [];

      const hasActiveLeave = studentLeaves.some(isActiveLeave);
      const hasActiveOutpass = studentOutpasses.some(isActiveOutpass);

      if (hasActiveLeave || hasActiveOutpass) {
        activeList.push(student);
      }
    });

    setActiveStudents(activeList);
  }, [studentMap, leavesMap, outpassesMap]);

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

  const downloadCSV = () => {
    // CSV header
    const csvHeader = ['Roll Number', 'Name', 'Leave Reason', 'Leave Dates', 'Outpass Reason', 'Outpass Dates'];
    const csvRows = activeStudents.map((student) => {
      const studentLeaves = leavesMap.get(student.rollNumber) || [];
      const studentOutpasses = outpassesMap.get(student.rollNumber) || [];
  
      // Formatting leave and outpass data
      const leaveDetails = studentLeaves
        .filter(isActiveLeave)
        .map((leave) => ({
          reason: leave.reason || 'N/A',
          dates: `${leave.startDate} to ${leave.endDate}`
        }));
  
      const outpassDetails = studentOutpasses
        .filter(isActiveOutpass)
        .map((outpass) => ({
          reason: outpass.reason || 'N/A',
          dates: `${outpass.startHour} to ${outpass.endHour}`
        }));
  
      // Convert to string for CSV
      const leaveReasons = leaveDetails.map((leave) => leave.reason).join('; ');
      const leaveDates = leaveDetails.map((leave) => leave.dates).join('; ');
      const outpassReasons = outpassDetails.map((outpass) => outpass.reason).join('; ');
      const outpassDates = outpassDetails.map((outpass) => outpass.dates).join('; ');
  
      // Return the CSV row for the student
      return [
        student.rollNumber,
        student.name,
        leaveReasons,
        leaveDates,
        outpassReasons,
        outpassDates
      ];
    });
  
    // Convert to CSV string format
    const csvContent = [
      csvHeader.join(','), // CSV header
      ...csvRows.map(row => row.join(',')) // CSV rows
    ].join('\n'); // Join rows with newline
  
    // Create CSV file and download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'active_students_with_leave_outpass.csv');
    a.click();
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
              const studentOutpasses = outpassesMap.get(student.rollNumber) || [];
              const hasActiveLeave = studentLeaves.some(isActiveLeave);
              const hasActiveOutpass = studentOutpasses.some(isActiveOutpass);

              return (
                <div
                  key={student.rollNumber}
                  className={`${styles.studentBox} 
                  ${hasActiveLeave ? styles.activeLeave : ''} 
                  ${hasActiveOutpass ? styles.activeOutpass : ''}`}
                  onClick={() => handleBoxClick(student)}
                >
                  <p>{student.rollNumber} - {student.name}</p>
                </div>
              );
            })
          ) : (
            <p>No students found for the selected class.</p>
          )}
        </div>
      )}

      {/* Display active students */}
      <div className={styles.boxes}>
        <h3>Students on Active Leave or Outpass</h3>
        {activeStudents.length > 0 ? (
          <>
            {activeStudents.map((student) => (
              <div key={student.rollNumber} className={styles.studentBox}>
                <p>{student.rollNumber} - {student.name}</p>
              </div>
            ))}

            {/* Download Button */}
            <button onClick={downloadCSV} className={styles.downloadButton}>
              Download CSV
            </button>
          </>
        ) : (
          <p>No students are currently on active leave or outpass</p>
        )}
      </div>

      {/* Modal for detailed view */}
      {showModal && modalContent && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={closeModal}>
              &times;
            </button>
            <h2>{modalContent.student.name}</h2>
            <p>Roll Number: {modalContent.student.rollNumber}</p>
            <p>Total Leaves: {modalContent.totalLeaves}</p>
            <p>Total Outpasses: {modalContent.totalOutpasses}</p>

            {modalContent.activeLeaves.length > 0 && (
              <>
                <h3>Active Leaves</h3>
                <ul>
                  {modalContent.activeLeaves.map((leave, index) => (
                    <li key={index}>
                      {leave.startDate} - {leave.endDate}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default BoxComponent;
