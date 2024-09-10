import React from 'react';
import { Eye, Calendar } from 'lucide-react';
import styles from './SeenOutpassCard.module.css'; // Import the CSS Module

const SeenPLCard = ({ data, role }) => {
  const {
    firstName,
    lastName,
    className,
    rollNumber,
    reason,
    startDate,
    endDate,
    extraDataArray,
  } = data;

  // Role-based approval/decline logic for PL
  const isApproved = role === 'Warden'
    ? extraDataArray[2] === 1 // Warden approval check
    : extraDataArray[1] === 1; // HOD approval check

  const isDeclined = role === 'Warden'
    ? extraDataArray[2] === -1 // Warden decline check
    : extraDataArray[1] === -1; // HOD decline check

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{`${firstName} ${lastName}`}</h3>
        <span className={styles.className}>{className}</span>
      </div>
      <p className={styles.rollNumber}>Roll No: {rollNumber}</p>
      <p className={styles.reason}>{reason}</p>
      <div className={styles.details}>
        <div className={styles.dateRow}>
          <Calendar className={styles.icon} />
          <span className={styles.dateText}>{`From: ${new Date(startDate).toLocaleDateString()}`}</span>
        </div>
        <div className={styles.dateRow}>
          <Calendar className={styles.icon} />
          <span className={styles.dateText}>{`To: ${new Date(endDate).toLocaleDateString()}`}</span>
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.seen}>
          <Eye className={styles.iconSmall} />
          <span>Seen</span>
        </div>
        <div
          className={`${styles.status} ${
            isApproved ? styles.statusApproved : isDeclined ? styles.statusDeclined : styles.statusPending
          }`}
        >
          {isApproved ? 'Approved' : isDeclined ? 'Declined' : 'Pending'}
        </div>
      </div>
    </div>
  );
};

export default SeenPLCard;
