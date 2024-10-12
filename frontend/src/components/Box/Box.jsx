import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../Admin/pages/AdminNavbar';
import HODNavbar from '../MainHod/pages/navbar';
import WardenNavbar from '../HOD/pages/navbar';
import StaffNavbar from '../StaffNavbar/StaffNavbar';
import { LoginContext } from '../../context/LoginContext';
import styles from './Box.module.css';

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
  const [activeStudents, setActiveStudents] = useState([]);
  const [studentsOnLeave, setStudentsOnLeave] = useState([]);
  const [studentsOnOutpass, setStudentsOnOutpass] = useState([]);

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

        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/fetchUser/users/${selectedClass}`);
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
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/fetchAll/fetchAllLeaves`);
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
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/fetchAll/fetchAllOutpasses`);
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
    const updateActiveStudents = () => {
      const onLeave = [];
      const onOutpass = [];

      studentMap.forEach(student => {
        const studentLeaves = leavesMap.get(student.rollNumber) || [];
        const studentOutpasses = outpassesMap.get(student.rollNumber) || [];

        const hasActiveLeave = studentLeaves.some(isActiveLeave);
        const hasActiveOutpass = studentOutpasses.some(isActiveOutpass);

        if (hasActiveLeave) {
          onLeave.push(student);
        }
        if (hasActiveOutpass) {
          onOutpass.push(student);
        }
      });

      setStudentsOnLeave(onLeave);
      setStudentsOnOutpass(onOutpass);
      setActiveStudents([...onLeave, ...onOutpass]);
    };

    updateActiveStudents();
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

  const downloadCSV = (students, filePrefix) => {
    // Define CSV header based on the file prefix
    const csvHeader = filePrefix === 'leave' 
      ? ['Roll Number', 'Name', 'Reason for Leave', 'Dates', 'Place of Residence', 'Attendance Percentage', 'Contact Number'] 
      : ['Roll Number', 'Name', 'Reason', 'Times', 'Contact Number', 'Class Name'];
  
    const csvRows = students.map((student) => {
      const studentLeaves = leavesMap.get(student.rollNumber) || [];
      const studentOutpasses = outpassesMap.get(student.rollNumber) || [];
      
      let details;
      if (filePrefix === 'leave') {
        details = studentLeaves.filter(isActiveLeave)[0]; // Get active leave details
        return [
          student.rollNumber,
          `${student.firstName} ${student.lastName}`, // Full name
          details?.reasonForLeave || 'N/A', // Reason for leave
          details ? `${new Date(details.startDate).toLocaleDateString()} to ${new Date(details.endDate).toLocaleDateString()}` : 'N/A', // Date range for leave
          details?.placeOfResidence || 'N/A', // Place of residence
          details?.attendancePercentage !== undefined ? details.attendancePercentage : 'N/A', // Attendance percentage
          details?.contactNumber || 'N/A' // Contact number
        ];
      } else {
        details = studentOutpasses.filter(isActiveOutpass)[0]; // Get active outpass details
        return [
          student.rollNumber,
          `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'N/A', // Full name
          details?.reason || 'N/A', // Reason for outpass
          details ? `${details.startHour} to ${details.endHour}` : 'N/A', // Time range for outpass
          details?.contactNumber || 'N/A', // Contact number
          details?.className || 'N/A' // Class name
        ];
      }
    });
  
    const csvContent = [
      csvHeader.join(','), // Join header
      ...csvRows.map(row => row.join(',')) // Join each row
    ].join('\n'); // Join all rows with a new line
  
    const blob = new Blob([csvContent], { type: 'text/csv' }); // Create a Blob for CSV
    const url = window.URL.createObjectURL(blob); // Create a URL for the Blob
    const a = document.createElement('a'); // Create an anchor element
    a.setAttribute('href', url); // Set the href to the Blob URL
    a.setAttribute('download', `${filePrefix}_students.csv`); // Set the filename
    a.click(); // Trigger the download
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

      <div className={styles.boxes}>
          <>
            <div className={styles.downloadButtons}>
              <button 
                onClick={() => downloadCSV(studentsOnLeave, 'leave')} 
                className={styles.downloadButton}
                disabled={studentsOnLeave.length === 0}
              >
                Download Students on Leave
              </button>
              <button 
                onClick={() => downloadCSV(studentsOnOutpass, 'outpass')} 
                className={styles.downloadButton}
                disabled={studentsOnOutpass.length === 0}
              >
                Download Students on Outpass
              </button>
            </div>
          </>
    
        {(studentsOnLeave.length === 0 && studentsOnOutpass.length === 0) && (
          <p>No students are currently on active leave or outpass</p>
        )}
      </div>

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