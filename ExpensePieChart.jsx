import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTransactions } from "../context/TransactionContext";

const ExpensePieChart = () => {
  const { transactions } = useTransactions();
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  // Calculate expense categories from transactions
  const expenseData = transactions.reduce((acc, transaction) => {
    if (transaction.type === "expense") {
      const category = transaction.category;
      acc[category] = (acc[category] || 0) + Number(transaction.amount);
    }
    return acc;
  }, {});

  const expenseCategories = Object.entries(expenseData).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Expense Breakdown</h2>
      <div className="h-64">
        {expenseCategories.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseCategories}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {expenseCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No expenses recorded yet
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpensePieChart;