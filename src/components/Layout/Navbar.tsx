import React, { useState } from 'react';
import { PiggyBank, Menu, X, Moon, Sun } from 'lucide-react';
import clsx from 'clsx';
import { translate, getCurrentLanguage } from '../../services/translationService';

type NavbarProps = {
  darkMode: boolean;
  toggleDarkMode: () => void;
  currentPage: string;
  isLoggedIn: boolean;
  onLogout: () => void;
};

const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleDarkMode, currentPage, isLoggedIn, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentLanguage = getCurrentLanguage();

  const navLinks = [
    { name: 'Dashboard', href: '/', translationKey: 'app.dashboard' },
    { name: 'Transactions', href: '/transactions', translationKey: 'app.transactions' },
    { name: 'Budgeting', href: '/budgeting', translationKey: 'app.budgeting' },
    { name: 'Reports', href: '/reports', translationKey: 'app.reports' },
    { name: 'Goals', href: '/goals', translationKey: 'app.goals' },
    { name: 'Settings', href: '/settings', translationKey: 'app.settings' },
  ];

  return (
    <nav className={clsx(
      'fixed top-0 left-0 right-0 z-50 shadow-sm',
      darkMode ? 'bg-[#0F172A]' : 'bg-white'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <PiggyBank className="h-8 w-8 text-[#1E3A8A]" />
            <span className={clsx(
              'text-xl font-bold',
              darkMode ? 'text-white' : 'text-gray-900'
            )}>{translate('app.title', currentLanguage)}</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={clsx(
                  'text-sm font-medium transition-colors duration-200',
                  currentPage === link.name.toLowerCase() 
                    ? 'text-[#1E3A8A] border-b-2 border-[#1E3A8A]' 
                    : darkMode 
                      ? 'text-gray-300 hover:text-white' 
                      : 'text-gray-700 hover:text-gray-900'
                )}
              >
                {translate(link.translationKey, currentLanguage)}
              </a>
            ))}
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {isLoggedIn && (
              <button
                onClick={onLogout}
                className={clsx(
                  'text-sm font-medium transition-colors duration-200',
                  darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                )}
              >
                {translate('app.logout', currentLanguage)}
              </button>
            )}
            <button
              onClick={toggleDarkMode}
              className={clsx(
                'p-2 rounded-lg transition-colors duration-200',
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              )}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="h-5 w-5 text-white" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className={clsx('h-6 w-6', darkMode ? 'text-white' : 'text-gray-900')} />
              ) : (
                <Menu className={clsx('h-6 w-6', darkMode ? 'text-white' : 'text-gray-900')} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={clsx(
                  'block py-2 px-3 rounded-md text-base font-medium',
                  currentPage === link.name.toLowerCase()
                    ? 'bg-[#1E3A8A]/10 text-[#1E3A8A]'
                    : darkMode
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {translate(link.translationKey, currentLanguage)}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;