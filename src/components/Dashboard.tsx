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
      {/* Professional Hero Section */}
      <div className="relative overflow-hidden rounded-3xl mb-12">
        {/* Main Hero Container */}
        <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
          {/* Background Elements */}
          <div className="absolute inset-0">
            {/* Geometric Pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 1000 600" fill="none">
                <defs>
                  <pattern
                    id="grid"
                    width="50"
                    height="50"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 50 0 L 0 0 0 50"
                      fill="none"
                      stroke="white"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                <circle cx="200" cy="150" r="80" fill="white" opacity="0.05" />
                <circle cx="800" cy="350" r="60" fill="white" opacity="0.05" />
                <polygon
                  points="700,100 750,150 700,200 650,150"
                  fill="white"
                  opacity="0.05"
                />
                <polygon
                  points="150,400 200,450 150,500 100,450"
                  fill="white"
                  opacity="0.05"
                />
              </svg>
            </div>

            {/* Gradient Overlays */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/20 via-transparent to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-500/20 via-transparent to-transparent rounded-full blur-3xl"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 px-8 py-20 lg:px-16 lg:py-28">
            <div className="max-w-6xl mx-auto">
              {/* University Branding */}
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 mb-16">
                {/* Left Side - Logo and Branding */}
                <div className="flex-shrink-0 text-center lg:text-left">
                  <div className="hero-logo inline-flex items-center justify-center w-32 h-32 lg:w-40 lg:h-40 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl mb-6">
                    <img
                      src="/logoupnvj.png"
                      alt="UPNVJ Logo"
                      className="w-20 h-20 lg:w-24 lg:h-24 object-contain filter brightness-0 invert"
                    />
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shimmer-effect">
                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                      <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                        {t("universityShort")}
                      </span>
                    </h1>
                    <div className="h-1 w-24 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mx-auto lg:mx-0 mb-4"></div>
                    <p className="text-blue-100 text-sm font-medium tracking-wider">
                      EST. 1996 • JAKARTA
                    </p>
                  </div>
                </div>

                {/* Right Side - University Info */}
                <div className="flex-1 text-center lg:text-left">
                  <h2 className="text-2xl lg:text-4xl font-bold text-white mb-6 leading-relaxed">
                    {t("universityName")}
                  </h2>

                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-8">
                    <p className="text-xl text-white/90 mb-6 leading-relaxed">
                      {t("internationalProfile")}
                    </p>
                    <p className="text-lg text-white/80 leading-relaxed">
                      {t("heroDescription")}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <button className="group relative px-8 py-4 bg-white text-blue-900 font-semibold rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                      <span className="relative z-10">
                        {t("explorePrograms")}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                    <button className="group relative px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                      <span className="relative z-10">{t("virtualTour")}</span>
                      <div className="absolute inset-0 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                  {/* Professors Stats */}
                  <div className="group hero-stat-card">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 hover:scale-105 transition-all duration-300">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors duration-300 geometric-float">
                          <Users className="w-7 h-7 text-blue-300" />
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">
                          {stats.totalProfessors}
                        </div>
                        <div className="text-blue-200 text-sm font-medium">
                          {t("professors")}
                        </div>
                        <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full mt-3 opacity-60"></div>
                      </div>
                    </div>
                  </div>

                  {/* Students Stats */}
                  <div className="group hero-stat-card">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 hover:scale-105 transition-all duration-300">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-green-500/30 transition-colors duration-300 geometric-float">
                          <GraduationCap className="w-7 h-7 text-green-300" />
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">
                          {(stats.totalStudents / 1000).toFixed(1)}K
                        </div>
                        <div className="text-green-200 text-sm font-medium">
                          {t("students")}
                        </div>
                        <div className="w-full h-1 bg-gradient-to-r from-green-500 to-green-300 rounded-full mt-3 opacity-60"></div>
                      </div>
                    </div>
                  </div>

                  {/* Accreditation Stats */}
                  <div className="group hero-stat-card">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 hover:scale-105 transition-all duration-300">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-colors duration-300 geometric-float">
                          <Award className="w-7 h-7 text-purple-300" />
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">
                          {stats.activeAccreditations}
                        </div>
                        <div className="text-purple-200 text-sm font-medium">
                          {t("accreditation")}
                        </div>
                        <div className="w-full h-1 bg-gradient-to-r from-purple-500 to-purple-300 rounded-full mt-3 opacity-60"></div>
                      </div>
                    </div>
                  </div>

                  {/* Assets Stats */}
                  <div className="group hero-stat-card">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 hover:scale-105 transition-all duration-300">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-14 h-14 bg-red-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-red-500/30 transition-colors duration-300 geometric-float">
                          <Package className="w-7 h-7 text-red-300" />
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">
                          {stats.totalAssets}
                        </div>
                        <div className="text-red-200 text-sm font-medium">
                          {t("totalAssets")}
                        </div>
                        <div className="w-full h-1 bg-gradient-to-r from-red-500 to-red-300 rounded-full mt-3 opacity-60"></div>
                      </div>
                    </div>
                  </div>

                  {/* Faculties Stats */}
                  <div className="group hero-stat-card">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 hover:scale-105 transition-all duration-300">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-14 h-14 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-orange-500/30 transition-colors duration-300 geometric-float">
                          <Building2 className="w-7 h-7 text-orange-300" />
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">
                          {stats.totalFaculties}
                        </div>
                        <div className="text-orange-200 text-sm font-medium">
                          Faculties
                        </div>
                        <div className="w-full h-1 bg-gradient-to-r from-orange-500 to-orange-300 rounded-full mt-3 opacity-60"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
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
