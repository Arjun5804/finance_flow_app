// Translation service for multi-language support

// Key for storing language preference in localStorage
const LANGUAGE_STORAGE_KEY = 'financeflow_language';

// Available languages
export type AvailableLanguage = 'en-US' | 'ta-IN';

// Translation dictionary type
export type TranslationDictionary = {
  [key: string]: {
    [key in AvailableLanguage]: string;
  };
};

// Translation dictionary with common phrases
export const translations: TranslationDictionary = {
  // Common UI elements
  'app.title': {
    'en-US': 'FinanceFlow',
    'ta-IN': 'நிதி ஓட்டம்'
  },
  'app.dashboard': {
    'en-US': 'Dashboard',
    'ta-IN': 'டாஷ்போர்டு'
  },
  'app.transactions': {
    'en-US': 'Transactions',
    'ta-IN': 'பரிவர்த்தனைகள்'
  },
  'app.budgeting': {
    'en-US': 'Budgeting',
    'ta-IN': 'பட்ஜெட்டிங்'
  },
  'app.reports': {
    'en-US': 'Reports',
    'ta-IN': 'அறிக்கைகள்'
  },
  'app.goals': {
    'en-US': 'Goals',
    'ta-IN': 'இலக்குகள்'
  },
  'app.settings': {
    'en-US': 'Settings',
    'ta-IN': 'அமைப்புகள்'
  },
  'app.logout': {
    'en-US': 'Logout',
    'ta-IN': 'வெளியேறு'
  },
  
  // Settings page
  'settings.profile': {
    'en-US': 'Profile',
    'ta-IN': 'சுயவிவரம்'
  },
  'settings.currency': {
    'en-US': 'Currency & Locale',
    'ta-IN': 'நாணயம் & மொழி'
  },
  'settings.notifications': {
    'en-US': 'Notifications',
    'ta-IN': 'அறிவிப்புகள்'
  },
  'settings.security': {
    'en-US': 'Security',
    'ta-IN': 'பாதுகாப்பு'
  },
  'settings.data': {
    'en-US': 'Data Management',
    'ta-IN': 'தரவு மேலாண்மை'
  },
  'settings.theme': {
    'en-US': 'Theme Customization',
    'ta-IN': 'தீம் தனிப்பயனாக்கம்'
  },
  'settings.save': {
    'en-US': 'Save Changes',
    'ta-IN': 'மாற்றங்களை சேமிக்கவும்'
  },
  
  // Currency & Locale settings
  'settings.currency.title': {
    'en-US': 'Currency & Locale Settings',
    'ta-IN': 'நாணயம் & மொழி அமைப்புகள்'
  },
  'settings.currency.select': {
    'en-US': 'Select your preferred currency for transactions',
    'ta-IN': 'பரிவர்த்தனைகளுக்கான உங்கள் விருப்பமான நாணயத்தைத் தேர்ந்தெடுக்கவும்'
  },
  'settings.dateFormat': {
    'en-US': 'Date Format',
    'ta-IN': 'தேதி வடிவம்'
  },
  'settings.dateFormat.select': {
    'en-US': 'Choose how dates are displayed',
    'ta-IN': 'தேதிகள் எவ்வாறு காட்டப்படுகின்றன என்பதைத் தேர்வுசெய்க'
  },
  'settings.language': {
    'en-US': 'Language',
    'ta-IN': 'மொழி'
  },
  'settings.language.select': {
    'en-US': 'Choose your preferred language',
    'ta-IN': 'உங்கள் விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்'
  },
  
  // Languages
  'language.english': {
    'en-US': 'English (US)',
    'ta-IN': 'ஆங்கிலம் (US)'
  },
  'language.tamil': {
    'en-US': 'Tamil',
    'ta-IN': 'தமிழ்'
  },
  
  // Auth page
  'auth.login.title': {
    'en-US': 'Log In to Your Account',
    'ta-IN': 'உங்கள் கணக்கில் உள்நுழைக'
  },
  'auth.signup.title': {
    'en-US': 'Create an Account',
    'ta-IN': 'ஒரு கணக்கை உருவாக்கவும்'
  },
  'auth.login.subtitle': {
    'en-US': 'Enter your credentials to access your account',
    'ta-IN': 'உங்கள் கணக்கை அணுக உங்கள் சான்றுகளை உள்ளிடவும்'
  },
  'auth.signup.subtitle': {
    'en-US': 'Sign up to start managing your finances',
    'ta-IN': 'உங்கள் நிதிகளை நிர்வகிக்கத் தொடங்க பதிவு செய்யுங்கள்'
  },
  'auth.login.email': {
    'en-US': 'Email Address',
    'ta-IN': 'மின்னஞ்சல் முகவரி'
  },
  'auth.login.password': {
    'en-US': 'Password',
    'ta-IN': 'கடவுச்சொல்'
  },
  'auth.signup.fullName': {
    'en-US': 'Full Name',
    'ta-IN': 'முழு பெயர்'
  },
  'auth.signup.confirmPassword': {
    'en-US': 'Confirm Password',
    'ta-IN': 'கடவுச்சொல்லை உறுதிப்படுத்தவும்'
  },
  'auth.login.button': {
    'en-US': 'Log In',
    'ta-IN': 'உள்நுழைக'
  },
  'auth.signup.button': {
    'en-US': 'Sign Up',
    'ta-IN': 'பதிவு செய்க'
  },
  'auth.login.switchToSignup': {
    'en-US': "Don't have an account? Sign Up",
    'ta-IN': "கணக்கு இல்லையா? பதிவு செய்க"
  },
  'auth.login.switchToLogin': {
    'en-US': "Already have an account? Log In",
    'ta-IN': "ஏற்கனவே ஒரு கணக்கு உள்ளதா? உள்நுழைக"
  },
  
  // Reports page
  'reports.income': {
    'en-US': 'Income',
    'ta-IN': 'வருமானம்'
  },
  'reports.expenses': {
    'en-US': 'Expenses',
    'ta-IN': 'செலவுகள்'
  },
  'reports.noExpenseData': {
    'en-US': 'No expense data available for this time period',
    'ta-IN': 'இந்த காலகட்டத்திற்கு செலவு தரவு எதுவும் இல்லை'
  },
  'reports.topExpenses': {
    'en-US': 'Top Expense Categories',
    'ta-IN': 'முக்கிய செலவு வகைகள்'
  },
  'reports.totalExpenses': {
    'en-US': 'Total Expenses',
    'ta-IN': 'மொத்த செலவுகள்'
  }
};

