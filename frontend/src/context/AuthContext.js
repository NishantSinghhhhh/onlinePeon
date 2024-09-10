import React, { createContext, useState, useContext } from 'react';

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component to provide user data and updateUserData function to children components
const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  // Function to update user data
  const updateUserData = (newUserData) => {
    setUserData(newUserData);
  };

  return (
    <AuthContext.Provider value={{ userData, updateUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
