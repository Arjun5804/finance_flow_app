// Key for storing settings in localStorage
const SETTINGS_STORAGE_KEY = 'financeflow_settings';

// Default settings
const DEFAULT_SETTINGS = {
  currency: 'INR',
  dateFormat: 'DD/MM/YYYY',
  language: 'en-US'
};

// Settings type definition
export type UserSettings = {
  currency: string;
  dateFormat: string;
  language: string;
};

// Get user settings from localStorage
export const getSettings = (): UserSettings => {
  const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
  if (!storedSettings) return DEFAULT_SETTINGS;
  
  try {
    return JSON.parse(storedSettings);
  } catch (error) {
    console.error('Error parsing settings from localStorage:', error);
    return DEFAULT_SETTINGS;
  }
};

// Save settings to localStorage
export const saveSettings = (settings: UserSettings): void => {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings to localStorage:', error);
  }
};

// Update a specific setting
export const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]): UserSettings => {
  const currentSettings = getSettings();
  const updatedSettings = {
    ...currentSettings,
    [key]: value
  };
  
  saveSettings(updatedSettings);
  return updatedSettings;
};

// Get a specific setting
export const getSetting = <K extends keyof UserSettings>(key: K): UserSettings[K] => {
  const settings = getSettings();
  return settings[key];
};

// Format currency based on the selected currency code
export const formatCurrency = (amount: number, currencyCode?: string): string => {
  const settings = getSettings();
  const currency = currencyCode || settings.currency;
  const locale = settings.language; // Use the user's selected language for formatting
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${currency} ${amount}`;
  }
};

// Get currency symbol based on the selected currency code
export const getCurrencySymbol = (currencyCode?: string): string => {
  const settings = getSettings();
  const currency = currencyCode || settings.currency;
  const locale = settings.language;
  
  try {
    // Use a dummy amount to get the formatted currency, then extract the symbol
    const formatted = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      currencyDisplay: 'symbol'
    }).format(0);
    
    // Extract the symbol (everything before the number)
    const symbol = formatted.replace(/[0-9.,\s]/g, '');
    return symbol;
  } catch (error) {
    console.error('Error getting currency symbol:', error);
    
    // Fallback symbols for common currencies
    const fallbackSymbols: {[key: string]: string} = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥',
      'CAD': 'C$',
      'AUD': 'A$',
      'CNY': '¥',
      'INR': '₹'
    };
    
    return fallbackSymbols[currency] || currency;
  }
};

// Format date based on the selected date format
export const formatDate = (date: Date): string => {
  const settings = getSettings();
  const format = settings.dateFormat;
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  switch (format) {
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`;
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    default:
      return `${day}/${month}/${year}`;
  }
};