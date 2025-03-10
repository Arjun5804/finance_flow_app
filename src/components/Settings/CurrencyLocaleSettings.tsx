import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Globe, DollarSign } from 'lucide-react';
import { getSettings, updateSetting } from '../../services/settingsService';
import { setLanguage, translate, getCurrentLanguage, AvailableLanguage } from '../../services/translationService';

type CurrencyLocaleSettingsProps = {
  darkMode: boolean;
};

type Currency = {
  code: string;
  symbol: string;
  name: string;
};

type DateFormat = {
  value: string;
  label: string;
  example: string;
};

const CurrencyLocaleSettings: React.FC<CurrencyLocaleSettingsProps> = ({ darkMode }) => {
  // Initialize state from settings service
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [selectedDateFormat, setSelectedDateFormat] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<AvailableLanguage>('en-US');
  const currentLanguage = getCurrentLanguage();
  
  // Load saved settings on component mount
  useEffect(() => {
    const settings = getSettings();
    setSelectedCurrency(settings.currency);
    setSelectedDateFormat(settings.dateFormat);
    setSelectedLanguage(settings.language as AvailableLanguage);
  }, []);

  const currencies: Currency[] = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  ];

  const dateFormats: DateFormat[] = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY', example: '12/31/2023' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY', example: '31/12/2023' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD', example: '2023-12-31' },
  ];

  const languages = [
    { code: 'en-US', name: translate('language.english', currentLanguage) },
    { code: 'ta-IN', name: translate('language.tamil', currentLanguage) },
  ];

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setSelectedCurrency(newValue);
    updateSetting('currency', newValue);
  };

  const handleDateFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setSelectedDateFormat(newValue);
    updateSetting('dateFormat', newValue);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value as AvailableLanguage;
    setSelectedLanguage(newValue);
    updateSetting('language', newValue);
    setLanguage(newValue);
    // Reload the page to apply the language change
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">{translate('settings.currency.title', currentLanguage)}</h2>
      
      <div className="space-y-6">
        {/* Currency Selection */}
        <div className="space-y-2">
          <div>
            <h3 className="font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span>{translate('settings.currency', currentLanguage)}</span>
            </h3>
            <p className="text-sm text-gray-500">{translate('settings.currency.select', currentLanguage)}</p>
          </div>
          
          <select
            value={selectedCurrency}
            onChange={handleCurrencyChange}
            className={clsx(
              'w-full rounded-md border-gray-300 shadow-sm focus:border-[#1E3A8A] focus:ring-[#1E3A8A]',
              darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'
            )}
          >
            {currencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.code} ({currency.symbol}) - {currency.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Date Format Selection */}
        <div className="space-y-2">
          <div>
            <h3 className="font-medium">{translate('settings.dateFormat', currentLanguage)}</h3>
            <p className="text-sm text-gray-500">{translate('settings.dateFormat.select', currentLanguage)}</p>
          </div>
          
          <select
            value={selectedDateFormat}
            onChange={handleDateFormatChange}
            className={clsx(
              'w-full rounded-md border-gray-300 shadow-sm focus:border-[#1E3A8A] focus:ring-[#1E3A8A]',
              darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'
            )}
          >
            {dateFormats.map((format) => (
              <option key={format.value} value={format.value}>
                {format.label} (e.g., {format.example})
              </option>
            ))}
          </select>
        </div>
        
        {/* Language Selection */}
        <div className="space-y-2">
          <div>
            <h3 className="font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>{translate('settings.language', currentLanguage)}</span>
            </h3>
            <p className="text-sm text-gray-500">{translate('settings.language.select', currentLanguage)}</p>
          </div>
          
          <select
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className={clsx(
              'w-full rounded-md border-gray-300 shadow-sm focus:border-[#1E3A8A] focus:ring-[#1E3A8A]',
              darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'
            )}
          >
            {languages.map((language) => (
              <option key={language.code} value={language.code}>
                {language.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default CurrencyLocaleSettings;