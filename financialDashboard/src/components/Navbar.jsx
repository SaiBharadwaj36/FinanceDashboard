import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/Login');
  };

  return (
    <nav className="bg-[#0E7490] shadow-none m-0 p-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-xl font-bold text-white tracking-wide hover:text-gray-200 transition-colors duration-200"
            >
              Finance Dashboard
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <Link
              to="/transactions"
              className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-[#0A5A70]/50"
            >
              Transactions
            </Link>
            <Link
              to="/budget"
              className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-[#0A5A70]/50"
            >
              Budget
            </Link>
            <Link
              to="/investments"
              className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-[#0A5A70]/50"
            >
              Investments
            </Link>
            <Link
              to="/net-worth"
              className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-[#0A5A70]/50"
            >
              Net Worth
            </Link>
            {!user && (
              <Link
                to="/login"
                className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-[#0A5A70]/50"
              >
                Login
              </Link>
            )}
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img
                  src={user.profilePic}
                  alt="Profile"
                  className="h-9 w-9 rounded-full object-cover border-2 border-white/50 shadow-sm"
                />
                <span className="text-white font-medium">{user.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-white bg-red-500/90 hover:bg-red-600 rounded-md font-medium transition-all duration-200 hover:shadow-md"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;