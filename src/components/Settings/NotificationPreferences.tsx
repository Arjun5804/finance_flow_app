import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Bell, AlertTriangle, PieChart, CreditCard } from 'lucide-react';

type NotificationPreferencesProps = {
  darkMode: boolean;
};

type NotificationSetting = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
};

const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({ darkMode }) => {
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: 'bill-reminders',
      title: 'Bill Reminders',
      description: 'Get notified before bills are due',
      icon: <CreditCard className="h-4 w-4" />,
      enabled: true
    },
    {
      id: 'budget-alerts',
      title: 'Budget Alerts',
      description: 'Get notified when you\'re close to budget limits',
      icon: <AlertTriangle className="h-4 w-4" />,
      enabled: true
    },
    {
      id: 'goal-progress',
      title: 'Goal Progress',
      description: 'Get updates on your financial goals',
      icon: <PieChart className="h-4 w-4" />,
      enabled: false
    },
    {
      id: 'unusual-activity',
      title: 'Unusual Activity',
      description: 'Get alerts for suspicious transactions',
      icon: <Bell className="h-4 w-4" />,
      enabled: true
    }
  ]);

  const toggleNotification = (id: string) => {
    setNotificationSettings(prev => {
      const updatedSettings = prev.map(setting => 
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      );
      
      // Save to localStorage
      localStorage.setItem('notification_settings', JSON.stringify(updatedSettings));
      
      return updatedSettings;
    });
  };
  
  // Load notification settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('notification_settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setNotificationSettings(parsedSettings);
      } catch (error) {
        console.error('Error parsing notification settings:', error);
      }
    }
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Notification Preferences</h2>
      
      <div className="space-y-4">
        {notificationSettings.map((setting) => (
          <div key={setting.id} className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className={clsx(
                'p-2 rounded-full',
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              )}>
                {setting.icon}
              </div>
              <div>
                <p className="font-medium">{setting.title}</p>
                <p className="text-sm text-gray-500">{setting.description}</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={setting.enabled}
                onChange={() => toggleNotification(setting.id)}
              />
              <div className={clsx(
                "w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all",
                darkMode 
                  ? 'bg-gray-700 peer-checked:bg-[#1E3A8A]' 
                  : 'bg-gray-200 peer-checked:bg-[#1E3A8A]'
              )}></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPreferences;