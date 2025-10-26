import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  ExternalLink,
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import logoUpnvj from "../../assets/images/logoupnvj.png";

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="relative overflow-hidden">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1B4332] via-[#2C5F2D] to-[#1B5E20]">
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Floating decorative elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 left-10 w-24 h-24 bg-green-500/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          {/* University Info - Large Section */}
          <div className="lg:col-span-5">
            <div className="flex items-center space-x-3 md:space-x-4 mb-4 md:mb-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/20">
                <img
                  src={logoUpnvj}
                  alt="UPNVJ Logo"
                  className="w-8 h-8 md:w-10 md:h-10 object-contain"
                />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white">
                  {t("universityShort")}
                </h3>
                <p className="text-yellow-200 text-xs md:text-sm">
                  {t("footer.excellenceSince1996")}
                </p>
              </div>
            </div>

            <p className="text-white/90 mb-4 md:mb-6 text-base md:text-lg leading-relaxed">
              {t("universityName")} - {t("internationalProfile")}
            </p>

            <p className="text-white/70 mb-6 md:mb-8 leading-relaxed text-sm md:text-base">
              {t("universityMission")}
            </p>

            {/* Social Media Links */}
            <div className="flex space-x-3 md:space-x-4">
              {[
                { icon: Facebook, href: "#", color: "hover:text-yellow-400" },
                { icon: Instagram, href: "#", color: "hover:text-yellow-300" },
                { icon: Twitter, href: "#", color: "hover:text-yellow-400" },
                { icon: Youtube, href: "#", color: "hover:text-yellow-300" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 text-white/70 ${social.color} transition-all duration-300 transform hover:scale-110 hover:bg-white/20`}
                >
                  <social.icon className="w-4 h-4 md:w-5 md:h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Mobile 2-Column Layout for Contact & Quick Links */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-6 md:gap-8 lg:grid-cols-7 lg:gap-12">
            {/* Contact Information */}
            <div className="col-span-1 lg:col-span-4">
              <h3 className="text-base md:text-xl font-semibold text-white mb-4 md:mb-6 flex items-center">
                <Phone className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                <span className="text-sm md:text-base">
                  {t("footer.contactInformation")}
                </span>
              </h3>
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-start space-x-2 md:space-x-4 group">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-yellow-500/20 rounded-lg md:rounded-xl flex items-center justify-center border border-yellow-400/30 group-hover:bg-yellow-500/30 transition-colors flex-shrink-0">
                    <MapPin className="w-4 h-4 md:w-5 md:h-5 text-yellow-300" />
                  </div>
                  <div>
                    <p className="text-white font-medium mb-1 text-xs md:text-sm">
                      {t("footer.campusAddress")}
                    </p>
                    <p className="text-white/70 text-xs leading-relaxed">
                      {t("footer.address")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2 md:space-x-4 group">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-yellow-500/20 rounded-lg md:rounded-xl flex items-center justify-center border border-yellow-400/30 group-hover:bg-yellow-500/30 transition-colors flex-shrink-0">
                    <Phone className="w-4 h-4 md:w-5 md:h-5 text-yellow-300" />
                  </div>
                  <div>
                    <p className="text-white font-medium mb-1 text-xs md:text-sm">
                      {t("footer.phoneLabel")}
                    </p>
                    <p className="text-white/70 text-xs">{t("footer.phone")}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2 md:space-x-4 group">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-yellow-500/20 rounded-lg md:rounded-xl flex items-center justify-center border border-yellow-400/30 group-hover:bg-yellow-500/30 transition-colors flex-shrink-0">
                    <Mail className="w-4 h-4 md:w-5 md:h-5 text-yellow-300" />
                  </div>
                  <div>
                    <p className="text-white font-medium mb-1 text-xs md:text-sm">
                      {t("email")}
                    </p>
                    <p className="text-white/70 text-xs">{t("footer.email")}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2 md:space-x-4 group">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-yellow-500/20 rounded-lg md:rounded-xl flex items-center justify-center border border-yellow-400/30 group-hover:bg-yellow-500/30 transition-colors flex-shrink-0">
                    <Globe className="w-4 h-4 md:w-5 md:h-5 text-yellow-300" />
                  </div>
                  <div>
                    <p className="text-white font-medium mb-1 text-xs md:text-sm">
                      {t("footer.website")}
                    </p>
                    <a
                      href="https://upnvj.ac.id"
                      className="text-white/70 text-xs hover:text-white transition-colors flex items-center"
                    >
                      upnvj.ac.id
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-span-1 lg:col-span-3">
              <h3 className="text-base md:text-xl font-semibold text-white mb-4 md:mb-6">
                <span className="text-sm md:text-base">
                  {t("footer.quickLinks")}
                </span>
              </h3>
              <div className="space-y-2 md:space-y-3">
                {[
                  t("footer.academicPrograms"),
                  t("footer.researchCenters"),
                  t("footer.internationalRelations"),
                  t("footer.studentServices"),
                  t("footer.libraryServices"),
                  t("footer.careerCenter"),
                  t("totalAssets"),
                  t("footer.alumniNetwork"),
                ].map((link, index) => (
                  <a
                    key={index}
                    href="#"
                    className="flex items-center text-white/70 hover:text-white text-xs md:text-sm transition-all duration-300 transform hover:translate-x-2 group"
                  >
                    <div className="w-1 h-1 bg-yellow-400 rounded-full mr-2 md:mr-3 group-hover:w-2 transition-all duration-300 flex-shrink-0"></div>
                    <span className="line-clamp-1">{link}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 mt-12 md:mt-16 pt-6 md:pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-3 lg:space-y-0">
            <div className="text-center lg:text-left">
              <p className="text-white/70 text-xs md:text-sm">
                {t("footer.copyright")}
              </p>
              <p className="text-white/50 text-xs mt-1">
                {t("footer.developedWith")} {t("footer.forCommunity")}
              </p>
            </div>

            <div className="flex items-center space-x-4 md:space-x-6 text-xs text-white/50">
              <a href="#" className="hover:text-white/70 transition-colors">
                {t("footer.privacyPolicy")}
              </a>
              <span>•</span>
              <a href="#" className="hover:text-white/70 transition-colors">
                {t("footer.termsOfService")}
              </a>
              <span className="hidden sm:inline">•</span>
              <a
                href="#"
                className="hover:text-white/70 transition-colors hidden sm:inline"
              >
                {t("footer.sitemap")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
