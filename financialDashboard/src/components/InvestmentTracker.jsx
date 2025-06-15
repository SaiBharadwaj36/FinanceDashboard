import { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { ArrowUpIcon, ArrowDownIcon, PlusIcon } from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { InvestmentContext } from '../context/InvestmentContext';
import { motion } from 'framer-motion';

const InvestmentTracker = () => {
  const { investments, setInvestments } = useContext(InvestmentContext);
  const [symbolInput, setSymbolInput] = useState('');
  const [sharesInput, setSharesInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [loadingSymbols, setLoadingSymbols] = useState(new Set());

  const API_KEY = 'cupjts1r01qk8dnkfg30cupjts1r01qk8dnkfg3g'; // Replace with your Finnhub API key
  const cache = useRef({});

  // Fetch stock data from Finnhub
  const fetchStockData = useCallback(async (symbol, shares) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      setLoadingSymbols(prev => new Set([...prev, symbol]));

      if (cache.current[symbol] && Date.now() - cache.current[symbol].timestamp < 60000) {
        const cachedData = cache.current[symbol];
        setInvestments(prev => updateInvestment(prev, symbol, shares, cachedData));
        return;
      }

      const response = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`,
        { signal: controller.signal }
      );
      const data = await response.json();

      clearTimeout(timeoutId);

      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.c) {
        throw new Error('Invalid stock symbol or no data available');
      }

      const stockData = {
        currentPrice: data.c,
        change: data.d,
        changePercent: data.dp,
        timestamp: Date.now()
      };

      cache.current[symbol] = stockData;
      setInvestments(prev => updateInvestment(prev, symbol, shares, stockData));
    } catch (err) {
      setError(`Failed to fetch ${symbol}: ${err.message}`);
    } finally {
      setLoadingSymbols(prev => {
        const newSet = new Set(prev);
        newSet.delete(symbol);
        return newSet;
      });
      clearTimeout(timeoutId);
    }
  }, [setInvestments]);

  // Update investment data in the state
  const updateInvestment = (prevInvestments, symbol, shares, data) => {
    const index = prevInvestments.findIndex(inv => inv.symbol === symbol);
    const investmentUpdate = {
      symbol,
      shares: Number(shares),
      ...data
    };

    if (index > -1) {
      const mergedInvestment = {
        ...prevInvestments[index],
        ...investmentUpdate
      };
      const newInvestments = [...prevInvestments];
      newInvestments[index] = mergedInvestment;
      return newInvestments;
    }
    return [...prevInvestments, investmentUpdate];
  };

  // Add a new stock to the portfolio
  const addStock = async () => {
    const symbol = symbolInput.trim().toUpperCase();
    const shares = parseFloat(sharesInput);

    if (!symbol || !shares || isNaN(shares)) {
      setError('Please enter valid symbol and shares');
      return;
    }

    if (investments.some(inv => inv.symbol === symbol)) {
      setError('Stock already in portfolio');
      return;
    }

    setInvestments(prev => [
      ...prev,
      {
        symbol,
        shares,
        currentPrice: 0,
        change: 0,
        changePercent: 0,
        isLoading: true,
        purchasedDate: new Date().toISOString()
      }
    ]);
    await fetchStockData(symbol, shares);

    setSymbolInput('');
    setSharesInput('');
    setError(null);
  };

  // Remove a stock from the portfolio
  const removeStock = (symbol) => {
    setInvestments(prev => prev.filter(inv => inv.symbol !== symbol));
  };

  // Search for stocks using Finnhub's symbol search
  const searchStocks = async query => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `https://finnhub.io/api/v1/search?q=${query}&token=${API_KEY}`
      );
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setSearchResults(data.result.map(result => ({
        symbol: result.symbol,
        name: result.description
      })));
    } catch (err) {
      setError(`Search error: ${err.message}`);
    }
  };

  // Refresh stock data periodically
  useEffect(() => {
    if (investments.length === 0) return;

    const interval = setInterval(() => {
      investments.forEach(inv => {
        cache.current[inv.symbol] = null; // Invalidate cache
        fetchStockData(inv.symbol, inv.shares);
      });
    }, 60000); // Refresh every 1 minute

    return () => clearInterval(interval);
  }, [investments, fetchStockData]);

  // Calculate total portfolio value
  const totalValue = investments.reduce(
    (sum, inv) => sum + (inv.shares * (inv.currentPrice || 0)),
    0
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-teal-200 via-blue-200 to-indigo-200 m-0 p-0 flex flex-col">
      {/* Main Content Container */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="bg-white p-8 rounded-2xl shadow-xl border border-teal-300"
        >
          {/* Header */}
          <h2 className="text-4xl font-extrabold mb-8 text-teal-900 tracking-tight">
            Investment Portfolio
          </h2>

          {/* Add Stock Section */}
          <div className="bg-gradient-to-r from-teal-200 to-blue-200 p-6 rounded-xl shadow-md mb-8">
            <h3 className="text-lg font-semibold text-teal-900 mb-4">Add a Stock</h3>
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by Company Name"
                  className="w-full p-3 rounded-lg border border-teal-400 text-teal-900 placeholder-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    searchStocks(e.target.value);
                  }}
                />
                <MagnifyingGlassIcon className="h-5 w-5 absolute right-3 top-3 text-teal-500" />

                {searchResults.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border border-teal-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                    {searchResults.map((result, index) => (
                      <div
                        key={index}
                        className="p-3 hover:bg-teal-100 cursor-pointer text-teal-900"
                        onClick={() => {
                          setSymbolInput(result.symbol);
                          setSearchQuery('');
                          setSearchResults([]);
                        }}
                      >
                        {result.name} ({result.symbol})
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <input
                type="text"
                placeholder="Stock Symbol (e.g., AAPL)"
                className="w-full p-3 rounded-lg border border-teal-400 text-teal-900 placeholder-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all duration-200"
                value={symbolInput}
                onChange={(e) => setSymbolInput(e.target.value.toUpperCase())}
              />

              <input
                type="number"
                placeholder="Number of Shares"
                className="w-full p-3 rounded-lg border border-teal-400 text-teal-900 placeholder-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all duration-200"
                value={sharesInput}
                onChange={(e) => setSharesInput(e.target.value)}
                min="0"
                step="any"
              />

              <button
                onClick={addStock}
                className="bg-teal-800 text-white px-5 py-3 rounded-lg font-medium hover:bg-teal-900 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Stock
              </button>
            </div>
            {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}
          </div>

          {/* Portfolio Summary */}
          <div className="bg-gradient-to-r from-teal-200 to-blue-200 p-6 rounded-xl shadow-md mb-8">
            <p className="text-teal-800 font-medium">Total Portfolio Value</p>
            <p className="text-3xl font-bold text-teal-900">
              ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          {/* Investments Table */}
          <div className="overflow-x-auto rounded-xl shadow-md">
            <table className="w-full bg-white">
              <thead className="bg-teal-200">
                <tr>
                  <th className="px-6 py-4 text-left text-teal-900 font-semibold">Symbol</th>
                  <th className="px-6 py-4 text-left text-teal-900 font-semibold">Shares</th>
                  <th className="px-6 py-4 text-left text-teal-900 font-semibold">Price</th>
                  <th className="px-6 py-4 text-left text-teal-900 font-semibold">Value</th>
                  <th className="px-6 py-4 text-left text-teal-900 font-semibold">Change</th>
                  <th className="px-6 py-4 text-left text-teal-900 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {investments.map((investment, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border-t border-teal-200 hover:bg-teal-100"
                  >
                    <td className="px-6 py-4 font-medium text-teal-900">
                      {investment.symbol}
                      {loadingSymbols.has(investment.symbol) && (
                        <span className="ml-2 text-teal-500 text-sm">Loading...</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-teal-800">{investment.shares.toLocaleString()}</td>
                    <td className="px-6 py-4 text-teal-800">
                      ${investment.currentPrice?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 text-teal-800">
                      ${(investment.shares * (investment.currentPrice || 0)).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      {investment.changePercent ? (
                        <div className="flex items-center">
                          {investment.change > 0 ? (
                            <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                          ) : (
                            <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                          )}
                          <span className={investment.change > 0 ? 'text-green-500' : 'text-red-500'}>
                            {investment.changePercent.toFixed(2)}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-teal-500">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => removeStock(investment.symbol)}
                        className="text-red-500 hover:text-red-700 font-medium transition-colors duration-200"
                      >
                        Remove
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InvestmentTracker;