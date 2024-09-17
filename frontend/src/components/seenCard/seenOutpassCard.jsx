import React from 'react';
import { Eye, Calendar, Clock } from 'lucide-react';
import styles from './SeenOutpassCard.module.css'; // Import the CSS Module

const SeenOutpassCard = ({ data, role }) => {
  const { firstName, lastName, className, reason, date, startHour, endHour, extraDataArray, type } = data;

  const isApproved = role === 'Warden'
    ? extraDataArray[2] === 1 // Warden approval check
    : extraDataArray[1] === 1; // HOD approval check

  const isDeclined = role === 'Warden'
    ? extraDataArray[2] === -1 // Warden decline check
    : extraDataArray[1] === -1; // HOD decline check

  // Determine status
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
        <span className={`${styles.typeBadge} ${
          type === 'Outpass' ? styles.outpass :
          type === 'Leave' ? styles.leave :
          styles.pl
        }`}>
          {type}
        </span>
      </div>
      <p className={styles.className}>{className}</p>
      <p className={styles.reason}>{reason}</p>
      <div className={styles.details}>
        <Calendar className={styles.icon} />
        <span className={styles.date}>{new Date(date).toLocaleDateString()}</span>
        <Clock className={styles.icon} />
        <span className={styles.time}>{`${startHour} - ${endHour}`}</span>
      </div>
      <div className={styles.footer}>
        <div className={styles.seenInfo}>
          <Eye className={styles.iconSmall} />
          <span>Seen</span>
        </div>
        <div className={`${styles.status} ${statusClass}`}>
          {statusText}
        </div>
      </div>
    </div>
  );
};

export default SeenOutpassCard;
