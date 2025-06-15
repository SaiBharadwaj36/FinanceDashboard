import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/img.jpg'; // Your existing image
import { useState, useEffect } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [imageLoaded, setImageLoaded] = useState(false);

  // Preload the background image
  useEffect(() => {
    const img = new Image();
    img.src = backgroundImage;
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(false); // Handle image load failure
  }, []);

  return (
    <div
      className={`min-h-screen w-full bg-cover bg-center relative transition-all duration-300 m-0 p-0 ${
        !imageLoaded ? 'bg-gray-200' : ''
      }`}
      style={{
        backgroundImage: imageLoaded ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed', // Fixed for a smoother effect
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/50 z-0" aria-hidden="true"></div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col w-full min-h-screen">
        {/* Hero Section */}
        <div className="flex flex-col justify-center items-center text-center min-h-[50vh] p-4 sm:p-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#FBBF24] drop-shadow-xl"
          >
            {user?.username ? `Welcome back, ${user.username}!` : 'Master Your Financial Future'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="text-lg sm:text-2xl mt-4 max-w-3xl text-white drop-shadow-md"
          >
            Take control of your finances, grow your wealth, and secure your future with smart investments.
          </motion.p>

          <motion.button
            onClick={() => navigate(user?.username ? '/dashboard' : '/login')}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 px-6 py-2 sm:px-8 sm:py-3 text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 rounded-xl shadow-2xl transition-all duration-300"
          >
            {user?.username ? 'Go to Dashboard' : 'Get Started'}
          </motion.button>
        </div>

        {/* Information Sections */}
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                title: 'Why Manage Our Finances?',
                color: '#D53F8C',
                bg: 'bg-gradient-to-br from-pink-200/80 to-pink-100/80',
                border: 'border-pink-300/50',
                points: [
                  'Plan for emergencies',
                  'Avoid unnecessary debt',
                  'Achieve financial goals',
                  'Reduce financial stress',
                ],
              },
              {
                title: 'Why Invest?',
                color: '#D97706',
                bg: 'bg-gradient-to-br from-yellow-200/80 to-yellow-100/80',
                border: 'border-yellow-300/50',
                points: [
                  'Beat inflation & grow wealth',
                  'Generate passive income',
                  'Secure financial future',
                  'Benefit from compounding',
                ],
              },
              {
                title: 'Where to Invest?',
                color: '#0E7490',
                bg: 'bg-gradient-to-br from-cyan-200/80 to-cyan-100/80',
                border: 'border-cyan-300/50',
                points: [
                  'Stock Market (Equities)',
                  'Mutual Funds',
                  'Real Estate',
                  'Fixed Deposits & Gold',
                ],
              },
              {
                title: 'Why Diversify Investments?',
                color: '#C2410C',
                bg: 'bg-gradient-to-br from-orange-200/80 to-orange-100/80',
                border: 'border-orange-300/50',
                points: [
                  'Minimize risks',
                  'Balance risk & reward',
                  'Reduce market volatility',
                  'Ensure steady growth',
                ],
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: index * 0.2, ease: 'easeOut' }}
                whileHover={{ scale: 1.05, boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)' }}
                className={`p-4 sm:p-6 rounded-xl shadow-lg backdrop-blur-sm border ${item.border} ${item.bg} flex flex-col justify-between h-64`}
              >
                <h2
                  className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4"
                  style={{ color: item.color }}
                >
                  {item.title}
                </h2>
                <ul className="list-disc list-inside text-gray-900 text-sm sm:text-base space-y-1 sm:space-y-2">
                  {item.points.map((point, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                    >
                      {point}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;