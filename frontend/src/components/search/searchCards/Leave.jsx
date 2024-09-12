import React, { useState } from 'react';
import styles from './Cards.module.css';

const LeaveCard = ({ leave, onStatusChange }) => {
  const [isModalOpen, setModalOpen] = useState(false);

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
  const statusColor = status === 'Approved' ? 'green' : status === 'Declined' ? 'red' : 'gray';

  // Only render the card if the status is not "Pending"
  if (status === 'Pending') {
    return null;
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setModalOpen(false);
    }
  };

  const handleApprove = () => {
    onStatusChange(leave._id, 1); // Approve: send status=1
    console.log('Approved');
  };

  const handleDecline = () => {
    onStatusChange(leave._id, -1); // Decline: send status=-1
    console.log('Declined');
  };

  const getDeclinedBy = () => {
    const { extraDataArray } = leave;
    if (extraDataArray && extraDataArray[0] === -1) return 'Declined by Class Teacher';
    if (extraDataArray && extraDataArray[1] === -1) return 'Declined by HoD';
    if (extraDataArray && extraDataArray[2] === -1) return 'Declined by Warden';
    if (extraDataArray && extraDataArray[3] === -1) return 'Declined by Joint Director';
    return '';
  };

  const declinedBy = status === 'Declined' ? getDeclinedBy() : '';

  return (
    <>
      <div className={styles.card} onClick={() => setModalOpen(true)}>
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
          {declinedBy && (
            <div className={styles.row}>
              <span className={styles.label}>Declined By:</span>
              <span className={styles.value}>{declinedBy}</span>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Leave Details</h2>
              <button className={styles.closeButton} onClick={() => setModalOpen(false)}>
                &times;
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>Name:</span>
                <span className={styles.modalValue}>{`${leave.firstName} ${leave.lastName}`}</span>
              </div>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>Start Date:</span>
                <span className={styles.modalValue}>{formatDate(leave.startDate)}</span>
              </div>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>End Date:</span>
                <span className={styles.modalValue}>{formatDate(leave.endDate)}</span>
              </div>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>Reason:</span>
                <span className={styles.modalValue}>{leave.reasonForLeave}</span>
              </div>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>Place of Residence:</span>
                <span className={styles.modalValue}>{leave.placeOfResidence}</span>
              </div>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>Attendance Percentage:</span>
                <span className={styles.modalValue}>{leave.attendancePercentage}%</span>
              </div>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>Class:</span>
                <span className={styles.modalValue}>{leave.className}</span>
              </div>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>Contact Number:</span>
                <span className={styles.modalValue}>{leave.contactNumber}</span>
              </div>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>Status:</span>
                <span className={styles.modalValue} style={{ color: statusColor }}>{status}</span>
              </div>
              {declinedBy && (
                <div className={styles.modalRow}>
                  <span className={styles.modalLabel}>Declined By:</span>
                  <span className={styles.modalValue}>{declinedBy}</span>
                </div>
              )}
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

export default LeaveCard;
