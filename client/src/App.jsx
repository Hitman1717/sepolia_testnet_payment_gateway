import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SideNav from './components/SideNav.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Marketplace from './pages/Marketplace.jsx';
import Sell from './pages/Sell.jsx';
import MyItems from './pages/MyItems.jsx';
import Help from './pages/Help.jsx';
import Trace from './pages/Trace.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <SideNav />
        <div>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/sell" element={<Sell />} />
            <Route path="/my-items" element={<MyItems />} />
            <Route path="/trace" element={<Trace />} />
            <Route path="/help" element={<Help />} />
            <Route path="*" element={<Navigate to="/marketplace" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}