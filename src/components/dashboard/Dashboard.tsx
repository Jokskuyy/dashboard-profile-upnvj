import React, { useState, useEffect } from "react";
import {
  Users,
  Award,
  GraduationCap,
  MapPin,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { KPICardSkeleton, SectionSkeleton } from "../common/SkeletonLoader";
import { useLanguage } from "../../contexts/LanguageContext";
import { useDashboard, useStats } from "../../contexts/DashboardContext";
import KPICard from "./KPICard";
import {
  ProfessorsSection,
  AccreditationSection,
  StudentsSection,
  CampusMapSection,
  AssetsSection,
} from "./sections";
import TrafficOverview from "../analytics/TrafficOverview";
import { trackClick, trackCarousel } from "../analytics/Analytics";

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const { loading } = useDashboard();
  const stats = useStats();

  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 1024 : false
  );

  // Check if mobile/tablet on mount and resize (< 1024px = lg breakpoint)
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint for tablets too
      console.log(
        "Window width:",
        window.innerWidth,
        "isMobile/Tablet:",
        mobile
      );
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Scroll to section function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };
  const basePath = import.meta.env.BASE_URL;
  const heroImages = [
    `${basePath}hero1.jpg`,
    `${basePath}hero2.jpg`,
    "https://assets.promediateknologi.id/crop/0x0:0x0/0x0/webp/photo/p3/63/2024/12/07/IMG_20241207_150258-1141876672.jpg",
  ];

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    const newSlide = (currentSlide + 1) % heroImages.length;
    setCurrentSlide(newSlide);
    trackCarousel("next", newSlide);
  };

  const prevSlide = () => {
    const newSlide = (currentSlide - 1 + heroImages.length) % heroImages.length;
    setCurrentSlide(newSlide);
    trackCarousel("prev", newSlide);
  };

  return (
    <div>
      {/* Simple Hero Section with Carousel - Responsive Height */}
      <div className="relative overflow-hidden h-[60vh] sm:h-[65vh] md:h-[70vh] lg:h-[75vh]">
        {/* Image Carousel */}
        {/* Image Carousel */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image}
              alt={`UPNVJ Campus ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Dark Overlay for Readability */}
            <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-black/30"></div>
          </div>
        ))}

        {/* Hero Content Overlay */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16 w-full">
            <div className="max-w-3xl">
              {/* Logo */}
              <div className="mb-6 sm:mb-8">
                <img
                  src={`${basePath}logoupnvj.webp`}
                  alt="UPNVJ Logo"
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain drop-shadow-2xl"
                />
              </div>

              {/* University Name */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 drop-shadow-lg">
                {t("universityShort")}
              </h1>

              <div className="h-1 sm:h-1.5 w-24 sm:w-32 bg-linear-to-r from-yellow-400 to-yellow-600 rounded-full mb-4 sm:mb-6"></div>

              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-white/95 mb-4 sm:mb-6 drop-shadow-md">
                {t("universityName")}
              </h2>

              <p className="text-base sm:text-lg md:text-xl text-white/90 mb-3 sm:mb-4 drop-shadow-md leading-relaxed">
                {t("internationalProfile")}
              </p>

              <p className="text-sm sm:text-base md:text-lg text-white/80 mb-6 sm:mb-8 drop-shadow leading-relaxed max-w-2xl">
                {t("heroDescription")}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                <button
                  onClick={() => {
                    trackClick("explore-programs-hero");
                    scrollToSection("students-section");
                  }}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-[#2C5F2D] font-bold rounded-lg sm:rounded-xl shadow-xl hover:shadow-2xl hover:bg-yellow-50 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
                >
                  {t("explorePrograms")}
                </button>
                <button
                  onClick={() => {
                    trackClick("virtual-tour-hero");
                    scrollToSection("campus-map-section");
                  }}
                  className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white font-bold rounded-lg sm:rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all duration-300 text-sm sm:text-base"
                >
                  {t("virtualTour")}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows - Responsive positioning (mobile/tablet bottom, desktop center) */}
        <button
          onClick={() => {
            console.log("Prev button clicked, isMobile/Tablet:", isMobile);
            prevSlide();
          }}
          className="absolute z-20 w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-12 lg:h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110"
          style={{
            left: isMobile ? "0.5rem" : "1.5rem",
            bottom: isMobile ? "1rem" : "auto",
            top: isMobile ? "auto" : "50%",
            transform: isMobile ? "none" : "translateY(-50%)",
            transition: "all 300ms",
          }}
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>
        <button
          onClick={() => {
            console.log("Next button clicked, isMobile/Tablet:", isMobile);
            nextSlide();
          }}
          className="absolute z-20 w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-12 lg:h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110"
          style={{
            right: isMobile ? "0.5rem" : "1.5rem",
            bottom: isMobile ? "1rem" : "auto",
            top: isMobile ? "auto" : "50%",
            transform: isMobile ? "none" : "translateY(-50%)",
            transition: "all 300ms",
          }}
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2 sm:space-x-3">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentSlide(index);
                trackCarousel("indicator", index);
              }}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-white w-6 sm:w-8"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Traffic Overview */}
        <TrafficOverview />

        {/* Loading state with skeletons */}
        {loading && (
          <>
            <div className="mb-8">
              <div className="h-7 w-32 bg-gray-200 rounded mb-6 animate-pulse"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <KPICardSkeleton key={i} />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <SectionSkeleton items={4} />
              <SectionSkeleton items={4} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SectionSkeleton items={3} />
              <SectionSkeleton items={3} />
            </div>
          </>
        )}

        {/* KPI Overview - Only show when data is loaded */}
        {!loading && stats && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t("kpi")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <KPICard
                  title={t("professors")}
                  value={stats.totalProfessors}
                  subtitle={t("qualifiedEducators")}
                  icon={Users}
                  color="blue"
                />
                <KPICard
                  title={t("students")}
                  value={stats.totalStudents.toLocaleString()}
                  subtitle={t("activeEnrollment")}
                  icon={GraduationCap}
                  color="green"
                />
                <KPICard
                  title={t("accreditation")}
                  value={stats.activeAccreditations}
                  subtitle={t("activePrograms")}
                  icon={Award}
                  color="purple"
                />
                <KPICard
                  title={t("totalAssets")}
                  value={stats.totalAssets}
                  subtitle={t("campusFacilities")}
                  icon={Package}
                  color="red"
                />
                <KPICard
                  title={t("campusMap")}
                  value="3D"
                  subtitle={t("interactiveMap")}
                  icon={MapPin}
                  color="orange"
                />
              </div>
            </div>
            {/* Detailed Sections */}
            <div
              id="professors-section"
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
            >
              <ProfessorsSection />
              <AccreditationSection />
            </div>
            <div
              id="students-section"
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              <StudentsSection />
              <div id="campus-map-section">
                <CampusMapSection />
              </div>
            </div>
            {/* Assets Section */}
            <div id="assets-section" className="mt-8">
              <AssetsSection />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
