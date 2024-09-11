import React from 'react';
import styles from './User.module.css';

const UserCard = ({ userData, outpassesCount, leavesCount, plsCount, activeLeaves }) => {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.imageContainer}>
        {userData.imageUrl ? (
          <img
            className={styles.userImage}
            src={userData.imageUrl}
            alt={`${userData.name}'s profile`}
          />
        ) : (
          <div className={styles.placeholderImage}>
            {userData.name.charAt(0)}
          </div>
        )}
      </div>
      <div className={styles.infoContainer}>
        <h2 className={styles.name}>{userData.name}</h2>
        <p className={styles.info}><span className={styles.label}>Class:</span> {userData.class}</p>
        <p className={styles.info}><span className={styles.label}>Branch:</span> {userData.branch}</p>
        <p className={styles.info}><span className={styles.label}>Year:</span> {userData.year}</p>
        <p className={styles.info}><span className={styles.label}>Roll Number:</span> {userData.rollNumber}</p>
        <p className={styles.info}><span className={styles.label}>Registration Number:</span> {userData.registrationNumber}</p>
        <p className={styles.info}><span className={styles.label}>Class Teacher:</span> {userData.classTeacherName}</p>
        <p className={styles.info}><span className={styles.label}>Number of Outpasses:</span> {outpassesCount}</p>
        <p className={styles.info}><span className={styles.label}>Number of PLs:</span> {plsCount}</p>
        <p className={styles.info}><span className={styles.label}>Number of Leaves:</span> {leavesCount}</p>
        
        <p className={styles.info}>
          <span className={styles.label}>Active Leaves:</span>
          <span className={activeLeaves ? styles.activeYes : styles.activeNo}>
            {activeLeaves ? 'YES' : 'NO'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default UserCard;
