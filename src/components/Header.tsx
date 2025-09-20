import React from 'react';
import { School } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';

const Header: React.FC = () => {
  const { t } = useLanguage();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <School className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{t('universityShort')}</h1>
              <p className="text-sm text-gray-600">{t('internationalProfile')}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <LanguageToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
