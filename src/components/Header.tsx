import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';
import logoUpnvj from '../assets/images/logoupnvj.png';
import { Menu, X, Home, Users, Award, MapPin, Package } from 'lucide-react';

const Header: React.FC = () => {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/80 backdrop-blur-xl shadow-2xl border-b border-white/20' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center transition-all duration-300 ${
            isScrolled ? 'py-3' : 'py-6'
          }`}>
            {/* Logo Section */}
            <div className="flex items-center space-x-4 group">
              <div className={`relative flex items-center justify-center transition-all duration-500 ${
                isScrolled ? 'w-12 h-12' : 'w-16 h-16'
              } bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg group-hover:shadow-2xl transform group-hover:scale-110`}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl blur opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                <img 
                  src={logoUpnvj} 
                  alt="UPNVJ Logo" 
                  className={`relative z-10 object-contain transition-all duration-300 filter brightness-0 invert ${
                    isScrolled ? 'w-8 h-8' : 'w-10 h-10'
                  }`}
                />
              </div>
              <div className="hidden md:block">
                <h1 className={`font-bold transition-all duration-300 ${
                  isScrolled 
                    ? 'text-lg text-gray-900' 
                    : 'text-xl text-white drop-shadow-lg'
                } leading-tight`}>
                  {t('universityShort')}
                </h1>
                <p className={`transition-all duration-300 ${
                  isScrolled 
                    ? 'text-xs text-gray-600' 
                    : 'text-sm text-blue-100 drop-shadow'
                }`}>
                  Excellence in Education
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {[
                { id: 'home', label: 'Home', icon: Home },
                { id: 'professors', label: 'Faculty', icon: Users },
                { id: 'students', label: 'Students', icon: Award },
                { id: 'assets', label: 'Facilities', icon: Package },
                { id: 'campus-map', label: 'Campus', icon: MapPin },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    isScrolled
                      ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                      : 'text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Language Toggle */}
              <div className={`transition-all duration-300 ${isScrolled ? 'scale-90' : 'scale-100'}`}>
                <LanguageToggle />
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden p-2 rounded-xl transition-all duration-300 ${
                  isScrolled
                    ? 'text-gray-700 hover:bg-gray-100'
                    : 'text-white hover:bg-white/10 backdrop-blur-sm'
                }`}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Dynamic Progress Bar */}
        <div 
          className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 ${
            isScrolled ? 'w-full opacity-100' : 'w-0 opacity-0'
          }`}
          style={{
            width: isScrolled ? `${Math.min((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100, 100)}%` : '0%'
          }}
        />
      </header>

      {/* Mobile Navigation Menu */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
        isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Menu Panel */}
        <div className={`absolute top-0 right-0 w-80 h-full bg-white/95 backdrop-blur-xl shadow-2xl transform transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="p-6 pt-20">
            <nav className="space-y-2">
              {[
                { id: 'home', label: 'Home', icon: Home },
                { id: 'professors', label: 'Faculty & Staff', icon: Users },
                { id: 'students', label: 'Student Life', icon: Award },
                { id: 'assets', label: 'Campus Facilities', icon: Package },
                { id: 'campus-map', label: 'Virtual Campus', icon: MapPin },
              ].map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 fade-in-up stagger-${index + 1}`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <img 
                  src={logoUpnvj} 
                  alt="UPNVJ Logo" 
                  className="w-16 h-16 mx-auto mb-3 object-contain"
                />
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {t('universityShort')}
                </h3>
                <p className="text-sm text-gray-600">
                  Excellence in Education Since 1996
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
