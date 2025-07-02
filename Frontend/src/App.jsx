import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login/Login';
import Signup from './Login/Signup';
import DashboardLayout from './Pages/DashboardLayout'; 
import Home from './Pages/Home';
import AddTransaction from './Pages/AddTransaction.jsx';
import History from './Pages/History.jsx';

import Profile from './Pages/Profile.jsx';
import ResetPassword from './Components/ResetPassword.jsx';

function App() {
  const isLoggedIn = localStorage.getItem('auth') === 'true';
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard/*" element={isLoggedIn ? <DashboardLayout /> : <Navigate to="/" />} >
          <Route path="home" element={<Home />} />
          <Route path="AddTransaction" element={<AddTransaction />} />
          <Route path="history" element={<History />} />
          <Route path="profile" element={<Profile />} />
          <Route path="resetpassword" element={<ResetPassword />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
    // <ResetPassword />
  );
}

export default App;
