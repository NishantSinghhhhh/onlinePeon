import React from 'react';
import styles from './Cards.module.css';

const PLCard = ({ pl }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const downloadDocument = () => {
    const link = document.createElement('a');
    link.href = pl.document;
    link.download = 'document.pdf'; // Set default file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatus = () => {
    const { extraDataArray } = pl;

    if (!extraDataArray || extraDataArray.length === 0) {
      return 'Pending';
    }

    if (extraDataArray.includes(-1)) {
      return 'Not Approved';
    }

    if (JSON.stringify(extraDataArray) === JSON.stringify([1, 1, 0, 0])) {
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
        <h3 className={styles.name}>{`${pl.firstName} ${pl.lastName}`}</h3>
        <span className={styles.regNumber}>{pl.registrationNumber}</span>
      </div>
      <div className={styles.content}>
        <div className={styles.row}>
          <span className={styles.label}>Class:</span>
          <span className={styles.value}>{pl.className}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Roll Number:</span>
          <span className={styles.value}>{pl.rollNumber}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Classes Missed:</span>
          <span className={styles.value}>{pl.classesMissed}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Reason:</span>
          <span className={styles.value}>{pl.reason}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Start Date:</span>
          <span className={styles.value}>{formatDate(pl.startDate)}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>End Date:</span>
          <span className={styles.value}>{formatDate(pl.endDate)}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Document:</span>
          <button className={styles.button} onClick={downloadDocument}>
            Download Document
          </button>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Status:</span>
          <span className={styles.value} style={{ color: statusColor }}>{status}</span>
        </div>
      </div>
    </div>
  );
};

export default PLCard;