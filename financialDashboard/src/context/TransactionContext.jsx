import { createContext, useState, useContext } from "react";

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState({
    Food: 500,
    Entertainment: 400,
    Rent: 1000,
    Transport: 200,
    Utilities: 300,
  });

  // Add transaction (use functional update to avoid stale state)
  const addTransactions = (newTransaction) => {
    setTransactions((prev) => [...prev, newTransaction]);
  };

  // Update budgets
  const updateBudget = (category, amount) => {
    setBudgets((prev) => ({ ...prev, [category]: amount }));
  };

  return (
    <TransactionContext.Provider
      value={{ transactions, addTransactions, budgets, updateBudget }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionContext);