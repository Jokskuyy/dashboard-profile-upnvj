import React from 'react';
import { MapPin, ExternalLink, Building, Navigation } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const CampusMapSection: React.FC = () => {
  const { t } = useLanguage();

  const handleOpenCampusMap = () => {
    // This will be the Unity WebGL build URL when ready
    // For now, we'll show an alert
    alert('Campus Map will open Unity 3D application. Feature coming soon!');
    
    // Future implementation:
    // window.open('/unity-campus-map', '_blank');
    // or
    // window.location.href = 'unity://campus-map';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <MapPin className="w-6 h-6 mr-2 text-red-600" />
            {t('campusMapTitle')}
          </h3>
          <p className="text-gray-600 mt-1">{t('campusMapSubtitle')}</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building className="w-8 h-8 text-red-600" />
        </div>
        
        <h4 className="text-lg font-semibold text-gray-900 mb-2">
          {t('campusMapTitle')} 3D
        </h4>
        
        <p className="text-gray-600 mb-6">
          {t('campusMapSubtitle')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
          <div className="bg-white rounded-lg p-4">
            <Navigation className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Interactive Navigation</p>
            <p className="text-gray-600">Navigate through campus</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <Building className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Building Information</p>
            <p className="text-gray-600">Detailed facility info</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <MapPin className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Location Finder</p>
            <p className="text-gray-600">Find specific locations</p>
          </div>
        </div>

        <button
          onClick={handleOpenCampusMap}
          className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-lg"
        >
          <ExternalLink className="w-5 h-5 mr-2" />
          {t('openMap')}
        </button>
      </div>
    </div>
  );
};

export default CampusMapSection;
