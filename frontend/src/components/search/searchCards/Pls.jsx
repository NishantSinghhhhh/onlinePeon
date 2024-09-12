import React, { useState } from 'react';
import styles from './Cards.module.css';

const PLCard = ({ pl, onStatusChange }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatus = () => {
    const { extraDataArray } = pl;

    if (!extraDataArray) {
      return 'Pending';
    }

    if (extraDataArray.includes(-1)) {
      return 'Declined';
    }

    // Use JSON.stringify to compare arrays
    if (JSON.stringify(extraDataArray) === JSON.stringify([1, 1, 0, 0])) {
      return 'Approved';
    }

    return 'Pending';
  };

  const status = getStatus();
  let statusColor;
  switch (status) {
    case 'Approved':
      statusColor = 'green';
      break;
    case 'Declined':
      statusColor = 'red';
      break;
    case 'Pending':
    default:
      statusColor = 'gray'; // Gray color for Pending status
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setModalOpen(false);
    }
  };

  const handleApprove = () => {
    onStatusChange(pl._id, 1); // Approve: send status=1
    console.log('Approved');
  };

  const handleDecline = () => {
    onStatusChange(pl._id, -1); // Decline: send status=-1
    console.log('Declined');
  };

  return (
    <>
      <div className={styles.card} onClick={() => setModalOpen(true)}>
        <div className={styles.header}>
          <h3 className={styles.name}>{`${pl.firstName} ${pl.lastName}`}</h3>
          <span className={styles.regNumber}>{pl.registrationNumber}</span>
        </div>
        <div className={styles.content}>
          <div className={styles.row}>
            <span className={styles.label}>Reason for Leave:</span>
            <span className={styles.value}>{pl.reasonForLeave}</span>
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
            <span className={styles.label}>Place of Residence:</span>
            <span className={styles.value}>{pl.placeOfResidence}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Attendance Percentage:</span>
            <span className={styles.value}>{pl.attendancePercentage}%</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Contact Number:</span>
            <span className={styles.value}>{pl.contactNumber}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Class:</span>
            <span className={styles.value}>{pl.className}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Status:</span>
            <span className={styles.value} style={{ color: statusColor }}>{status}</span>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>PL Details</h2>
              <button className={styles.closeButton} onClick={() => setModalOpen(false)}>
                &times;
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>Name:</span>
                <span className={styles.modalValue}>{`${pl.firstName} ${pl.lastName}`}</span>
              </div>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>Start Date:</span>
                <span className={styles.modalValue}>{formatDate(pl.startDate)}</span>
              </div>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>End Date:</span>
                <span className={styles.modalValue}>{formatDate(pl.endDate)}</span>
              </div>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>Reason:</span>
                <span className={styles.modalValue}>{pl.reasonForLeave}</span>
              </div>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>Place of Residence:</span>
                <span className={styles.modalValue}>{pl.placeOfResidence}</span>
              </div>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>Attendance Percentage:</span>
                <span className={styles.modalValue}>{pl.attendancePercentage}%</span>
              </div>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>Class:</span>
                <span className={styles.modalValue}>{pl.className}</span>
              </div>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>Contact Number:</span>
                <span className={styles.modalValue}>{pl.contactNumber}</span>
              </div>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>Status:</span>
                <span className={styles.modalValue} style={{ color: statusColor }}>{status}</span>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.approveButton} onClick={handleApprove}>Approve</button>
              <button className={styles.declineButton} onClick={handleDecline}>Decline</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PLCard;
