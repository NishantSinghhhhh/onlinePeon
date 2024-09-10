// SeenLeaveCard.jsx
import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import styles from './SeenOutpassCard.module.css'; // Import the CSS Module

const SeenLeaveCard = ({ data }) => {
  const { firstName, lastName, className, reason, date, startHour, endHour, extraDataArray } = data;

  const isApproved = extraDataArray[2] === 1;
  const isDeclined = extraDataArray[2] === -1;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{`${firstName} ${lastName}`}</h3>
        <span className={styles.leaveBadge}>
          Leave
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-2">{className}</p>
      <p className="text-sm text-gray-700 mb-4 line-clamp-2">{reason}</p>
      <div className={styles.details}>
        <Calendar className={styles.icon} />
        <span className="text-sm mr-4">{new Date(date).toLocaleDateString()}</span>
        <Clock className={styles.icon} />
        <span className="text-sm">{`${startHour} - ${endHour}`}</span>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center text-gray-600">
          <span className="text-sm">Status:</span>
        </div>
        <div className={`${styles.status} ${
          isApproved ? styles.statusApproved :
          isDeclined ? styles.statusDeclined :
          styles.statusPending
        }`}>
          {isApproved ? 'Approved' : isDeclined ? 'Declined' : 'Pending'}
        </div>
      </div>
    </div>
  );
};

export default SeenLeaveCard;
