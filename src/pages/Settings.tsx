import React, { useState } from 'react';
import { Save, Bell, Shield, User, Globe, Database, Palette } from 'lucide-react';
import clsx from 'clsx';
import { translate, getCurrentLanguage } from '../services/translationService';

// Import settings components
import UserProfile from '../components/Settings/UserProfile';
import CurrencyLocaleSettings from '../components/Settings/CurrencyLocaleSettings';
import NotificationPreferences from '../components/Settings/NotificationPreferences';
import DataManagement from '../components/Settings/DataManagement';
import SecuritySettings from '../components/Settings/SecuritySettings';
import ThemeCustomization from '../components/Settings/ThemeCustomization';

type SettingsProps = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

const Settings: React.FC<SettingsProps> = ({ darkMode, toggleDarkMode }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'currency' | 'notifications' | 'security' | 'data' | 'theme'>('profile');
  const currentLanguage = getCurrentLanguage();
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{translate('app.settings', currentLanguage)}</h1>
      
      {/* Settings Navigation */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('profile')}
          className={clsx(
            'px-4 py-2 rounded-md text-sm font-medium transition-colors',
            activeTab === 'profile'
              ? 'bg-[#1E3A8A] text-white'
              : darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          )}
        >
          <User className="h-4 w-4 inline mr-2" />
          {translate('settings.profile', currentLanguage)}
        </button>
        
        <button
          onClick={() => setActiveTab('theme')}
          className={clsx(
            'px-4 py-2 rounded-md text-sm font-medium transition-colors',
            activeTab === 'theme'
              ? 'bg-[#1E3A8A] text-white'
              : darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          )}
        >
          <Palette className="h-4 w-4 inline mr-2" />
          {translate('settings.theme', currentLanguage)}
        </button>
        
        <button
          onClick={() => setActiveTab('currency')}
          className={clsx(
            'px-4 py-2 rounded-md text-sm font-medium transition-colors',
            activeTab === 'currency'
              ? 'bg-[#1E3A8A] text-white'
              : darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          )}
        >
          <Globe className="h-4 w-4 inline mr-2" />
          {translate('settings.currency', currentLanguage)}
        </button>
        
        <button
          onClick={() => setActiveTab('notifications')}
          className={clsx(
            'px-4 py-2 rounded-md text-sm font-medium transition-colors',
            activeTab === 'notifications'
              ? 'bg-[#1E3A8A] text-white'
              : darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          )}
        >
          <Bell className="h-4 w-4 inline mr-2" />
          {translate('settings.notifications', currentLanguage)}
        </button>
        
        <button
          onClick={() => setActiveTab('security')}
          className={clsx(
            'px-4 py-2 rounded-md text-sm font-medium transition-colors',
            activeTab === 'security'
              ? 'bg-[#1E3A8A] text-white'
              : darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          )}
        >
          <Shield className="h-4 w-4 inline mr-2" />
          {translate('settings.security', currentLanguage)}
        </button>
        
        <button
          onClick={() => setActiveTab('data')}
          className={clsx(
            'px-4 py-2 rounded-md text-sm font-medium transition-colors',
            activeTab === 'data'
              ? 'bg-[#1E3A8A] text-white'
              : darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          )}
        >
          <Database className="h-4 w-4 inline mr-2" />
          {translate('settings.data', currentLanguage)}
        </button>
      </div>
      
      {/* Settings Content */}
      <div className={clsx(
        'p-6 rounded-lg shadow-md',
        darkMode ? 'bg-gray-800' : 'bg-white'
      )}>
        {activeTab === 'profile' && <UserProfile darkMode={darkMode} />}
        
        {activeTab === 'theme' && <ThemeCustomization darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
        
        {activeTab === 'currency' && <CurrencyLocaleSettings darkMode={darkMode} />}
        
        {activeTab === 'notifications' && <NotificationPreferences darkMode={darkMode} />}
        
        {activeTab === 'security' && <SecuritySettings darkMode={darkMode} />}
        
        {activeTab === 'data' && <DataManagement darkMode={darkMode} />}
        
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button className={clsx(
            'px-4 py-2 rounded-md text-white bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-sm font-medium',
            'flex items-center gap-2'
          )}>
            <Save className="h-4 w-4" />
            <span>{translate('settings.save', currentLanguage)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;