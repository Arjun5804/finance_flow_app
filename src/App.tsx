import React, { useState, useEffect } from 'react';
import Layout from './components/Layout/Layout';
import AuthLayout from './components/Layout/AuthLayout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgeting from './pages/Budgeting';
import Reports from './pages/Reports';
import Goals from './pages/Goals';
import Settings from './pages/Settings';
import Auth from './pages/Auth';
import { isAuthenticated, logOut } from './services/authService';
import { getCurrentLanguage, setLanguage } from './services/translationService';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Check authentication status and initialize language on load
  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
    
    // Initialize language from settings
    const currentLanguage = getCurrentLanguage();
    setLanguage(currentLanguage);
    
    // Apply language to document
    document.documentElement.lang = currentLanguage;
  }, []);

  // Function to toggle dark mode
  const toggleDarkMode = () => setDarkMode(!darkMode);
  
  // Handle successful authentication
  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };
  
  // Handle logout
  const handleLogout = () => {
    logOut();
    setIsLoggedIn(false);
    setCurrentPage('dashboard');
  };

  // Render the appropriate page based on currentPage state and authentication
  const renderPage = () => {
    // If not logged in, show auth page
    if (!isLoggedIn) {
      return <Auth darkMode={darkMode} onAuthSuccess={handleAuthSuccess} onToggleDarkMode={toggleDarkMode} />;
    }
    
    // Otherwise show the requested page
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard darkMode={darkMode} />;
      case 'auth':
        return <Auth darkMode={darkMode} onAuthSuccess={handleAuthSuccess} onToggleDarkMode={toggleDarkMode} />;
      case 'transactions':
        return <Transactions darkMode={darkMode} />;
      case 'budgeting':
        return <Budgeting darkMode={darkMode} />;
      case 'reports':
        return <Reports darkMode={darkMode} />;
      case 'goals':
        return <Goals darkMode={darkMode} />;
      case 'settings':
        return <Settings darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
      default:
        return <Dashboard darkMode={darkMode} />;
    }
  };

  // Override the default behavior of anchor tags to handle navigation
  React.useEffect(() => {
    const handleNavigation = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.getAttribute('href')?.startsWith('/')) {
        e.preventDefault();
        const path = anchor.getAttribute('href')?.substring(1) || '';
        
        // Handle logout special case
        if (path === 'logout') {
          handleLogout();
        } else {
          setCurrentPage(path || 'dashboard');
        }
      }
    };

    document.addEventListener('click', handleNavigation);
    return () => document.removeEventListener('click', handleNavigation);
  }, []);

  // Use AuthLayout for non-authenticated users (login/signup pages)
  // Use regular Layout with Navbar for authenticated users
  return (
    isLoggedIn ? (
      <Layout 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode} 
        currentPage={currentPage}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      >
        {renderPage()}
      </Layout>
    ) : (
      <AuthLayout darkMode={darkMode}>
        {renderPage()}
      </AuthLayout>
    )
  );
}

export default App;