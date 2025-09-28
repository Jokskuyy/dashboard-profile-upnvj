import React from "react";
import {
  Users,
  Award,
  GraduationCap,
  MapPin,
  Building2,
  Package,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { getTotalStats } from "../utils/staticData";
import KPICard from "./KPICard";
import ProfessorsSection from "./ProfessorsSection";
import AccreditationSection from "./AccreditationSection";
import StudentsSection from "./StudentsSection";
import CampusMapSection from "./CampusMapSection";
import AssetsSection from "./AssetsSection";

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const stats = getTotalStats();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-800 rounded-2xl shadow-2xl mb-12">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        {/* Content */}
        <div className="relative z-10 px-8 py-16 lg:px-12 lg:py-20">
          <div className="max-w-6xl mx-auto">
            {/* Header Content */}
            <div className="text-center mb-12">
              {/* University Logo */}
              <div className="mb-8 flex justify-center">
                <div className="w-24 h-24 lg:w-32 lg:h-32 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 shadow-lg">
                  <img
                    src="/logoupnvj.png"
                    alt="UPNVJ Logo"
                    className="w-16 h-16 lg:w-20 lg:h-20 object-contain filter brightness-0 invert"
                  />
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  {t("universityShort")}
                </span>
              </h1>

              {/* Subtitle */}
              <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-white/90 mb-4 max-w-4xl mx-auto leading-relaxed">
                {t("universityName")}
              </h2>

              {/* Description */}
              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                {t("internationalProfile")} • {t("heroDescription")}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <button className="px-8 py-3 bg-white text-blue-900 font-semibold rounded-full hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                  {t("explorePrograms")}
                </button>
                <button className="px-8 py-3 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                  {t("virtualTour")}
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
              {/* Professors Stats */}
              <div className="group relative">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-400/20 rounded-xl flex items-center justify-center group-hover:bg-blue-400/30 transition-colors duration-300">
                      <Users className="w-6 h-6 text-blue-200" />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl lg:text-4xl font-bold text-white mb-1">
                        {stats.totalProfessors}
                      </div>
                      <div className="text-blue-200 text-sm font-medium">
                        {t("professors")}
                      </div>
                    </div>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-blue-400 to-blue-300 rounded-full"></div>
                </div>
              </div>

              {/* Students Stats */}
              <div className="group relative">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-400/20 rounded-xl flex items-center justify-center group-hover:bg-green-400/30 transition-colors duration-300">
                      <GraduationCap className="w-6 h-6 text-green-200" />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl lg:text-4xl font-bold text-white mb-1">
                        {(stats.totalStudents / 1000).toFixed(1)}K
                      </div>
                      <div className="text-green-200 text-sm font-medium">
                        {t("students")}
                      </div>
                    </div>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-green-400 to-green-300 rounded-full"></div>
                </div>
              </div>

              {/* Accreditation Stats */}
              <div className="group relative">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-400/20 rounded-xl flex items-center justify-center group-hover:bg-purple-400/30 transition-colors duration-300">
                      <Award className="w-6 h-6 text-purple-200" />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl lg:text-4xl font-bold text-white mb-1">
                        {stats.activeAccreditations}
                      </div>
                      <div className="text-purple-200 text-sm font-medium">
                        {t("accreditation")}
                      </div>
                    </div>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-purple-400 to-purple-300 rounded-full"></div>
                </div>
              </div>

              {/* Assets Stats */}
              <div className="group relative">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-red-400/20 rounded-xl flex items-center justify-center group-hover:bg-red-400/30 transition-colors duration-300">
                      <Package className="w-6 h-6 text-red-200" />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl lg:text-4xl font-bold text-white mb-1">
                        {stats.totalAssets}
                      </div>
                      <div className="text-red-200 text-sm font-medium">
                        {t("totalAssets")}
                      </div>
                    </div>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-red-400 to-red-300 rounded-full"></div>
                </div>
              </div>

              {/* Faculties Stats */}
              <div className="group relative">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-orange-400/20 rounded-xl flex items-center justify-center group-hover:bg-orange-400/30 transition-colors duration-300">
                      <Building2 className="w-6 h-6 text-orange-200" />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl lg:text-4xl font-bold text-white mb-1">
                        {stats.totalFaculties}
                      </div>
                      <div className="text-orange-200 text-sm font-medium">
                        Faculties
                      </div>
                    </div>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-orange-400 to-orange-300 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/20 to-transparent rounded-full blur-lg"></div>
      </div>

      {/* KPI Overview */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("kpi")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <KPICard
            title={t("professors")}
            value={stats.totalProfessors}
            subtitle="Qualified educators"
            icon={Users}
            color="blue"
          />
          <KPICard
            title={t("students")}
            value={stats.totalStudents.toLocaleString()}
            subtitle="Active enrollment"
            icon={GraduationCap}
            color="green"
          />
          <KPICard
            title={t("accreditation")}
            value={stats.activeAccreditations}
            subtitle="Active programs"
            icon={Award}
            color="purple"
          />
          <KPICard
            title={t("totalAssets")}
            value={stats.totalAssets}
            subtitle="Campus facilities"
            icon={Package}
            color="red"
          />
          <KPICard
            title={t("campusMap")}
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

      {/* Assets Section */}
      <div className="mt-8">
        <AssetsSection />
      </div>
    </div>
  );
};

export default Dashboard;
