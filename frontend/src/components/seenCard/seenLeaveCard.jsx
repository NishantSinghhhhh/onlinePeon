import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import styles from './SeenOutpassCard.module.css'; // Import the CSS Module

const SeenLeaveCard = ({ data, role }) => {
  const {
    firstName,
    lastName,
    className,
    reasonForLeave,
    startDate,
    endDate,
    extraDataArray
  } = data;

  const isApproved = role === 'Warden'
    ? extraDataArray[2] === 1
    : extraDataArray[1] === 1; 

  const isDeclined = role === 'Warden'
    ? extraDataArray[2] === -1 
    : extraDataArray[1] === -1; 

  let statusClass = styles.statusPending;
  let statusText = 'Pending';

  if (isDeclined) {
    statusClass = styles.statusDeclined;
    statusText = 'Declined';
  } else if (isApproved) {
    statusClass = styles.statusApproved;
    statusText = 'Approved';
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{`${firstName} ${lastName}`}</h3>
        <span className={styles.leaveBadge}>
          Leave
        </span>
      </div>
      <p className={styles.className}>{className}</p>
      <p className={styles.reason}>{reasonForLeave}</p>
      <div className={styles.details}>
        <Calendar className={styles.icon} />
        <span className={styles.dateRange}>
          {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
        </span>
        <Clock className={styles.icon} />
        <span className={styles.timeRange}>
          {`From ${new Date(startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} to ${new Date(endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
        </span>
      </div>
      <div className={styles.statusContainer}>
        <span className={styles.statusLabel}>Status:</span>
        <div className={`${styles.status} ${statusClass}`}>
          {statusText}
        </div>
      </div>
    </div>
  );
};

export default SeenLeaveCard;
