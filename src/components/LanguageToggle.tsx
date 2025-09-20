import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setLanguage(language === 'id' ? 'en' : 'id');
      setIsAnimating(false);
    }, 150);
  };

  return (
    <button
      onClick={handleToggle}
      className="group relative w-16 h-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200 hover:scale-105 overflow-hidden border border-gray-200"
      aria-label={`Switch to ${language === 'id' ? 'English' : 'Indonesian'}`}
    >
      {/* Background - Indonesia Flag (Red-White) - Always visible */}
      <div className={`absolute inset-0 flex flex-col transition-all duration-300 ${language === 'id' ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-full h-1/2 bg-red-500"></div>
        <div className="w-full h-1/2 bg-white border-t border-gray-100"></div>
      </div>
      
      {/* Background - USA Flag */}
      <div className={`absolute inset-0 transition-all duration-300 ${language === 'en' ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-full h-full relative">
          {/* Blue field with stars area */}
          <div className="absolute top-0 left-0 w-6 h-4 bg-blue-700"></div>
          
          {/* Red and white stripes */}
          <div className="absolute inset-0">
            <div className="w-full h-full flex flex-col">
              <div className="w-full flex-1 bg-red-500"></div>
              <div className="w-full flex-1 bg-white"></div>
              <div className="w-full flex-1 bg-red-500"></div>
              <div className="w-full flex-1 bg-white"></div>
              <div className="w-full flex-1 bg-red-500"></div>
              <div className="w-full flex-1 bg-white"></div>
              <div className="w-full flex-1 bg-red-500"></div>
            </div>
          </div>
          
          {/* Blue field overlay */}
          <div className="absolute top-0 left-0 w-6 h-4 bg-blue-700"></div>
        </div>
      </div>
      
      {/* Sliding flag emoji indicator */}
      <div 
        className={`absolute top-0.5 w-7 h-7 rounded-full bg-white/95 backdrop-blur-sm shadow-lg transition-all duration-300 ease-in-out flex items-center justify-center text-base transform z-10 ${
          language === 'id' 
            ? 'left-0.5' 
            : 'left-8'
        } ${isAnimating ? 'scale-110 rotate-180' : ''}`}
      >
        <span className={`transition-all duration-300 filter drop-shadow-sm ${isAnimating ? 'scale-0' : 'scale-100'}`}>
          {language === 'id' ? '🇮🇩' : '🇺🇸'}
        </span>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-white bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-full"></div>
    </button>
  );
};

export default LanguageToggle;
