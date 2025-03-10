import React from 'react';
import Navbar from './Navbar';
import clsx from 'clsx';

type LayoutProps = {
  children: React.ReactNode;
  darkMode: boolean;
  toggleDarkMode: () => void;
  currentPage: string;
  isLoggedIn: boolean;
  onLogout: () => void;
};

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  darkMode, 
  toggleDarkMode, 
  currentPage,
  isLoggedIn,
  onLogout
}) => {
  return (
    <div className={clsx(
      'min-h-screen transition-colors duration-200',
      darkMode ? 'bg-[#0F172A] text-white' : 'bg-[#F1F5F9] text-gray-900'
    )}>
      <Navbar 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode} 
        currentPage={currentPage}
        isLoggedIn={isLoggedIn}
        onLogout={onLogout}
      />
      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;