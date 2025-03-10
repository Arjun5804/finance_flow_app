import React from 'react';
import clsx from 'clsx';
import { Moon, Sun } from 'lucide-react';

type ThemeCustomizationProps = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

const ThemeCustomization: React.FC<ThemeCustomizationProps> = ({ darkMode, toggleDarkMode }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Theme Customization</h2>
      
      <div className="space-y-6">
        {/* Dark Mode Toggle */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{darkMode ? "Light Mode" : "Dark Mode"}</h3>
              <p className="text-sm text-gray-500">Switch between light and dark themes</p>
            </div>
            <button
              onClick={toggleDarkMode}
              className={clsx(
                'p-2 rounded-lg transition-colors',
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              )}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-[#FACC15]" />
              ) : (
                <Moon className="h-5 w-5 text-[#1E3A8A]" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomization;