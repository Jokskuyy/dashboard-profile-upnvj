import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('universityShort')}</h3>
            <p className="text-gray-300 mb-4">{t('universityName')}</p>
            <p className="text-sm text-gray-400">{t('internationalProfile')}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300 text-sm">{t('footer.address')}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <p className="text-gray-300 text-sm">{t('footer.phone')}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <p className="text-gray-300 text-sm">{t('footer.email')}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a href="#" className="block text-gray-300 hover:text-white text-sm transition-colors">
                Academic Programs
              </a>
              <a href="#" className="block text-gray-300 hover:text-white text-sm transition-colors">
                Research
              </a>
              <a href="#" className="block text-gray-300 hover:text-white text-sm transition-colors">
                International Relations
              </a>
              <a href="#" className="block text-gray-300 hover:text-white text-sm transition-colors">
                Student Life
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6">
          <p className="text-center text-gray-400 text-sm">{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
