import React, { useState } from 'react';
import { GraduationCap, Users, TrendingUp, BarChart3, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { studentData, getTotalStats, getStudentsByFaculty } from '../utils/staticData';
import FacultyBarChart from './FacultyBarChart';

const StudentsSection: React.FC = () => {
  const { t } = useLanguage();
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
  
  const totalStats = getTotalStats();
  const facultyData = getStudentsByFaculty();
  const selectedFacultyData = selectedFaculty 
    ? facultyData.find(f => f.id === selectedFaculty)
    : null;

  const handleBarClick = (faculty: any) => {
    setSelectedFaculty(faculty.id);
  };

  const handleBackToChart = () => {
    setSelectedFaculty(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <GraduationCap className="w-6 h-6 mr-2 text-green-600" />
            {selectedFacultyData ? selectedFacultyData.name : t('studentsTitle')}
          </h3>
          <p className="text-gray-600 mt-1">
            {selectedFacultyData 
              ? `${selectedFacultyData.count?.toLocaleString()} mahasiswa di fakultas ini`
              : t('studentsSubtitle')
            }
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-green-600">
            {selectedFacultyData 
              ? selectedFacultyData.count?.toLocaleString() 
              : totalStats.totalStudents.toLocaleString()
            }
          </p>
          <p className="text-sm text-gray-500">{t('totalStudents')}</p>
        </div>
      </div>

      {!selectedFaculty ? (
        // Bar Chart View
        <div>
          <div className="flex items-center mb-4">
            <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Distribusi Mahasiswa per Fakultas</span>
          </div>
          <FacultyBarChart
            data={facultyData}
            title=""
            onBarClick={handleBarClick}
            selectedFaculty={selectedFaculty || undefined}
          />
        </div>
      ) : (
        // Detail View
        <div>
          <button
            onClick={handleBackToChart}
            className="flex items-center text-green-600 hover:text-green-800 mb-4 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Kembali ke Chart
          </button>

          {/* Summary Cards for Selected Faculty */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div 
              className="border rounded-lg p-4"
              style={{ 
                backgroundColor: `${selectedFacultyData?.color}10`,
                borderColor: `${selectedFacultyData?.color}40`
              }}
            >
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2" style={{ color: selectedFacultyData?.color }} />
                <span className="text-sm font-medium" style={{ color: selectedFacultyData?.color }}>
                  {t('undergraduate')}
                </span>
              </div>
              <p className="text-2xl font-bold mt-2" style={{ color: selectedFacultyData?.color }}>
                {selectedFacultyData?.undergraduate?.toLocaleString()}
              </p>
            </div>
            <div 
              className="border rounded-lg p-4"
              style={{ 
                backgroundColor: `${selectedFacultyData?.color}10`,
                borderColor: `${selectedFacultyData?.color}40`
              }}
            >
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" style={{ color: selectedFacultyData?.color }} />
                <span className="text-sm font-medium" style={{ color: selectedFacultyData?.color }}>
                  {t('graduate')}
                </span>
              </div>
              <p className="text-2xl font-bold mt-2" style={{ color: selectedFacultyData?.color }}>
                {selectedFacultyData?.graduate?.toLocaleString()}
              </p>
            </div>
            <div 
              className="border rounded-lg p-4"
              style={{ 
                backgroundColor: `${selectedFacultyData?.color}10`,
                borderColor: `${selectedFacultyData?.color}40`
              }}
            >
              <div className="flex items-center">
                <GraduationCap className="w-5 h-5 mr-2" style={{ color: selectedFacultyData?.color }} />
                <span className="text-sm font-medium" style={{ color: selectedFacultyData?.color }}>
                  {t('postgraduate')}
                </span>
              </div>
              <p className="text-2xl font-bold mt-2" style={{ color: selectedFacultyData?.color }}>
                {selectedFacultyData?.postgraduate?.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Detailed breakdown */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">Rincian Mahasiswa {selectedFacultyData?.shortName}</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">S1 (Sarjana)</span>
                <span className="font-medium">{selectedFacultyData?.undergraduate?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">S2 (Magister)</span>
                <span className="font-medium">{selectedFacultyData?.graduate?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">S3 (Doktor)</span>
                <span className="font-medium">{selectedFacultyData?.postgraduate?.toLocaleString()}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between items-center font-semibold">
                <span>Total</span>
                <span style={{ color: selectedFacultyData?.color }}>
                  {selectedFacultyData?.count?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {!selectedFaculty && (
        // Summary Cards - only shown in chart view
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <Users className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-700">{t('undergraduate')}</span>
            </div>
            <p className="text-2xl font-bold text-blue-900 mt-2">
              {studentData.reduce((acc, faculty) => acc + faculty.undergraduate, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 text-purple-600 mr-2" />
              <span className="text-sm font-medium text-purple-700">{t('graduate')}</span>
            </div>
            <p className="text-2xl font-bold text-purple-900 mt-2">
              {studentData.reduce((acc, faculty) => acc + faculty.graduate, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center">
              <GraduationCap className="w-5 h-5 text-orange-600 mr-2" />
              <span className="text-sm font-medium text-orange-700">{t('postgraduate')}</span>
            </div>
            <p className="text-2xl font-bold text-orange-900 mt-2">
              {studentData.reduce((acc, faculty) => acc + faculty.postgraduate, 0).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsSection;
