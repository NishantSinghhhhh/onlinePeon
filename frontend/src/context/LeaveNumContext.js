import React, { createContext, useContext, useState } from 'react';

// Create a context
const LeaveContext = createContext();

// Create a provider component
export const LeaveProvider = ({ children }) => {
  const [successLeaves, setSuccessLeaves] = useState(0);
  const [failureLeaves, setFailureLeaves] = useState(0);

  return (
    <LeaveContext.Provider value={{ successLeaves, setSuccessLeaves, failureLeaves, setFailureLeaves }}>
      {children}
    </LeaveContext.Provider>
  );
};

// Custom hook to use the LeaveContext
export const useLeave = () => {
  return useContext(LeaveContext);
};
