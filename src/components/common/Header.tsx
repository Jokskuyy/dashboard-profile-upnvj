import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import LanguageToggle from "./LanguageToggle";
import logoUpnvjText from "../../assets/images/logo-upnvj-text.webp";
import { Menu, X, Home, MapPin, Package, KeyRound } from "lucide-react";

const NAV_ITEMS = [
  { id: "home", labelKey: "home", icon: Home },
  { id: "assets-section", labelKey: "assets", icon: Package },
  { id: "campus-map-section", labelKey: "campusMap", icon: MapPin },
] as const;

const Header: React.FC = () => {
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Track scroll position for header shrink + active section
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Determine active section based on scroll position
      const scrollY = window.scrollY + 120;
      let current = "home";
      for (const item of NAV_ITEMS) {
        if (item.id === "home") continue;
        const el = document.getElementById(item.id);
        if (el && el.offsetTop <= scrollY) {
          current = item.id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = useCallback(
    (sectionId: string) => {
      if (sectionId === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const element = document.getElementById(sectionId);
        if (element) {
          const headerOffset = 80; // fixed header height + breathing room
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: elementPosition - headerOffset,
            behavior: "smooth",
          });
        }
      }
      setIsMobileMenuOpen(false);
    },
    [],
  );

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-[#2C5F2D] ${
          isScrolled ? "shadow-lg" : "shadow-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex justify-between items-center transition-all duration-300 ${
              isScrolled ? "py-3" : "py-4"
            }`}
          >
            {/* Logo */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center group"
            >
              <img
                src={logoUpnvjText}
                alt="UPN Veteran Jakarta"
                className={`object-contain transition-all duration-300 group-hover:brightness-110 ${
                  isScrolled ? "h-12" : "h-14"
                }`}
              />
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      isActive
                        ? "text-white bg-white/15"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm">{t(item.labelKey)}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              {/* Admin Login Link (desktop) */}
              <Link
                to="/login"
                className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-xl font-medium text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                <KeyRound className="w-4 h-4" />
                <span className="text-sm">Admin</span>
              </Link>

              {/* Language Toggle */}
              <LanguageToggle />

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-white hover:bg-white/10 transition-all duration-300"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Mobile Navigation Drawer ─── */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Slide-in Panel */}
        <div
          className={`absolute top-0 right-0 w-[280px] h-full bg-[#2C5F2D] shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Panel Header with close button */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/15">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
                setIsMobileMenuOpen(false);
              }}
            >
              <img
                src={logoUpnvjText}
                alt="UPNVJ"
                className="h-11 object-contain"
              />
            </a>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map((item, index) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  style={{ animationDelay: `${index * 60}ms` }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isMobileMenuOpen ? "animate-fadeSlideIn" : ""
                  } ${
                    isActive
                      ? "text-white bg-white/15 shadow-sm"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isActive
                        ? "bg-yellow-400/25 border border-yellow-300/30"
                        : "bg-white/10"
                    }`}
                  >
                    <item.icon
                      className={`w-4 h-4 ${isActive ? "text-yellow-300" : "text-white/70"}`}
                    />
                  </div>
                  <span className="text-sm">{t(item.labelKey)}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                  )}
                </button>
              );
            })}

            {/* Admin link (mobile) */}
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
              style={{ animationDelay: `${NAV_ITEMS.length * 60}ms` }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/10">
                <KeyRound className="w-4 h-4 text-white/70" />
              </div>
              <span className="text-sm">Admin Panel</span>
            </Link>
          </nav>

          {/* Bottom Branding */}
          <div className="px-5 py-4 border-t border-white/15">
            <p className="text-[11px] text-white/40 text-center leading-relaxed">
              Fakultas Ilmu Komputer
              <br />
              UPN Veteran Jakarta
            </p>
          </div>
        </div>
      </div>

      {/* Keyframe for fade-slide animation */}
      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateX(12px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fadeSlideIn {
          animation: fadeSlideIn 0.3s ease-out both;
        }
      `}</style>
    </>
  );
};

export default Header;
