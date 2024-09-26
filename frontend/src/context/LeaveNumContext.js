import React, { createContext, useContext, useState, useEffect } from 'react';

const LeaveContext = createContext();

export const LeaveProvider = ({ children }) => {
    const [successLeaves, setSuccessLeaves] = useState(0);
    const [failureLeaves, setFailureLeaves] = useState(0);

    // Reset counts at the end of each day
    useEffect(() => {
        const resetCounts = () => {
            setSuccessLeaves(0);
            setFailureLeaves(0);
        };

        const now = new Date();
        const nextReset = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0); // Midnight tomorrow

        const timeUntilNextReset = nextReset - now;

        const timer = setTimeout(resetCounts, timeUntilNextReset);

        return () => clearTimeout(timer);
    }, []);

    return (
        <LeaveContext.Provider value={{ successLeaves, setSuccessLeaves, failureLeaves, setFailureLeaves }}>
            {children}
        </LeaveContext.Provider>
    );
};

export const useLeaveContext = () => {
    return useContext(LeaveContext);
};