// Get current language from settings
export const getCurrentLanguage = (): AvailableLanguage => {
  // First check the language storage key
  const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (storedLanguage && (storedLanguage === 'en-US' || storedLanguage === 'ta-IN')) {
    return storedLanguage as AvailableLanguage;
  }
  
  // If not found, check the settings storage
  try {
    const settingsJson = localStorage.getItem('financeflow_settings');
    if (settingsJson) {
      const settings = JSON.parse(settingsJson);
      if (settings.language && (settings.language === 'en-US' || settings.language === 'ta-IN')) {
        // Sync the language storage with settings
        localStorage.setItem(LANGUAGE_STORAGE_KEY, settings.language);
        return settings.language as AvailableLanguage;
      }
    }
  } catch (error) {
    console.error('Error parsing settings for language:', error);
  }
  
  return 'en-US';
};

// Set current language
export const setLanguage = (language: AvailableLanguage): void => {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  
  // Update document language attribute
  document.documentElement.lang = language;
  
  // Update language in settings
  try {
    const settingsJson = localStorage.getItem('financeflow_settings');
    if (settingsJson) {
      const settings = JSON.parse(settingsJson);
      settings.language = language;
      localStorage.setItem('financeflow_settings', JSON.stringify(settings));
    }
  } catch (error) {
    console.error('Error updating language in settings:', error);
  }
};

// Translate a key to the current language
export const translate = (key: string, language?: AvailableLanguage): string => {
  const currentLanguage = language || getCurrentLanguage();
  
  if (!translations[key]) {
    console.warn(`Translation key not found: ${key}`);
    return key;
  }
  
  return translations[key][currentLanguage] || translations[key]['en-US'] || key;
};