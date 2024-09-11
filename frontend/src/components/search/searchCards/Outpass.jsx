import React from 'react';
import styles from './Cards.module.css';

const OutpassCard = ({ outpass }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatus = () => {
    const { extraDataArray } = outpass;

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

  const statusColor = status === 'Approved' ? 'green' : 'red'; // Adjust color as needed

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.name}>{`${outpass.firstName} ${outpass.lastName}`}</h3>
        <span className={styles.regNumber}>{outpass.registrationNumber}</span>
      </div>
      <div className={styles.content}>
        <div className={styles.row}>
          <span className={styles.label}>Date:</span>
          <span className={styles.value}>{formatDate(outpass.date)}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Time:</span>
          <span className={styles.value}>{`${outpass.startHour} - ${outpass.endHour}`}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Reason:</span>
          <span className={styles.value}>{outpass.reason}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Contact:</span>
          <span className={styles.value}>{outpass.contactNumber}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Class:</span>
          <span className={styles.value}>{outpass.className}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Status:</span>
          <span className={styles.value} style={{ color: statusColor }}>{status}</span>
        </div>
      </div>
    </div>
  );
};

export default OutpassCard;
