import React, { useState } from 'react';
import clsx from 'clsx';
import { Shield, Lock, Smartphone } from 'lucide-react';

type SecuritySettingsProps = {
  darkMode: boolean;
};

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ darkMode }) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [connectedDevices] = useState([
    { id: 1, name: 'Chrome on Windows', lastActive: '2 hours ago', current: true },
    { id: 2, name: 'Safari on iPhone', lastActive: '1 day ago', current: false },
    { id: 3, name: 'Firefox on MacBook', lastActive: '3 days ago', current: false }
  ]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitPasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      alert('Password must be at least 8 characters long!');
      return;
    }
    
    // In a real app, this would call an API to update the password
    // For now, we'll update the password in localStorage
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Find and update the user's password in the users array
      const userIndex = users.findIndex((u: any) => u.email === currentUser.email);
      if (userIndex !== -1) {
        users[userIndex].password = passwordData.newPassword;
        localStorage.setItem('users', JSON.stringify(users));
        alert('Password updated successfully!');
        
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        alert('User not found!');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Error updating password!');
    }
  };

  const toggleTwoFactor = () => {
    const newValue = !twoFactorEnabled;
    setTwoFactorEnabled(newValue);
    
    // Save to localStorage
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      currentUser.twoFactorEnabled = newValue;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      
      // Also update in the users array
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.email === currentUser.email);
      if (userIndex !== -1) {
        users[userIndex].twoFactorEnabled = newValue;
        localStorage.setItem('users', JSON.stringify(users));
      }
    } catch (error) {
      console.error('Error updating two-factor authentication:', error);
    }
  };

  const handleRemoveDevice = (deviceId: number) => {
    // Remove the device from the list
    const updatedDevices = connectedDevices.filter(device => device.id !== deviceId);
    
    // Save to localStorage
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      currentUser.connectedDevices = updatedDevices;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      
      // Also update in the users array
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.email === currentUser.email);
      if (userIndex !== -1) {
        users[userIndex].connectedDevices = updatedDevices;
        localStorage.setItem('users', JSON.stringify(users));
      }
      
      alert(`Device ${deviceId} has been removed`);
    } catch (error) {
      console.error('Error removing device:', error);
      alert('Error removing device');
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold mb-4">Security Settings</h2>
      
      {/* Password Change Section */}
      <div className="space-y-4">
        <div>
          <h3 className="font-medium flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>Change Password</span>
          </h3>
          <p className="text-sm text-gray-500">Update your password regularly for better security</p>
        </div>
        
        <form onSubmit={handleSubmitPasswordChange} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Current Password</label>
            <input 
              type="password" 
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className={clsx(
                'w-full rounded-md border-gray-300 shadow-sm focus:border-[#1E3A8A] focus:ring-[#1E3A8A]',
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'
              )}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input 
              type="password" 
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className={clsx(
                'w-full rounded-md border-gray-300 shadow-sm focus:border-[#1E3A8A] focus:ring-[#1E3A8A]',
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'
              )}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Confirm New Password</label>
            <input 
              type="password" 
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className={clsx(
                'w-full rounded-md border-gray-300 shadow-sm focus:border-[#1E3A8A] focus:ring-[#1E3A8A]',
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'
              )}
              required
            />
          </div>
          
          <button
            type="submit"
            className={clsx(
              'px-4 py-2 rounded-md text-white bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-sm font-medium',
              'flex items-center gap-2'
            )}
          >
            <Shield className="h-4 w-4" />
            <span>Update Password</span>
          </button>
        </form>
      </div>
      
      {/* Two-Factor Authentication */}
      <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              <span>Two-Factor Authentication</span>
            </h3>
            <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={twoFactorEnabled}
              onChange={toggleTwoFactor}
            />
            <div className={clsx(
              "w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all",
              darkMode 
                ? 'bg-gray-700 peer-checked:bg-[#1E3A8A]' 
                : 'bg-gray-200 peer-checked:bg-[#1E3A8A]'
            )}></div>
          </label>
        </div>
        
        {twoFactorEnabled && (
          <div className={clsx(
            'p-4 rounded-md text-sm',
            darkMode ? 'bg-gray-700' : 'bg-gray-100'
          )}>
            <p>Two-factor authentication is enabled. You'll receive a verification code on your phone when signing in from a new device.</p>
          </div>
        )}
      </div>
      
      {/* Connected Devices */}
      <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div>
          <h3 className="font-medium">Connected Devices</h3>
          <p className="text-sm text-gray-500">Manage devices that are connected to your account</p>
        </div>
        
        <div className="space-y-3">
          {connectedDevices.map((device) => (
            <div 
              key={device.id} 
              className={clsx(
                'p-3 rounded-md flex items-center justify-between',
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              )}
            >
              <div>
                <p className="font-medium flex items-center gap-1">
                  {device.name}
                  {device.current && (
                    <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-100">
                      Current
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-500">Last active: {device.lastActive}</p>
              </div>
              
              {!device.current && (
                <button
                  onClick={() => handleRemoveDevice(device.id)}
                  className={clsx(
                    'text-xs px-2 py-1 rounded',
                    darkMode 
                      ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  )}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;