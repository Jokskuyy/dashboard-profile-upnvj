import React, { useState } from 'react';
import { Users, Mail, ChevronRight, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { professorsData } from '../utils/staticData';

const ProfessorsSection: React.FC = () => {
  const { t } = useLanguage();
  const [showAll, setShowAll] = useState(false);
  
  const displayedProfessors = showAll ? professorsData : professorsData.slice(0, 3);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <Users className="w-6 h-6 mr-2 text-blue-600" />
            {t('professorsTitle')}
          </h3>
          <p className="text-gray-600 mt-1">{t('professorsSubtitle')}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-600">{professorsData.length}</p>
          <p className="text-sm text-gray-500">{t('totalProfessors')}</p>
        </div>
      </div>

      <div className="space-y-4">
        {displayedProfessors.map((professor) => (
          <div key={professor.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{professor.name}</h4>
                <p className="text-sm text-gray-600">{professor.title} - {professor.faculty}</p>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <Mail className="w-4 h-4 mr-1" />
                  {professor.email}
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">{t('expertise')}:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {professor.expertise.map((skill, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {professorsData.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-4 flex items-center justify-center space-x-2 py-2 px-4 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <span>{showAll ? 'Show Less' : t('viewAll')}</span>
          <ChevronRight className={`w-4 h-4 transition-transform ${showAll ? 'rotate-90' : ''}`} />
        </button>
      )}
    </div>
  );
};

export default ProfessorsSection;
