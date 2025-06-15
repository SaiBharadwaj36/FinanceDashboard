import { useState } from "react";
import { PlusIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { useTransactions } from "../context/TransactionContext";

const AddTransaction = () => {
  const { addTransactions, budgets, transactions } = useTransactions();
  const [newTransaction, setNewTransaction] = useState({
    type: "income",
    category: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  const categories = {
    income: ["Salary", "Freelance", "Investment", "Gift"],
    expense: Object.keys(budgets),
  };

  const handleAddTransaction = () => {
    if (!newTransaction.category || !newTransaction.amount || !newTransaction.date) {
      setMessage({ type: "error", text: "Please fill in all fields." });
      return;
    }

    if (isNaN(newTransaction.amount) || Number(newTransaction.amount) <= 0) {
      setMessage({ type: "error", text: "Please enter a valid amount." });
      return;
    }

    addTransactions({
      ...newTransaction,
      amount: Number(newTransaction.amount).toFixed(2),
    });

    setNewTransaction({
      type: "income",
      category: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
    });

    setMessage({ type: "success", text: "Transaction added!" });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  return (
    <div className="bg-gradient-to-br from-blue-400 to-teal-500 p-8 rounded-2xl shadow-lg text-white">
      <h2 className="text-3xl font-extrabold mb-6 text-center">Add Transaction</h2>
      
      <AnimatePresence>
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-md mb-6 flex items-center ${
              message.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {message.type === "success" ? <CheckIcon className="h-5 w-5 mr-2" /> : <XMarkIcon className="h-5 w-5 mr-2" />}
            <span>{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Type</label>
          <select
            value={newTransaction.type}
            onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value, category: "" })}
            className="p-3 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-pink-400"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Category</label>
          <select
            value={newTransaction.category}
            onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
            className="p-3 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-pink-400"
          >
            <option value="" disabled>Select a category</option>
            {categories[newTransaction.type].map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Amount</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={newTransaction.amount}
            onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
            className="p-3 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-pink-400"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Date</label>
          <input
            type="date"
            value={newTransaction.date}
            onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
            className="p-3 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-pink-400"
          />
        </div>

        <button
          onClick={handleAddTransaction}
          className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition flex items-center justify-center w-full"
        >
          <PlusIcon className="h-5 w-5 mr-2" /> Add Entry
        </button>
      </div>

      <h2 className="text-xl font-semibold mt-10 mb-4">Previous Transactions</h2>
      <div className="max-h-60 overflow-y-auto bg-white p-4 rounded-xl shadow-md text-gray-800">
        {transactions.length === 0 ? (
          <p className="text-gray-500">No transactions recorded yet.</p>
        ) : (
          <ul className="divide-y divide-gray-300">
            {transactions.map((transaction, index) => (
              <li key={index} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    {transaction.category} - <span className={transaction.type === "income" ? "text-green-600" : "text-red-600"}>${transaction.amount}</span>
                  </p>
                  <p className="text-sm text-gray-500">{transaction.date}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded ${transaction.type === "income" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {transaction.type}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AddTransaction;
