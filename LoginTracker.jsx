import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import backgroundImage from '../assets/img.jpg';

const LoginTracker = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your login logic here
    navigate('/dashboard');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white bg-opacity-90 backdrop-blur-md rounded-2xl shadow-2xl p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to manage your finances</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg hover:opacity-90 transition duration-300 font-semibold shadow-lg"
          >
            Sign In
          </button>

          <div className="text-center mt-4">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-600 hover:underline font-medium">
                Sign Up
              </Link>
            </p>
          </div>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <button className="flex items-center justify-center py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-300 shadow-sm">
              <FcGoogle className="h-6 w-6 mr-2" />
              <span className="text-gray-700 font-medium">Google</span>
            </button>
            <button className="flex items-center justify-center py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-300 shadow-sm">
              <FaGithub className="h-6 w-6 mr-2 text-gray-900" />
              <span className="text-gray-700 font-medium">GitHub</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginTracker;
