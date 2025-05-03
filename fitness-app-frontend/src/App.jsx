import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { initKeycloak, getUserInfo } from './keycloak/keycloakService';
import { setAuthenticated, setUser, setLoading, setError } from './store/authSlice';

import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import PrivateRoute from './components/PrivateRoute';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Extracted inner app layout with conditional Navbar
const AppLayout = () => {
  const { pathname } = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const shouldHideNavbar = pathname === '/login' || (pathname === '/' && !isAuthenticated);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {!shouldHideNavbar && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/workouts" element={<div className="container mx-auto p-4">Workouts Page</div>} />
            <Route path="/nutrition" element={<div className="container mx-auto p-4">Nutrition Page</div>} />
            <Route path="/progress" element={<div className="container mx-auto p-4">Progress Page</div>} />
            <Route path="/profile" element={<div className="container mx-auto p-4">Profile Page</div>} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
      />

      <footer className="bg-gray-800 text-white p-4">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Fitness App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(true));

    initKeycloak(
      () => {
        dispatch(setAuthenticated(true));
        dispatch(setUser(getUserInfo()));
        dispatch(setLoading(false));
      },
      (error) => {
        dispatch(setError(error));
        dispatch(setLoading(false));
      }
    );

    window.addEventListener('keycloak-token-expired', () => {
      dispatch(setAuthenticated(false));
    });

    return () => {
      window.removeEventListener('keycloak-token-expired', () => {});
    };
  }, [dispatch]);

  return (
    <Router>
      <AppLayout />
    </Router>
  );
};

export default App;
