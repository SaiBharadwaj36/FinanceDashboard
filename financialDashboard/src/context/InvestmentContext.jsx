import { createContext, useState, useEffect } from 'react';

export const InvestmentContext = createContext();

export const InvestmentProvider = ({ children }) => {
  const [investments, setInvestments] = useState(() => {
    // Load from localStorage on component mount
    const savedInvestments = localStorage.getItem('investments');
    return savedInvestments ? JSON.parse(savedInvestments) : [];
  });

  useEffect(() => {
    // Save investments to localStorage whenever they change
    localStorage.setItem('investments', JSON.stringify(investments));
  }, [investments]);

  return (
    <InvestmentContext.Provider value={{ investments, setInvestments }}>
      {children}
    </InvestmentContext.Provider>
  );
};
