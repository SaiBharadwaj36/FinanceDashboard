import { motion } from "framer-motion";
import { useTransactions } from "../context/TransactionContext";
import React, { useState } from "react";
import ExpensePieChart from "./ExpensePieChart"; // Import the ExpensePieChart

const BudgetTracker = () => {
  const { transactions, budgets, updateBudget } = useTransactions();
  const [newCategory, setNewCategory] = useState("");

  // Calculate spent amounts
  const spentAmounts = transactions.reduce((acc, transaction) => {
    if (transaction.type === "expense") {
      const category = transaction.category;
      acc[category] = (acc[category] || 0) + Number(transaction.amount);
    }
    return acc;
  }, {});

  // Add new budget category
  const addCategory = () => {
    if (newCategory.trim() && !budgets[newCategory.trim()]) {
      updateBudget(newCategory.trim(), 0); // Initialize budget to 0
      setNewCategory("");
    }
  };

  // Progress bar color logic
  const getProgressBarColor = (spent, budget) => {
    if (budget === 0) return "bg-gray-300"; // Handle zero budgets
    const percentage = (spent / budget) * 100;
    if (percentage > 100) return "bg-red-500";
    if (percentage > 80) return "bg-yellow-500";
    return "bg-teal-500";
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-teal-300 via-blue-300 to-indigo-300 m-0 p-0 flex flex-col">
      {/* Main Content Container */}
      <div className="flex-1 w-full px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="bg-white p-8 rounded-2xl shadow-xl border border-teal-100 h-full"
        >
          {/* Header */}
          <h2 className="text-4xl font-extrabold mb-8 text-teal-800 tracking-tight">
            Budget Tracker
          </h2>

          {/* Split Layout: Pie Chart and Budget Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100%-4rem)]">
            {/* Left Side: Expense Pie Chart */}
            <div className="lg:col-span-1 h-full">
              <div className="bg-gradient-to-br from-teal-200 to-blue-200 p-6 rounded-xl shadow-md h-full flex flex-col">
                <h3 className="text-lg font-semibold text-teal-800 mb-4">Expense Overview</h3>
                <div className="flex-1 flex justify-center items-center">
                  <ExpensePieChart />
                </div>
              </div>
            </div>

            {/* Right Side: Budget Details */}
            <div className="lg:col-span-1 h-full flex flex-col">
              <div className="flex-1 space-y-6 overflow-y-auto">
                {Object.entries(budgets).map(([category, budget]) => {
                  const spent = spentAmounts[category] || 0;
                  const percentage = budget === 0 ? 0 : Math.min((spent / budget) * 100, 100);

                  return (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="bg-gradient-to-r from-teal-150 to-blue-150 p-5 rounded-lg shadow-md border border-teal-200 hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-center mb-3">
                        <span className="font-semibold text-teal-900 text-lg">{category}</span>
                        <span
                          className={`${
                            spent > budget ? "text-red-600" : "text-teal-600"
                          } font-medium`}
                        >
                          ${spent} / ${budget}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.5 }}
                          className={`${getProgressBarColor(
                            spent,
                            budget
                          )} h-3 rounded-full`}
                        />
                      </div>
                      {spent > budget && (
                        <span className="text-red-600 text-sm mt-2 block">
                          Budget exceeded!
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Add New Category */}
              <div className="mt-8 flex gap-3">
                <input
                  type="text"
                  placeholder="Add new category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="p-3 border border-teal-300 rounded-lg flex-1 bg-white text-teal-900 placeholder-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                />
                <button
                  onClick={addCategory}
                  className="px-5 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Add Category
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BudgetTracker;