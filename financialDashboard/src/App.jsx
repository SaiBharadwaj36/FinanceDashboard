import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Transactions from './pages/Transactions';
import Budget from './pages/Budget';
import Investments from './pages/Investments';
import NetWorth from './pages/NetWorth';
import Login from './pages/Login';
import { TransactionProvider } from "./context/TransactionContext";
import { InvestmentProvider } from './context/InvestmentContext';
import Signup from './components/Signup';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="m-0 p-0 pt-1 overflow-x-hidden">
      <TransactionProvider>
        <InvestmentProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/investments" element={<Investments />} />
          <Route path="/net-worth" element={<NetWorth />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
        </InvestmentProvider>
      </TransactionProvider>
      </div>
    </div>
  );
};

export default App;