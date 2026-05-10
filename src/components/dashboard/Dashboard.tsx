import React, { useState, useEffect, useMemo } from "react";
import {
  Award,
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
  AccreditationSection,
  CampusMapSection,
  AssetsSection,
} from "./sections";
import TrafficOverview from "../analytics/TrafficOverview";
import { trackClick, trackCarousel } from "../analytics/trackingHelpers";

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
  const heroImages = useMemo(() => [
    `${basePath}hero1.jpg`,
    `${basePath}hero2.jpg`,
    "https://assets.promediateknologi.id/crop/0x0:0x0/0x0/webp/photo/p3/63/2024/12/07/IMG_20241207_150258-1141876672.jpg",
  ], [basePath]);

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [heroImages.length]);

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
    <div className="overflow-x-hidden">
      {/* Simple Hero Section with Carousel - Responsive Height */}
      <div className="relative overflow-hidden h-[90vh] pt-20 w-full">
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
            <div className="absolute inset-0 bg-black/60"></div>
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
                    scrollToSection("assets-section");
                  }}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-[#2C5F2D] font-bold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
                >
                  {t("explorePrograms")}
                </button>
                <button
                  onClick={() => {
                    trackClick("virtual-tour-hero");
                    scrollToSection("campus-map-section");
                  }}
                  className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white font-bold rounded-lg sm:rounded-xl hover:bg-white/15 transition-all duration-200 text-sm sm:text-base"
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

        {/* Assets Section */}
        {!loading && (
          <div id="assets-section" className="mb-8">
            <AssetsSection />
          </div>
        )}

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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KPICard
                  title={t("accreditation")}
                  value={stats.activeAccreditations}
                  subtitle={t("activePrograms")}
                  icon={Award}
                  color="gold"
                />
                <KPICard
                  title={t("totalAssets")}
                  value={stats.totalAssets}
                  subtitle={t("campusFacilities")}
                  icon={Package}
                  color="slate"
                />
                <KPICard
                  title={t("campusMap")}
                  value="3D"
                  subtitle={t("interactiveMap")}
                  icon={MapPin}
                  color="brown"
                />
              </div>
            </div>
            {/* Detailed Sections */}

            <div className="space-y-8">
              <div id="campus-map-section">
                <CampusMapSection />
              </div>
              <div>
                <AccreditationSection />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
