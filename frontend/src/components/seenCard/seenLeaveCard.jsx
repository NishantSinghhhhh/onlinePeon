import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import styles from './SeenLeaveCard.module.css'; // Import the CSS Module

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

  // Role-based approval/decline logic
  const isApproved = role === 'Warden'
    ? extraDataArray[2] === 1
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
        <span className={styles.leaveBadge}>
          Leave
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-2">{className}</p>
      <p className="text-sm text-gray-700 mb-4 line-clamp-2">{reasonForLeave}</p>
      <div className={styles.details}>
        <Calendar className={styles.icon} />
        <span className="text-sm mr-4">
          {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
        </span>
        <Clock className={styles.icon} />
        <span className="text-sm">
          {`From ${new Date(startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} to ${new Date(endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
        </span>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center text-gray-600">
          <span className="text-sm">Status:</span>
        </div>
        <div className={`${styles.status} ${statusClass}`}>
          {statusText}
        </div>
      </div>
    </div>
  );
};

export default SeenLeaveCard;
