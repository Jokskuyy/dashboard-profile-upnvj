import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';
import logoUpnvj from '../assets/images/logoupnvj.png';

const Header: React.FC = () => {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
          : 'bg-white shadow-sm border-b border-gray-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center transition-all duration-300 ${
          isScrolled ? 'py-3' : 'py-4'
        }`}>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center transition-all duration-300 ${
              isScrolled ? 'w-10 h-10' : 'w-12 h-12'
            }`}>
              <img 
                src={logoUpnvj} 
                alt="UPNVJ Logo" 
                className={`object-contain transition-all duration-300 ${
                  isScrolled ? 'w-10 h-10' : 'w-12 h-12'
                }`}
              />
            </div>
            <div>
              <h1 className={`font-bold text-gray-900 transition-all duration-300 ${
                isScrolled ? 'text-lg' : 'text-xl'
              }`}>
                {t('universityShort')}
              </h1>
              <p className={`text-gray-600 transition-all duration-300 ${
                isScrolled ? 'text-xs' : 'text-sm'
              }`}>
                {t('internationalProfile')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className={`transition-all duration-300 ${isScrolled ? 'scale-90' : 'scale-100'}`}>
              <LanguageToggle />
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div 
        className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ${
          isScrolled ? 'w-full opacity-100' : 'w-0 opacity-0'
        }`}
      />
    </header>
  );
};

export default Header;
