import React, { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import LanguageToggle from "./LanguageToggle";
import logoUpnvj from "../../assets/images/logoupnvj.png";
import { Menu, X, Home, Users, Award, MapPin, Package } from "lucide-react";

const Header: React.FC = () => {
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

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
              isScrolled ? "py-3" : "py-6"
            }`}
          >
            {/* Logo Section */}
            <div className="flex items-center space-x-4 group">
              <img
                src={logoUpnvj}
                alt="UPNVJ Logo"
                className={`object-contain transition-all duration-300 transform group-hover:scale-110 ${
                  isScrolled ? "w-10 h-10" : "w-14 h-14"
                }`}
              />
              <div className="hidden md:block">
                <h1
                  className={`font-bold text-white drop-shadow-lg leading-tight transition-all duration-300 ${
                    isScrolled ? "text-lg" : "text-xl"
                  }`}
                >
                  {t("universityShort")}
                </h1>
                <p
                  className={`text-yellow-200 drop-shadow transition-all duration-300 ${
                    isScrolled ? "text-xs" : "text-sm"
                  }`}
                >
                  {t("heroDescription").split(" • ")[0]}
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {[
                { id: "home", label: t("home"), icon: Home },
                { id: "professors", label: t("professors"), icon: Users },
                { id: "students", label: t("students"), icon: Award },
                { id: "assets", label: t("totalAssets"), icon: Package },
                { id: "campus-map", label: t("campusMap"), icon: MapPin },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl font-medium text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Admin Login Link */}
              <a
                href="/login"
                className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-xl font-medium text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
                <span className="text-sm">Admin</span>
              </a>

              {/* Language Toggle */}
              <div className="transition-all duration-300">
                <LanguageToggle />
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-white hover:bg-white/10 transition-all duration-300"
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

      {/* Mobile Navigation Menu */}
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

        {/* Menu Panel */}
        <div
          className={`absolute top-0 right-0 w-80 h-full bg-[#2C5F2D] shadow-2xl transform transition-transform duration-300 ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-6 pt-20">
            <nav className="space-y-2">
              {[
                { id: "home", label: t("home"), icon: Home },
                { id: "professors", label: t("facultyStaff"), icon: Users },
                { id: "students", label: t("studentLife"), icon: Award },
                { id: "assets", label: t("totalAssets"), icon: Package },
                { id: "campus-map", label: t("virtualCampus"), icon: MapPin },
              ].map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-white hover:bg-white/10 transition-all duration-300 fade-in-up stagger-${
                    index + 1
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="mt-8 pt-6 border-t border-white/20">
              <div className="text-center">
                <img
                  src={logoUpnvj}
                  alt="UPNVJ Logo"
                  className="w-16 h-16 mx-auto mb-3 object-contain"
                />
                <h3 className="text-lg font-bold text-white mb-1">
                  {t("universityShort")}
                </h3>
                <p className="text-sm text-yellow-200">
                  {t("footer.excellenceSince1996")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
