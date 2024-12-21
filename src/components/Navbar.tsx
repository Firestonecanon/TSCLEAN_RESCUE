import React from 'react';
import { Menu, X, ShoppingCart, LogOut, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <ShoppingCart className="h-8 w-8" />
            <span className="font-bold text-xl">TS Clean</span>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="hover:text-blue-200">Accueil</Link>
            <Link to="/products" className="hover:text-blue-200">Produits</Link>
            <Link to="/locations" className="hover:text-blue-200">Nos Laveries</Link>
            <Link to="/contact" className="hover:text-blue-200">Contact</Link>
            {isAuthenticated && (
              <>
                <Link to="/admin/inventory" className="hover:text-blue-200">
                  Gestion Stock
                </Link>
                <Link to="/admin/site" className="hover:text-blue-200">
                  Gestion Site
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center hover:text-blue-200"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  Déconnexion
                </button>
              </>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 hover:bg-blue-700 rounded-md">Accueil</Link>
            <Link to="/products" className="block px-3 py-2 hover:bg-blue-700 rounded-md">Produits</Link>
            <Link to="/locations" className="block px-3 py-2 hover:bg-blue-700 rounded-md">Nos Laveries</Link>
            <Link to="/contact" className="block px-3 py-2 hover:bg-blue-700 rounded-md">Contact</Link>
            {isAuthenticated && (
              <>
                <Link to="/admin/inventory" className="block px-3 py-2 hover:bg-blue-700 rounded-md">
                  Gestion Stock
                </Link>
                <Link to="/admin/site" className="block px-3 py-2 hover:bg-blue-700 rounded-md">
                  Gestion Site
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 hover:bg-blue-700 rounded-md flex items-center"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Déconnexion
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}