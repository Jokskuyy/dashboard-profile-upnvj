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

  const basePath = import.meta.env.BASE_URL;
  const heroImages = useMemo(
    () => [
      `${basePath}hero1.jpg`,
      `${basePath}hero2.jpg`,
      "https://assets.promediateknologi.id/crop/0x0:0x0/0x0/webp/photo/p3/63/2024/12/07/IMG_20241207_150258-1141876672.jpg",
    ],
    [basePath],
  );

  // Scroll to section with header offset
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - headerOffset,
        behavior: "smooth",
      });
    }
  };

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const nextSlide = () => {
    const newSlide = (currentSlide + 1) % heroImages.length;
    setCurrentSlide(newSlide);
    trackCarousel("next", newSlide);
  };

  const prevSlide = () => {
    const newSlide =
      (currentSlide - 1 + heroImages.length) % heroImages.length;
    setCurrentSlide(newSlide);
    trackCarousel("prev", newSlide);
  };

  return (
    <div className="overflow-x-hidden">
      {/* ─── Hero Section ─── */}
      <div className="relative overflow-hidden h-[92vh] min-h-[560px] w-full">
        {/* Image Carousel with subtle zoom */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-[1200ms] ease-in-out ${
              index === currentSlide
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }`}
          >
            <img
              src={image}
              alt={`UPNVJ Campus ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        {/* Gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/70 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent z-[1]" />

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center pt-16">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-16 w-full">
            <div className="max-w-2xl">
              {/* Logo */}
              <div
                className="mb-6 hero-fade-up"
                style={{ animationDelay: "0ms" }}
              >
                <img
                  src={`${basePath}logoupnvj.webp`}
                  alt="UPNVJ Logo"
                  className="w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow-2xl"
                />
              </div>

              {/* Main Headline */}
              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-[1.1] mb-4 hero-fade-up"
                style={{ animationDelay: "120ms" }}
              >
                {t("universityName")}
              </h1>

              {/* Accent Line */}
              <div
                className="mb-5 hero-fade-up"
                style={{ animationDelay: "200ms" }}
              >
                <div className="h-1 w-16 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full" />
              </div>

              {/* Subtitle */}
              <p
                className="text-white/75 text-sm sm:text-base md:text-lg leading-relaxed mb-8 max-w-xl hero-fade-up"
                style={{ animationDelay: "300ms" }}
              >
                {t("universityMission").length > 140
                  ? t("universityMission").slice(0, 140) + "..."
                  : t("universityMission")}
              </p>

              {/* CTA Buttons */}
              <div
                className="flex flex-col sm:flex-row gap-3 hero-fade-up"
                style={{ animationDelay: "420ms" }}
              >
                <button
                  onClick={() => {
                    trackClick("explore-programs-hero");
                    scrollToSection("assets-section");
                  }}
                  className="group px-7 py-3.5 bg-white text-[#2C5F2D] font-bold rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 text-sm sm:text-base flex items-center justify-center gap-2"
                >
                  {t("explorePrograms")}
                  <svg
                    className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    trackClick("virtual-tour-hero");
                    scrollToSection("campus-map-section");
                  }}
                  className="px-7 py-3.5 bg-white/10 backdrop-blur-sm border border-white/25 text-white font-bold rounded-xl hover:bg-white/20 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 text-sm sm:text-base"
                >
                  {t("virtualTour")}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Arrows — CSS responsive */}
        <button
          onClick={prevSlide}
          className="absolute z-20 left-3 lg:left-6 bottom-5 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 bg-white/15 hover:bg-white/25 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/10"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute z-20 right-3 lg:right-6 bottom-5 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 bg-white/15 hover:bg-white/25 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/10"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentSlide(index);
                trackCarousel("indicator", index);
              }}
              className={`rounded-full transition-all duration-500 ${
                index === currentSlide
                  ? "w-8 h-2 bg-white"
                  : "w-2 h-2 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Hero entrance animation */}
      <style>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-fade-up {
          animation: heroFadeUp 0.7s ease-out both;
        }
      `}</style>

      {/* ─── Content Container ─── */}
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
