import React, { createContext, useState } from 'react';

// Rename the context
export const StudentLoginContext = createContext();

export const LoginStudentProvider = ({ children }) => {
  const [loginInfo, setLoginInfo] = useState({});

  // Rename the function here
  const setStudentLoginInfo = (info) => {
    setLoginInfo(prevInfo => ({ ...prevInfo, ...info }));
  };

  return (
    <StudentLoginContext.Provider value={{ loginInfo, setStudentLoginInfo }}>
      {children}
    </StudentLoginContext.Provider>
  );
};
