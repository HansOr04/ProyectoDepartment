import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/authContext';
import Navbar from './components/Commons/Navbar';
import NewFlatPage from './pages/NewFlatPage';
import HomePage from './pages/HomePage';
import FavouritesPage from './pages/FavouritesPage';
import MyFlatsPage from './pages/MyFlatsPage';
import ProfilePage from './pages/ProfilePage';
import AllUsersPage from './pages/AllUsersPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import { Outlet } from 'react-router-dom';

// Componente para el layout con Navbar
const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/new-flat" element={<NewFlatPage />} />
            <Route path="/favorite-flats" element={<FavouritesPage />} />
            <Route path="/my-flats" element={<MyFlatsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/all-users" element={<AllUsersPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;