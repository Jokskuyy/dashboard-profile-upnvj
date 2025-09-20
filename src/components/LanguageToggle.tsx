import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <Globe className="w-5 h-5 text-gray-600" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as 'id' | 'en')}
        className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="id">🇮🇩 Bahasa Indonesia</option>
        <option value="en">🇺🇸 English</option>
      </select>
    </div>
  );
};

export default LanguageToggle;
