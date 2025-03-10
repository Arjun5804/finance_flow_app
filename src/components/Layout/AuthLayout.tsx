import React from 'react';
import clsx from 'clsx';

type AuthLayoutProps = {
  children: React.ReactNode;
  darkMode: boolean;
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  darkMode
}) => {
  // Apply dark mode class to the html element
  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={clsx(
      'min-h-screen transition-colors duration-200',
      darkMode ? 'bg-[#0F172A] text-white' : 'bg-[#F1F5F9] text-gray-900'
    )}>
      <main className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;