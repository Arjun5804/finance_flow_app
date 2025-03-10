import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { User, Upload } from 'lucide-react';
import { getCurrentUser } from '../../services/authService';
import { updateSetting } from '../../services/settingsService';

type UserProfileProps = {
  darkMode: boolean;
};

const UserProfile: React.FC<UserProfileProps> = ({ darkMode }) => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    profilePicture: ''
  });
  
  // Load user data from authentication service
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setProfileData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        profilePicture: currentUser.profilePicture || ''
      });
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Save changes to localStorage
    const currentUser = getCurrentUser();
    if (currentUser) {
      // Update the user data in localStorage
      const updatedUser = { ...currentUser, [name]: value };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Also update in settings if needed
      if (name === 'name' || name === 'email') {
        updateSetting(name as any, value);
      }
    }
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const target = event.target;
        if (target && target.result) {
          const newProfilePicture = target.result as string;
          
          setProfileData(prev => ({
            ...prev,
            profilePicture: newProfilePicture
          }));
          
          // Save to localStorage
          const currentUser = getCurrentUser();
          if (currentUser) {
            const updatedUser = { ...currentUser, profilePicture: newProfilePicture };
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          }
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">User Profile</h2>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Picture */}
        <div className="flex flex-col items-center space-y-3">
          <div className={clsx(
            'w-32 h-32 rounded-full overflow-hidden flex items-center justify-center',
            darkMode ? 'bg-gray-700' : 'bg-gray-200'
          )}>
            {profileData.profilePicture ? (
              <img 
                src={profileData.profilePicture} 
                alt="Profile" 
                className="w-full h-full object-cover" 
              />
            ) : (
              <User className="w-16 h-16 text-gray-400" />
            )}
          </div>
          
          <label className={clsx(
            'cursor-pointer px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2',
            darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          )}>
            <Upload className="h-4 w-4" />
            <span>Upload Photo</span>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleProfilePictureChange}
            />
          </label>
        </div>
        
        {/* Profile Information */}
        <div className="flex-1 space-y-4">
          <div>
            <label className="block font-medium mb-1">Full Name</label>
            <input 
              type="text" 
              name="name"
              value={profileData.name}
              onChange={handleInputChange}
              className={clsx(
                'w-full rounded-md border-gray-300 shadow-sm focus:border-[#1E3A8A] focus:ring-[#1E3A8A]',
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'
              )}
            />
          </div>
          
          <div>
            <label className="block font-medium mb-1">Email Address</label>
            <input 
              type="email" 
              name="email"
              value={profileData.email}
              onChange={handleInputChange}
              className={clsx(
                'w-full rounded-md border-gray-300 shadow-sm focus:border-[#1E3A8A] focus:ring-[#1E3A8A]',
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;