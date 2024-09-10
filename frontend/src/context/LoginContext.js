import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const LoginContext = createContext();

// Create the provider component
export const LoginProvider = ({ children }) => {
  // Initialize with either the value in localStorage or an empty state
  const [loginInfo, setLoginInfo] = useState(() => {
    const storedLoginInfo = localStorage.getItem('loginInfo');
    return storedLoginInfo ? JSON.parse(storedLoginInfo) : {
      _id: '',
      name: '',
      email: '',
      staffId: '',
      contactNumber: '',
      position: '',
      classAssigned: '',
      branchAssigned: '',
      jwtToken: '',
    };
  });

  // Save loginInfo to localStorage whenever it changes
  useEffect(() => {
    if (loginInfo && loginInfo.jwtToken) {
      localStorage.setItem('loginInfo', JSON.stringify(loginInfo));
    }
  }, [loginInfo]);

  const updateLoginInfo = (newLoginInfo) => {
    setLoginInfo((prevInfo) => ({
      ...prevInfo,
      ...newLoginInfo,
    }));
  };

  const clearLoginInfo = () => {
    setLoginInfo({
      _id: '',
      name: '',
      email: '',
      staffId: '',
      contactNumber: '',
      position: '',
      classAssigned: '',
      branchAssigned: '',
      jwtToken: '',
    });
    localStorage.removeItem('loginInfo'); // Clear from localStorage on logout
  };

  return (
    <LoginContext.Provider value={{ loginInfo, updateLoginInfo, clearLoginInfo }}>
      {children}
    </LoginContext.Provider>
  );
};
