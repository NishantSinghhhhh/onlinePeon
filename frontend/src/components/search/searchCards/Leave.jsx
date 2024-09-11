import React from 'react';
import styles from './Cards.module.css';

const LeaveCard = ({ leave }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatus = () => {
    const { extraDataArray } = leave;

    if (!extraDataArray) {
      return 'Pending';
    }

    if (extraDataArray.includes(-1)) {
      return 'Declined';
    }

    if (extraDataArray.every((status) => status === 1)) {
      return 'Approved';
    }

    return 'Pending';
  };

  const status = getStatus();

  // Only render the card if the status is not "Pending"
  if (status === 'Pending') {
    return null;
  }

  const statusColor = status === 'Approved' ? 'green' : 'red';

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.name}>{`${leave.firstName} ${leave.lastName}`}</h3>
        <span className={styles.regNumber}>{leave.registrationNumber}</span>
      </div>
      <div className={styles.content}>
        <div className={styles.row}>
          <span className={styles.label}>Reason for Leave:</span>
          <span className={styles.value}>{leave.reasonForLeave}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Start Date:</span>
          <span className={styles.value}>{formatDate(leave.startDate)}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>End Date:</span>
          <span className={styles.value}>{formatDate(leave.endDate)}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Place of Residence:</span>
          <span className={styles.value}>{leave.placeOfResidence}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Attendance Percentage:</span>
          <span className={styles.value}>{leave.attendancePercentage}%</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Contact Number:</span>
          <span className={styles.value}>{leave.contactNumber}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Class:</span>
          <span className={styles.value}>{leave.className}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Status:</span>
          <span className={styles.value} style={{ color: statusColor }}>{status}</span>
        </div>
      </div>
    </div>
  );
};

export default LeaveCard;