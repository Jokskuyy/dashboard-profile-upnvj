import React, { useState } from 'react';
import { Users, Mail, ChevronRight, User, BarChart3, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { professorsData, getProfessorsByFaculty, getFacultyByName } from '../utils/staticData';
import FacultyBarChart from './FacultyBarChart';

const ProfessorsSection: React.FC = () => {
  const { t } = useLanguage();
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  
  const facultyData = getProfessorsByFaculty();
  const selectedFacultyData = selectedFaculty 
    ? facultyData.find(f => f.id === selectedFaculty)
    : null;
  
  const displayedProfessors = selectedFacultyData 
    ? (showAll ? selectedFacultyData.professors : selectedFacultyData.professors.slice(0, 3))
    : (showAll ? professorsData : professorsData.slice(0, 3));

  const handleBarClick = (faculty: any) => {
    setSelectedFaculty(faculty.id);
    setShowAll(false);
  };

  const handleBackToChart = () => {
    setSelectedFaculty(null);
    setShowAll(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <Users className="w-6 h-6 mr-2 text-blue-600" />
            {selectedFacultyData ? selectedFacultyData.name : t('professorsTitle')}
          </h3>
          <p className="text-gray-600 mt-1">
            {selectedFacultyData 
              ? `${selectedFacultyData.count} ${t('professorsInFaculty')}`
              : t('professorsSubtitle')
            }
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-600">
            {selectedFacultyData ? selectedFacultyData.count : professorsData.length}
          </p>
          <p className="text-sm text-gray-500">{t('totalProfessors')}</p>
        </div>
      </div>

      {!selectedFaculty ? (
        // Bar Chart View
        <div>
          <div className="flex items-center mb-4">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">{t('professorDistribution')}</span>
          </div>
          <FacultyBarChart
            data={facultyData}
            title=""
            onBarClick={handleBarClick}
            selectedFaculty={selectedFaculty || undefined}
            clickBarText={t('clickBarForDetail')}
          />
        </div>
      ) : (
        // Detail View
        <div>
          <button
            onClick={handleBackToChart}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            {t('backToChart')}
          </button>

          <div className="space-y-4">
            {displayedProfessors.map((professor) => (
              <div key={professor.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${selectedFacultyData?.color}20` }}
                  >
                    <User className="w-6 h-6" style={{ color: selectedFacultyData?.color }} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{professor.name}</h4>
                    <p className="text-sm text-gray-600">{professor.title}</p>
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
                            className="px-2 py-1 text-xs rounded-full"
                            style={{ 
                              backgroundColor: `${selectedFacultyData?.color}20`,
                              color: selectedFacultyData?.color
                            }}
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

          {selectedFacultyData && selectedFacultyData.professors.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full mt-4 flex items-center justify-center space-x-2 py-2 px-4 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <span>{showAll ? t('showLess') : t('viewAll')}</span>
              <ChevronRight className={`w-4 h-4 transition-transform ${showAll ? 'rotate-90' : ''}`} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfessorsSection;
