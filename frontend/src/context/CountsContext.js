import React, { createContext, useState, useContext } from 'react';

const CountsContext = createContext();

export const CountsProvider = ({ children }) => {
  const [successLeaves, setSuccessLeaves] = useState(0);
  const [failureLeaves, setFailureLeaves] = useState(0);
  const [successOutpasses, setSuccessOutpasses] = useState(0);
  const [failureOutpasses, setFailureOutpasses] = useState(0);

  return (
    <CountsContext.Provider value={{ successLeaves, failureLeaves, successOutpasses, failureOutpasses, setSuccessLeaves, setFailureLeaves, setSuccessOutpasses, setFailureOutpasses }}>
      {children}
    </CountsContext.Provider>
  );
};

export const useCounts = () => useContext(CountsContext);
