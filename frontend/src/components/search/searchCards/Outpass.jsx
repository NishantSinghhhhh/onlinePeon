import React, { useState } from 'react';
import styles from './Cards.module.css';

const OutpassCard = ({ outpass, onStatusChange, onVeto }) => {
  const [isModalOpen, setModalOpen] = useState(false);

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
  const statusColor = status === 'Approved' ? 'green' : status === 'Declined' ? 'red' : 'gray';

  const handleApprove = () => {
    onStatusChange(1); // Approve: send status=1
    console.log('Approved');
  };

  const handleDecline = () => {
    onStatusChange(-1); // Decline: send status=-1
    console.log('Declined');
  };

  const handleVeto = async () => {
    try {
        console.log('Veto action triggered');
        console.log('Outpass ID:', outpass._id); // Log the outpass ID

        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/veto/OutpassVeto`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ outpassId: outpass._id }) // Send necessary data
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Response from backend:', data);
        // Handle success response, e.g., update UI or state
    } catch (error) {
        console.error('Error during veto action:', error);
        // Handle error, e.g., show an alert
    }
};

  const getDeclinedBy = () => {
    const { extraDataArray } = outpass;
    if (extraDataArray && extraDataArray[0] === -1) return 'Declined by Class Teacher';
    if (extraDataArray && extraDataArray[1] === -1) return 'Declined by HoD';
    if (extraDataArray && extraDataArray[2] === -1) return 'Declined by Warden';
    if (extraDataArray && extraDataArray[3] === -1) return 'Declined by Join Director';
    return '';
  };

  const declinedBy = status === 'Declined' ? getDeclinedBy() : '';

  return (
    <>
      <div className={styles.card} onClick={() => setModalOpen(true)}>
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
        <div className={styles.modalOverlay} onClick={() => setModalOpen(false)}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Outpass Details</h2>
              <button className={styles.closeButton} onClick={() => setModalOpen(false)}>
                &times;
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>Name:</span>
                <span className={styles.modalValue}>{`${outpass.firstName} ${outpass.lastName}`}</span>
              </div>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>Date:</span>
                <span className={styles.modalValue}>{formatDate(outpass.date)}</span>
              </div>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>Time:</span>
                <span className={styles.modalValue}>{`${outpass.startHour} - ${outpass.endHour}`}</span>
              </div>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>Reason:</span>
                <span className={styles.modalValue}>{outpass.reason}</span>
              </div>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>Contact:</span>
                <span className={styles.modalValue}>{outpass.contactNumber}</span>
              </div>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>Class:</span>
                <span className={styles.modalValue}>{outpass.className}</span>
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
              <button className={styles.vetoButton} onClick={handleVeto}>Veto</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OutpassCard;
