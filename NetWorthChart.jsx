import { useContext, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useTransactions } from '../context/TransactionContext';
import { InvestmentContext } from '../context/InvestmentContext';

const NetWorthChart = () => {
  const { transactions } = useTransactions();
  const { investments, setInvestments } = useContext(InvestmentContext);

  useEffect(() => {
    investments.forEach(inv => {
      if (!inv.purchasedDate || isNaN(new Date(inv.purchasedDate).getTime())) {
        console.error('Invalid purchasedDate - adding default', inv);
        setInvestments(prev => 
          prev.map(item => 
            item.symbol === inv.symbol 
              ? { ...item, purchasedDate: new Date().toISOString() }
              : item
          )
        );
      }
    });
  }, [investments, setInvestments]);

  const netWorthData = useMemo(() => {
    const monthlyTransactions = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      if (isNaN(date.getTime())) {
        console.warn('Invalid transaction date:', transaction.date);
        return acc;
      }
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!acc[monthYear]) {
        acc[monthYear] = { income: 0, expense: 0 };
      }
      if (transaction.type === 'income') {
        acc[monthYear].income += Number(transaction.amount);
      } else {
        acc[monthYear].expense += Number(transaction.amount);
      }
      return acc;
    }, {});

    const transactionMonths = Object.keys(monthlyTransactions);
    const investmentMonths = investments.map(inv => {
      const rawDate = inv.purchasedDate || new Date().toISOString();
      const date = new Date(rawDate);
      if (isNaN(date.getTime())) {
        console.warn('Fallback date used for:', inv.symbol);
        date = new Date();
      }
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }).filter(Boolean);
    const allMonths = Array.from(new Set([...transactionMonths, ...investmentMonths]))
      .sort((a, b) => a.localeCompare(b));

    let cumulativeSavings = 0;
    const data = allMonths.map(month => {
      const monthData = monthlyTransactions[month] || { income: 0, expense: 0 };
      cumulativeSavings += (monthData.income - monthData.expense);

      const investmentValue = investments.reduce((sum, inv) => {
        const date = new Date(inv.purchasedDate);
        if (isNaN(date.getTime())) {
          console.warn('Invalid purchasedDate for investment:', inv.symbol, inv.purchasedDate);
          return sum;
        }
        const invMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (invMonth <= month) {
          sum += inv.shares * (inv.currentPrice || 0);
        }
        return sum;
      }, 0);

      return {
        month: new Date(month + '-01').toLocaleDateString('en-US', { 
          month: 'short', 
          year: 'numeric' 
        }),
        netWorth: cumulativeSavings + investmentValue
      };
    });

    return data;
  }, [transactions, investments]);

  return (
    <div className="bg-gradient-to-br from-purple-100 to-blue-50 p-8 rounded-2xl shadow-md border border-gray-200 w-full h-screen flex flex-col items-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">📈 Net Worth Over Time</h2>
      <div className="w-full h-full p-4 bg-white shadow-lg rounded-xl flex justify-center items-center">
        {netWorthData.length === 0 ? (
          <p className="text-gray-500 text-center">No financial data available yet. Add transactions or investments to see your net worth.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={netWorthData} margin={{ top: 20, right: 20, left: 10, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: '#555' }}
                angle={-45}
                textAnchor="end"
              />
              <YAxis
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                width={100}
              />
              <Tooltip
                formatter={(value) => [`$${Number(value).toLocaleString(undefined, { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}`, 'Net Worth']}
                labelStyle={{ fontWeight: 'bold' }}
                contentStyle={{
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              />
              <Line
                type="monotone"
                dataKey="netWorth"
                stroke="#6D28D9"
                strokeWidth={3}
                dot={{ r: 5, fill: '#6D28D9' }}
                activeDot={{ 
                  r: 8,
                  stroke: '#fff',
                  strokeWidth: 2,
                  fill: '#4C1D95'
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default NetWorthChart;
