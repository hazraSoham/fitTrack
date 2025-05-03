// src/pages/LoginPage.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { login, register } from '../keycloak/keycloakService';
import { FaDumbbell } from 'react-icons/fa';

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = () => {
    login();
  };

  const handleSignup = () => {
    register();
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Side: Image */}
      <div className="hidden md:flex md:w-1/2 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=1470&q=80)' }}>
        <div className="flex items-center justify-center w-full h-full bg-black bg-opacity-50 text-white p-10">
          <h2 className="text-4xl font-bold text-center leading-snug">
            Sweat. Smile. Repeat. <br />
            Your fitness journey starts here.
          </h2>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex items-center justify-center w-full md:w-1/2 bg-white p-10">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-6">
            <FaDumbbell className="text-blue-600 w-12 h-12 mb-2" />
            <h1 className="text-3xl font-extrabold text-gray-800">FitTrack</h1>
            <p className="text-sm text-gray-500 text-center mt-2">
              Track workouts. Stay strong. Stay fit.
            </p>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Sign In
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">Don't have an account?</p>
            <button
              onClick={handleSignup}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg mt-2 transition duration-200"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
