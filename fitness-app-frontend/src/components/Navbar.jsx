import { useSelector } from 'react-redux';
import { logout } from '../keycloak/keycloakService';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-gray-900 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo or App Name */}
        <Link to="/" className="text-white text-2xl font-extrabold tracking-wide hover:text-gray-300 transition-colors">
          FitnessApp
        </Link>

        {/* Right side - Login/Logout */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span className="text-gray-300 text-sm md:text-base">
                Welcome, <span className="font-semibold">{user?.firstName || user?.username}</span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white text-sm md:text-base font-medium py-2 px-4 rounded-lg transition-all duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm md:text-base font-medium py-2 px-4 rounded-lg transition-all duration-200"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
