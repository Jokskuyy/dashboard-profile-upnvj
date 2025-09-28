import React from "react";
import {
  Users,
  Award,
  GraduationCap,
  MapPin,
  Building2,
  Package,
  Sparkles,
  TrendingUp,
  Globe,
  Star,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section with Organic Layout */}
        <section id="home" className="relative overflow-hidden pt-8 lg:pt-12">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-blue-800 to-slate-900"></div>
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}></div>
            </div>
          </div>

          <div className="relative px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="max-w-7xl mx-auto">
              {/* Floating Hero Cards Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Main Hero Content - Asymmetric */}
                <div className="lg:col-span-7 space-y-8">
                  {/* University Badge */}
                  <div className="inline-flex items-center bg-white/10 backdrop-blur-lg rounded-full px-6 py-3 border border-white/20">
                    <Star className="w-5 h-5 text-yellow-400 mr-2" />
                    <span className="text-white font-medium">Excellence in Education Since 1996</span>
                  </div>

                  {/* Main Title with Dynamic Typography */}
                  <div className="space-y-6">
                    <h1 className="text-5xl lg:text-7xl font-bold">
                      <span className="block text-white leading-tight">
                        UPN Veteran
                      </span>
                      <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
                        Jakarta
                      </span>
                    </h1>
                    
                    <div className="flex items-center space-x-4">
                      <div className="h-1 w-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                      <p className="text-xl text-blue-100 font-light">
                        Where Innovation Meets Excellence
                      </p>
                    </div>
                  </div>

                  {/* Dynamic Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-16 lg:mb-24">
                    <button className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                      <span className="relative z-10 flex items-center">
                        <Sparkles className="w-5 h-5 mr-2" />
                        Explore Programs
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                    
                    <button className="group border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-semibold backdrop-blur-sm hover:bg-white/10 transition-all duration-300 flex items-center">
                      <Globe className="w-5 h-5 mr-2" />
                      Virtual Tour
                    </button>
                  </div>
                </div>

                {/* Floating Logo Card */}
                <div className="lg:col-span-5 flex justify-center lg:justify-end">
                  <div className="relative">
                    {/* Animated Ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-blue-400/30 animate-spin" style={{ animationDuration: '20s' }}></div>
                    <div className="absolute inset-2 rounded-full border-2 border-purple-400/30 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
                    
                    {/* Logo Container */}
                    <div className="relative bg-white/10 backdrop-blur-2xl rounded-full p-12 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110">
                      <img
                        src="/logoupnvj.png"
                        alt="UPNVJ Logo"
                        className="w-32 h-32 lg:w-40 lg:h-40 object-contain filter brightness-0 invert"
                      />
                    </div>
                    
                    {/* Floating Particles */}
                    <div className="absolute -top-4 -right-4 w-4 h-4 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="absolute -bottom-4 -left-4 w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1/2 -left-8 w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Modern Stats Section with Organic Grid */}
        <section className="relative px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="max-w-7xl mx-auto">
            {/* Floating Stats Container */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 lg:p-8 -mt-20 lg:-mt-28 relative z-20">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">University at a Glance</h2>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
              </div>

              {/* Asymmetric Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {/* Professor Stats - Large Card */}
                <div className="md:col-span-1 lg:row-span-1">
                  <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                    <Users className="w-8 h-8 mb-4 relative z-10" />
                    <div className="text-3xl font-bold mb-1">{stats.totalProfessors}</div>
                    <div className="text-blue-100 text-sm">Expert Professors</div>
                  </div>
                </div>

                {/* Students Stats */}
                <div className="md:col-span-1 lg:row-span-1">
                  <div className="group relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8"></div>
                    <GraduationCap className="w-8 h-8 mb-4 relative z-10" />
                    <div className="text-3xl font-bold mb-1">{(stats.totalStudents / 1000).toFixed(1)}K</div>
                    <div className="text-green-100 text-sm">Active Students</div>
                  </div>
                </div>

                {/* Accreditation Stats */}
                <div className="md:col-span-1 lg:row-span-1">
                  <div className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <div className="absolute top-0 left-0 w-12 h-12 bg-white/10 rounded-full -ml-6 -mt-6"></div>
                    <Award className="w-8 h-8 mb-4 relative z-10" />
                    <div className="text-3xl font-bold mb-1">{stats.activeAccreditations}</div>
                    <div className="text-purple-100 text-sm">Accreditations</div>
                  </div>
                </div>

                {/* Assets Stats */}
                <div className="md:col-span-1 lg:row-span-1">
                  <div className="group relative overflow-hidden bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <div className="absolute bottom-0 right-0 w-14 h-14 bg-white/10 rounded-full -mr-7 -mb-7"></div>
                    <Package className="w-8 h-8 mb-4 relative z-10" />
                    <div className="text-3xl font-bold mb-1">{stats.totalAssets}</div>
                    <div className="text-red-100 text-sm">Campus Assets</div>
                  </div>
                </div>

                {/* Faculties Stats */}
                <div className="md:col-span-1 lg:row-span-1">
                  <div className="group relative overflow-hidden bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <div className="absolute top-1/2 left-0 w-10 h-10 bg-white/10 rounded-full -ml-5 -mt-5"></div>
                    <Building2 className="w-8 h-8 mb-4 relative z-10" />
                    <div className="text-3xl font-bold mb-1">{stats.totalFaculties}</div>
                    <div className="text-orange-100 text-sm">Faculties</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content with Modern Layout */}
        <section id="content" className="px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
          <div className="max-w-7xl mx-auto">
            {/* Masonry-style Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column - Primary Content */}
              <div className="lg:col-span-8 space-y-8">
                {/* Students Section - Full Width */}
                <div id="students" className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden">
                  <StudentsSection />
                </div>

                {/* Assets Section - Full Width */}
                <div id="assets" className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden">
                  <AssetsSection />
                </div>
              </div>

              {/* Right Column - Secondary Content */}
              <div className="lg:col-span-4 space-y-8">
                {/* Professors Section */}
                <div id="professors" className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden transform hover:scale-105 transition-all duration-300">
                  <ProfessorsSection />
                </div>

                {/* Accreditation Section */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden transform hover:scale-105 transition-all duration-300">
                  <AccreditationSection />
                </div>
              </div>
            </div>

            {/* Campus Map Section - Special Layout */}
            <div className="mt-12">
              <div id="campus-map" className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                <CampusMapSection />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
