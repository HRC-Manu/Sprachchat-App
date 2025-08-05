import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header className="bg-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-3xl">🚛</span>
            <h1 className="text-2xl font-bold text-truck-blue">LKW-Chat</h1>
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-lg transition-colors ${
                location.pathname === '/' 
                  ? 'bg-truck-blue text-white' 
                  : 'text-gray-600 hover:text-truck-blue hover:bg-blue-50'
              }`}
            >
              Startseite
            </Link>
            <Link 
              to="/generate" 
              className={`px-3 py-2 rounded-lg transition-colors ${
                location.pathname === '/generate' 
                  ? 'bg-truck-blue text-white' 
                  : 'text-gray-600 hover:text-truck-blue hover:bg-blue-50'
              }`}
            >
              QR-Code erstellen
            </Link>
          </nav>
          
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-truck-blue">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 