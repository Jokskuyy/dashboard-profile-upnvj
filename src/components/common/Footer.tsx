import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Youtube,
  ExternalLink,
  Clock,
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import logoUpnvjText from "../../assets/images/logo-upnvj-text.webp";

const Footer: React.FC = () => {
  const { t } = useLanguage();

  const studentLinks = [
    {
      label: { id: "Penerimaan Mahasiswa Baru", en: "New Student Admission" },
      href: "http://penmaru.upnvj.ac.id/",
    },
    {
      label: {
        id: "Sistem Informasi Akademik",
        en: "Academic Information System",
      },
      href: "http://akademik.upnvj.ac.id/",
    },
  ];

  const lecturerLinks = [
    {
      label: { id: "Situs Dosen UPNVJ", en: "UPNVJ Lecturer Portal" },
      href: "http://dosen.upnvj.ac.id/",
    },
  ];

  const facilityLinks = [
    {
      label: { id: "Perpustakaan", en: "Library" },
      href: "http://perpustakaan.upnvj.ac.id/",
    },
    {
      label: { id: "LeADS UPNVJ", en: "LeADS UPNVJ" },
      href: "https://leads.upnvj.ac.id/",
    },
    {
      label: { id: "ULT UPNVJ", en: "ULT UPNVJ" },
      href: "https://wa.me/6285184554123",
    },
  ];

  const institutionLinks = [
    { label: "LP3M", href: "http://lp3m.upnvj.ac.id/" },
    { label: "LPPM", href: "http://lppm.upnvj.ac.id/" },
    {
      label: { id: "Biro Akademik", en: "Academic Bureau" },
      href: "http://bak.upnvj.ac.id/",
    },
    {
      label: {
        id: "Biro Kerjasama & Kemahasiswaan",
        en: "Cooperation & Student Affairs",
      },
      href: "http://kermawa.upnvj.ac.id/",
    },
    {
      label: { id: "Pusat Komputer", en: "Computer Center" },
      href: "http://puskom.upnvj.ac.id/",
    },
  ];

  // Get language-aware label
  const lang = t("language") === "Bahasa" ? "id" : "en";
  const getLabel = (
    label: string | { id: string; en: string }
  ): string => {
    if (typeof label === "string") return label;
    return label[lang] || label.id;
  };

  return (
    <footer className="bg-[#2C5F2D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* ─── Column 1: Logo + Contact + Social + Hours ─── */}
          <div>
            {/* Logo */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-block mb-5"
            >
              <img
                src={logoUpnvjText}
                alt="UPN Veteran Jakarta"
                className="h-14 object-contain"
              />
            </a>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3 group">
                <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center border border-yellow-400/30 flex-shrink-0">
                  <MapPin className="w-4 h-4 text-yellow-300" />
                </div>
                <p className="text-white/80 text-xs leading-relaxed">
                  Jl. RS. Fatmawati, Pondok Labu, Jakarta Selatan, 12450
                </p>
              </div>

              <div className="flex items-center gap-3 group">
                <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center border border-yellow-400/30 flex-shrink-0">
                  <Mail className="w-4 h-4 text-yellow-300" />
                </div>
                <a
                  href="mailto:fik@upnvj.ac.id"
                  className="text-white/80 text-xs hover:text-white transition-colors"
                >
                  fik@upnvj.ac.id
                </a>
              </div>

              <div className="flex items-center gap-3 group">
                <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center border border-yellow-400/30 flex-shrink-0">
                  <Phone className="w-4 h-4 text-yellow-300" />
                </div>
                <span className="text-white/80 text-xs">
                  +62 851-8455-4123
                </span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex gap-3 mb-6">
              <a
                href="https://www.instagram.com/fikupnvj/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/15 text-white/70 hover:text-yellow-300 hover:bg-white/20 transition-all duration-200"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.youtube.com/@fikupnvj"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/15 text-white/70 hover:text-yellow-300 hover:bg-white/20 transition-all duration-200"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>

            {/* Operational Hours */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-yellow-300" />
                {lang === "id" ? "Waktu Operasional" : "Operating Hours"}
              </h3>
              <div className="text-[11px] text-white/70 space-y-1 leading-relaxed">
                <p className="font-semibold text-white/90">
                  {lang === "id"
                    ? "Senin – Kamis, 08.00 – 16.00 WIB"
                    : "Mon – Thu, 08:00 – 16:00 WIB"}
                </p>
                <p>
                  {lang === "id"
                    ? "(Istirahat 12.00 – 13.00 WIB)"
                    : "(Break 12:00 – 13:00 WIB)"}
                </p>
                <p className="font-semibold text-white/90">
                  {lang === "id"
                    ? "Jumat, 08.00 – 16.30 WIB"
                    : "Fri, 08:00 – 16:30 WIB"}
                </p>
                <p>
                  {lang === "id"
                    ? "(Istirahat 11.30 – 13.00 WIB)"
                    : "(Break 11:30 – 13:00 WIB)"}
                </p>
              </div>
            </div>
          </div>

          {/* ─── Column 2: Mahasiswa + Dosen ─── */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">
              {lang === "id" ? "Mahasiswa" : "Students"}
            </h3>
            <div className="space-y-2 mb-6">
              {studentLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-white/70 hover:text-white text-xs transition-all duration-300 transform hover:translate-x-2 group"
                >
                  <div className="w-1 h-1 bg-yellow-400 rounded-full mr-3 group-hover:w-2 transition-all duration-300 flex-shrink-0" />
                  <span>{getLabel(link.label)}</span>
                  <ExternalLink className="w-3 h-3 ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </a>
              ))}
            </div>

            <h3 className="text-sm font-semibold text-white mb-4">
              {lang === "id" ? "Dosen" : "Lecturers"}
            </h3>
            <div className="space-y-2">
              {lecturerLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-white/70 hover:text-white text-xs transition-all duration-300 transform hover:translate-x-2 group"
                >
                  <div className="w-1 h-1 bg-yellow-400 rounded-full mr-3 group-hover:w-2 transition-all duration-300 flex-shrink-0" />
                  <span>{getLabel(link.label)}</span>
                  <ExternalLink className="w-3 h-3 ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>

          {/* ─── Column 3: Fasilitas + Institusi ─── */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">
              {lang === "id" ? "Fasilitas" : "Facilities"}
            </h3>
            <div className="space-y-2 mb-6">
              {facilityLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-white/70 hover:text-white text-xs transition-all duration-300 transform hover:translate-x-2 group"
                >
                  <div className="w-1 h-1 bg-yellow-400 rounded-full mr-3 group-hover:w-2 transition-all duration-300 flex-shrink-0" />
                  <span>{getLabel(link.label)}</span>
                  <ExternalLink className="w-3 h-3 ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </a>
              ))}
            </div>

            <h3 className="text-sm font-semibold text-white mb-4">
              {lang === "id" ? "Institusi" : "Institution"}
            </h3>
            <div className="space-y-2">
              {institutionLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-white/70 hover:text-white text-xs transition-all duration-300 transform hover:translate-x-2 group"
                >
                  <div className="w-1 h-1 bg-yellow-400 rounded-full mr-3 group-hover:w-2 transition-all duration-300 flex-shrink-0" />
                  <span>{getLabel(link.label)}</span>
                  <ExternalLink className="w-3 h-3 ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>

          {/* ─── Column 4: Google Maps ─── */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Maps</h3>
            <div className="rounded-xl overflow-hidden border border-white/15">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.6005846073967!2d106.79277181476974!3d-6.3160819954289575!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ee229acb972d%3A0x2e74d2fa25f612e2!2sFaculty%20of%20Computer%20Sciance%20-%20Pembangunan%20Nasional%20%22Veteran%22%20Jakarta%20University!5e0!3m2!1sen!2sid!4v1616120323035!5m2!1sen!2sid"
                width="100%"
                height="260"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="FIK UPNVJ Location"
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* ─── Bottom Section ─── */}
        <div className="border-t border-white/20 mt-12 md:mt-16 pt-6 md:pt-8">
          <p className="text-center text-white/60 text-xs">
            Copyright ©{new Date().getFullYear()} Fakultas Ilmu Komputer UPN
            Veteran Jakarta
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
