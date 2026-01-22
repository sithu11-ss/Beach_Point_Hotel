import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import RoomDetail from './pages/RoomDetail';
import Booking from './pages/Booking';
import Restaurant from './pages/Restaurant';
import CheckIn from './pages/CheckIn';
import CheckOut from './pages/CheckOut';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes with layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetail />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/restaurant" element={<Restaurant />} />
          <Route path="/check-in" element={<CheckIn />} />
          <Route path="/check-out" element={<CheckOut />} />
        </Route>
        
        {/* Admin login (no layout) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Protected admin route (no layout) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
