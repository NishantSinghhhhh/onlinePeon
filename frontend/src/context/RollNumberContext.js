import React, { createContext, useContext, useState } from 'react';

const RollNumberContext = createContext();

export const RollNumberProvider = ({ children }) => {
  const [rollNumber, setRollNumber] = useState('');

  return (
    <RollNumberContext.Provider value={{ rollNumber, setRollNumber }}>
      {children}
    </RollNumberContext.Provider>
  );
};

export const useRollNumber = () => useContext(RollNumberContext);
