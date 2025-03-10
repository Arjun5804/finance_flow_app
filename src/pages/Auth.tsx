import React, { useState, useEffect } from 'react';
import { signUp, logIn, isAuthenticated } from '../services/authService';
import clsx from 'clsx';
import { Mail, Lock, LogIn, PiggyBank, Moon, Sun, User, Globe } from 'lucide-react';
import { getCurrentLanguage, setLanguage, AvailableLanguage } from '../services/translationService';
import { translate } from '../services/translationService';

type AuthProps = {
  darkMode: boolean;
  onAuthSuccess: () => void;
  onToggleDarkMode: () => void;
};

const Auth: React.FC<AuthProps> = ({ darkMode, onAuthSuccess, onToggleDarkMode }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<AvailableLanguage>(getCurrentLanguage());

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      onAuthSuccess();
    }
  }, [onAuthSuccess]);

  const validateForm = () => {
    setError('');
    
    // Check for empty fields
    if (!email || !password) {
      setError('Email and password are required');
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // Password length validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    // Confirm password for signup
    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    if (isLogin) {
      // Handle login
      const success = logIn(email, password);
      setLoading(false);
      
      if (success) {
        // Clear form fields after successful login
        setEmail('');
        setPassword('');
        onAuthSuccess();
      } else {
        setError('Invalid email or password');
      }
    } else {
      // Handle signup
      const success = signUp(email, password, name);
      setLoading(false);
      
      if (success) {
        // Clear form fields after successful signup
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setName('');
        onAuthSuccess();
      } else {
        setError('Email already in use');
      }
    }
  };

  // Toggle language between English and Tamil
  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en-US' ? 'ta-IN' : 'en-US';
    setCurrentLanguage(newLanguage);
    setLanguage(newLanguage);
  };

  return (
    <div className={clsx(
      "flex items-center justify-center min-h-screen bg-gradient-to-br",
      darkMode 
        ? "from-gray-900 via-[#0F172A] to-gray-800" 
        : "from-blue-50 via-white to-blue-100"
    )}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={clsx(
          "absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20",
          darkMode ? "bg-blue-600" : "bg-blue-300"
        )}></div>
        <div className={clsx(
          "absolute -bottom-24 -left-24 w-96 h-96 rounded-full opacity-20",
          darkMode ? "bg-indigo-600" : "bg-indigo-300"
        )}></div>
        <div className="absolute inset-0 opacity-30">
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i}
              className={clsx(
                "absolute rounded-full",
                darkMode ? "bg-blue-500" : "bg-blue-300"
              )}
              style={{
                width: `${Math.random() * 8 + 2}px`,
                height: `${Math.random() * 8 + 2}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5,
              }}
            ></div>
          ))}
        </div>
      </div>
      
      <div className={clsx(
        'w-full max-w-md p-8 space-y-6 rounded-lg shadow-lg backdrop-blur-sm',
        darkMode ? 'bg-gray-800/90' : 'bg-white/90'
      )}>
        {/* Logo */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <PiggyBank className="h-10 w-10 text-[#1E3A8A]" />
            <span className={clsx(
              'text-2xl font-bold',
              darkMode ? 'text-white' : 'text-gray-900'
            )}>{translate('app.title', currentLanguage)}</span>
          </div>
          <div className="w-full border-b border-gray-200 dark:border-gray-700 my-2"></div>
          <h1 className={clsx(
            "text-2xl font-bold",
            darkMode ? 'text-white' : 'text-gray-900'
          )}>
            {translate(isLogin ? 'auth.login.title' : 'auth.signup.title', currentLanguage)}
          </h1>
          <p className={clsx(
            'mt-1',
            darkMode ? 'text-gray-300' : 'text-gray-600'
          )}>
            {translate(isLogin 
              ? 'auth.login.subtitle' 
              : 'auth.signup.subtitle', currentLanguage)}
          </p>
        </div>
        
        {/* Theme and Language toggles */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={toggleLanguage}
            className={clsx(
              'p-2 rounded-full transition-colors duration-200',
              darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
            )}
            aria-label={currentLanguage === 'en-US' ? 'Switch to Tamil' : 'Switch to English'}
          >
            <Globe className="h-5 w-5" />
          </button>
          <button
            onClick={onToggleDarkMode}
            className={clsx(
              'p-2 rounded-full transition-colors duration-200',
              darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
            )}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun className="h-5 w-5 text-yellow-300" /> : <Moon className="h-5 w-5 text-gray-700" />}
          </button>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="name">
                {translate('auth.signup.fullName', currentLanguage)}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  className={clsx(
                    'block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:ring-[#1E3A8A] focus:border-[#1E3A8A]',
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  )}
                  placeholder="John Doe"
                />
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              {translate('auth.login.email', currentLanguage)}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={clsx(
                  'block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:ring-[#1E3A8A] focus:border-[#1E3A8A]',
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                )}
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              {translate('auth.login.password', currentLanguage)}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={clsx(
                  'block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:ring-[#1E3A8A] focus:border-[#1E3A8A]',
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                )}
                placeholder="••••••••"
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="confirmPassword">
                {translate('auth.signup.confirmPassword', currentLanguage)}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={clsx(
                    'block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:ring-[#1E3A8A] focus:border-[#1E3A8A]',
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  )}
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={clsx(
                'w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E3A8A]',
                loading && 'opacity-70 cursor-not-allowed'
              )}
            >
              {loading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  {translate(isLogin ? 'auth.login.button' : 'auth.signup.button', currentLanguage)}
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              // Reset form fields when switching between login and signup
              setEmail('');
              setPassword('');
              setConfirmPassword('');
              setName('');
              setError('');
            }}
            className={clsx(
              'text-sm font-medium',
              darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
            )}
          >
            {translate(isLogin 
              ? 'auth.login.switchToSignup' 
              : 'auth.login.switchToLogin', currentLanguage)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;