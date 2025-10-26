import React, { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { trackLanguageChange } from '../analytics/Analytics';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    const fromLang = language;
    const toLang = language === "id" ? "en" : "id";

    setIsAnimating(true);
    setTimeout(() => {
      setLanguage(toLang);
      setIsAnimating(false);

      // Track language change
      trackLanguageChange(fromLang, toLang);
    }, 150);
  };

  return (
    <button
      onClick={handleToggle}
      className="group relative w-16 h-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200 hover:scale-105 overflow-hidden border border-gray-200"
      aria-label={`Switch to ${language === "id" ? "English" : "Indonesian"}`}
    >
      {/* Default background to prevent white */}
      <div className="absolute inset-0 bg-gray-100"></div>

      {/* Background - Indonesia Flag (Red-White) */}
      <div
        className={`absolute inset-0 flex flex-col transition-all duration-500 ${
          language === "id" ? "opacity-100 z-10" : "opacity-0 z-0"
        }`}
      >
        <div className="w-full h-1/2 bg-red-500"></div>
        <div className="w-full h-1/2 bg-white"></div>
      </div>

      {/* Background - USA Flag */}
      <div
        className={`absolute inset-0 transition-all duration-500 ${
          language === "en" ? "opacity-100 z-10" : "opacity-0 z-0"
        }`}
      >
        {/* Red and white stripes background */}
        <div className="w-full h-full flex flex-col">
          <div className="w-full flex-1 bg-red-500"></div>
          <div className="w-full flex-1 bg-white"></div>
          <div className="w-full flex-1 bg-red-500"></div>
          <div className="w-full flex-1 bg-white"></div>
          <div className="w-full flex-1 bg-red-500"></div>
          <div className="w-full flex-1 bg-white"></div>
          <div className="w-full flex-1 bg-red-500"></div>
        </div>
        {/* Blue canton (stars area) */}
        <div className="absolute top-0 left-0 w-6 h-4 bg-blue-700"></div>
      </div>

      {/* Sliding flag emoji indicator */}
      <div
        className={`absolute top-0.5 w-7 h-7 rounded-full bg-white shadow-xl transition-all duration-300 ease-in-out flex items-center justify-center text-base transform z-20 ${
          language === "id" ? "left-0.5" : "left-8"
        } ${isAnimating ? "scale-110 rotate-180" : ""}`}
      >
        <span
          className={`transition-all duration-300 font-medium ${
            isAnimating ? "scale-0" : "scale-100"
          }`}
        >
          {language === "id" ? "🇮🇩" : "🇺🇸"}
        </span>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-white bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-full"></div>
    </button>
  );
};

export default LanguageToggle;
