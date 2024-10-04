import React, { createContext, useState, useEffect } from 'react';

// Rename the context
export const StudentLoginContext = createContext();

export const LoginStudentProvider = ({ children }) => {
  const [loginInfo, setLoginInfo] = useState(() => {
    // Check if there is any stored login info in localStorage
    const savedLoginInfo = localStorage.getItem('loginInfo');
    return savedLoginInfo ? JSON.parse(savedLoginInfo) : {}; // Parse it if found, otherwise return empty object
  });

  // Function to update login info and save it to localStorage
  const setStudentLoginInfo = (info) => {
    setLoginInfo(prevInfo => {
      const updatedInfo = { ...prevInfo, ...info };
      // Save the updated login info to localStorage
      localStorage.setItem('loginInfo', JSON.stringify(updatedInfo));
      return updatedInfo;
    });
  };

  // Optional: clear localStorage if the user logs out or loginInfo becomes empty
  useEffect(() => {
    if (Object.keys(loginInfo).length === 0) {
      localStorage.removeItem('loginInfo');
    }
  }, [loginInfo]);

  return (
    <StudentLoginContext.Provider value={{ loginInfo, setStudentLoginInfo }}>
      {children}
    </StudentLoginContext.Provider>
  );
};
