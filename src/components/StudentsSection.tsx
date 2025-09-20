import React from 'react';
import { GraduationCap, Users, TrendingUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { studentData, getTotalStats } from '../utils/staticData';

const StudentsSection: React.FC = () => {
  const { t } = useLanguage();
  const totalStats = getTotalStats();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <GraduationCap className="w-6 h-6 mr-2 text-green-600" />
            {t('studentsTitle')}
          </h3>
          <p className="text-gray-600 mt-1">{t('studentsSubtitle')}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-green-600">{totalStats.totalStudents.toLocaleString()}</p>
          <p className="text-sm text-gray-500">{t('totalStudents')}</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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

      {/* Faculty Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('faculty')}</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">{t('undergraduate')}</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">{t('graduate')}</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">{t('postgraduate')}</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Total</th>
            </tr>
          </thead>
          <tbody>
            {studentData.map((faculty, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-900">{faculty.faculty}</td>
                <td className="py-3 px-4 text-right text-gray-600">{faculty.undergraduate.toLocaleString()}</td>
                <td className="py-3 px-4 text-right text-gray-600">{faculty.graduate.toLocaleString()}</td>
                <td className="py-3 px-4 text-right text-gray-600">{faculty.postgraduate.toLocaleString()}</td>
                <td className="py-3 px-4 text-right font-semibold text-gray-900">{faculty.totalStudents.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentsSection;
