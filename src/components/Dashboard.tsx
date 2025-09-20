import React from 'react';
import { Users, Award, GraduationCap, MapPin, Building2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTotalStats } from '../utils/staticData';
import KPICard from './KPICard';
import ProfessorsSection from './ProfessorsSection';
import AccreditationSection from './AccreditationSection';
import StudentsSection from './StudentsSection';
import CampusMapSection from './CampusMapSection';

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const stats = getTotalStats();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg shadow-lg p-8 text-white mb-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('universityName')}</h1>
          <p className="text-xl opacity-90 mb-6">{t('internationalProfile')}</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-8 h-8" />
              </div>
              <p className="text-2xl font-bold">{stats.totalProfessors}</p>
              <p className="text-sm opacity-90">{t('professors')}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <GraduationCap className="w-8 h-8" />
              </div>
              <p className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</p>
              <p className="text-sm opacity-90">{t('students')}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <Award className="w-8 h-8" />
              </div>
              <p className="text-2xl font-bold">{stats.activeAccreditations}</p>
              <p className="text-sm opacity-90">{t('accreditation')}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <Building2 className="w-8 h-8" />
              </div>
              <p className="text-2xl font-bold">{stats.totalFaculties}</p>
              <p className="text-sm opacity-90">Faculties</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('kpi')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title={t('professors')}
            value={stats.totalProfessors}
            subtitle="Qualified educators"
            icon={Users}
            color="blue"
          />
          <KPICard
            title={t('students')}
            value={stats.totalStudents.toLocaleString()}
            subtitle="Active enrollment"
            icon={GraduationCap}
            color="green"
          />
          <KPICard
            title={t('accreditation')}
            value={stats.activeAccreditations}
            subtitle="Active programs"
            icon={Award}
            color="purple"
          />
          <KPICard
            title={t('campusMap')}
            value="3D"
            subtitle="Interactive map"
            icon={MapPin}
            color="orange"
          />
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <ProfessorsSection />
        <AccreditationSection />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <StudentsSection />
        <CampusMapSection />
      </div>
    </div>
  );
};

export default Dashboard;
