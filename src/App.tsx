import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { InventoryProvider } from './contexts/InventoryContext';
import { NavigationProvider } from './contexts/NavigationContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import Locations from './pages/Locations';
import Contact from './pages/Contact';
import Inventory from './pages/admin/Inventory';
import SiteManager from './pages/admin/SiteManager';
import LoginForm from './components/auth/LoginForm';

function App() {
  return (
    <AuthProvider>
      <InventoryProvider>
        <NavigationProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/locations" element={<Locations />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin/login" element={<LoginForm />} />
                <Route
                  path="/admin/inventory"
                  element={
                    <ProtectedRoute>
                      <Inventory />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/site"
                  element={
                    <ProtectedRoute>
                      <SiteManager />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </Router>
        </NavigationProvider>
      </InventoryProvider>
    </AuthProvider>
  );
}

export default App;