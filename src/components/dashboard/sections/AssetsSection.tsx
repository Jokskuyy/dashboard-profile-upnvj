import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "../../../contexts/LanguageContext";

const AssetsSection: React.FC = () => {
  const { t } = useLanguage();
  const [labScrollPosition, setLabScrollPosition] = useState(0);

  const assets = [
    {
      id: 1,
      title: "Campus Buildings",
      icon: "corporate_fare",
      count: "42",
      unit: "Units",
      status: "Good Condition",
      statusColor: "bg-green-100 text-green-700",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      id: 2,
      title: "Operational Vehicles",
      icon: "directions_bus",
      count: "18",
      unit: "Units",
      status: "Maintenance",
      statusColor: "bg-amber-100 text-amber-700",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600"
    },
    {
      id: 3,
      title: "IT & Lab Equipment",
      icon: "devices",
      count: "1,245",
      unit: "Units",
      status: "Optimal",
      statusColor: "bg-green-100 text-green-700",
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      id: 4,
      title: "Land Area",
      icon: "landscape",
      count: "24.5",
      unit: "Hectares",
      status: "Verified",
      statusColor: "bg-blue-100 text-blue-700",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600"
    }
  ];

  const labs = [
    {
      id: 1,
      name: "Anatomy & Physiology Lab",
      faculty: "FIKES",
      location: "Lt. 4",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGwKPi640_OFmHH_LRJG_ykGBxUmG1BFQi4S4MjSeNCXmfJidDNzIepOGE9QYAlrfA34TwZ3RVe2ZqQH47Cni7Ffdes4nVM24BUoh-TUiVPu9L2uHW0qu3HARbM6wM9c8jq4CRCSA-q3NdNQs2mAPTlLB-otkJPEnp-stIy--sLGJCPvbfpltzw7Iz_xoqst3SBUg3mPyFhHjkJJRicpXA50w7t2hCOfHrOBNXfzO1xQynv4f2hCEvS_ZkDCht1IJT6kFig-xQ1fs",
      facultyColor: "bg-[#2C5F2D] text-white"
    },
    {
      id: 2,
      name: "Robotics & IoT Laboratory",
      faculty: "FT",
      location: "Gedung B",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAjZ8_7OKtEz6zAxCopFc1hmw5nvy6WSnxziTFWpKrWxvSuSkVgP7L9y9Ysmfxsl8tbYIF5c-qh6fN-JXoaowo4-J5v2y-lvrdXCb02lfHQUK3tYKWytfwOBRtgk6-fvtIvatVw2vjO0GiHuoxGXkSIKoBeOdNhodiGtcQvZHjBB6RvpT_z2xWknM60yJfIqvw_Gjt0NDa61za15lx5DTzKopRrk9KIEFaI4ppKY-l3awG7Y2zxLiywZsVW_ozHsEF_u5jT4JsTB_s",
      facultyColor: "bg-indigo-100 text-indigo-700"
    },
    {
      id: 3,
      name: "Microbiology Center",
      faculty: "FK",
      location: "Kampus Limo",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBsFj-0KJkBNhkhR-qHc-LJNYvfNePZevcTKauoyVJlBqbNJUifaaCnG7KzHvEgbLwGFBK8ROPZxYQsOlz9HGn6m076kp-bPTs7u5alKduXoo5MdUfqRvtnkIAPHlxyJ0MQupSMM-qNm445wfcW3C1oOo4YdEzeD3GsthDu4S8gN3MSuY2gAe2GX3lYtp-_ort8-wKJZFHyliDSdVdQ7tyDDghS9j_DJ4iruq-CyZEXuvZyWSPhTjAxOKh0AQloq96NHxT1wDPb0i4",
      facultyColor: "bg-sky-100 text-sky-700"
    },
    {
      id: 4,
      name: "Cyber Security & AI Lab",
      faculty: "FIK",
      location: "Gedung Ki Hajar",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC8WgBubWZaiqTdcJ4DBvNyqTBGp4oMOCTB6BdhxAbOYsPj-rAryX1VZbdB6zgkTogioOsPFJZaqeuBmSPQfmAPrlD5UfqrNpWqbetq9d8hQkbcNC8E_AwawxiZpGCGN93GkKK9pnlCIIj5P5q1GKdn0aIYX3qfkP5R7xz-qzXhL6ug43WG9uGEYk6kdNNovxL1dnGdo3y9JJGWpL1k4UPaP6RjWVP6BkacCENKY-JnUHgWcgcHAtM9Cyurt6V14NT-mctdK_zg5fI",
      facultyColor: "bg-fuchsia-100 text-fuchsia-700"
    }
  ];

  const scrollLabs = (direction: 'left' | 'right') => {
    const container = document.getElementById('labs-container');
    if (container) {
      const scrollAmount = 320; // card width + gap
      const newPosition = direction === 'left' 
        ? Math.max(0, labScrollPosition - scrollAmount)
        : Math.min(container.scrollWidth - container.clientWidth, labScrollPosition + scrollAmount);
      
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setLabScrollPosition(newPosition);
    }
  };

  return (
    <div className="space-y-8">
      {/* University Assets Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <span className="material-symbols-outlined text-[#2C5F2D]">account_balance</span>
            {t("assetsTitle") || "University Assets"}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 group hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${asset.iconBg} rounded-xl flex items-center justify-center ${asset.iconColor}`}>
                  <span className="material-symbols-outlined text-3xl">{asset.icon}</span>
                </div>
                <span className={`px-2.5 py-1 ${asset.statusColor} text-[10px] font-bold uppercase rounded-full`}>
                  {asset.status}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{asset.title}</h3>
              <div className="flex items-end justify-between">
                <span className="text-gray-500 text-sm">{asset.unit}</span>
                <span className="text-2xl font-bold text-gray-900">{asset.count}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Laboratories Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <span className="material-symbols-outlined text-[#2C5F2D]">biotech</span>
            Featured Laboratories
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => scrollLabs('left')}
              className="p-2 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-[#2C5F2D] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollLabs('right')}
              className="p-2 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-[#2C5F2D] transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div
          id="labs-container"
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {labs.map((lab) => (
            <div
              key={lab.id}
              className="min-w-[300px] flex-shrink-0 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col group"
            >
              <div className="h-40 overflow-hidden">
                <img
                  alt={lab.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src={lab.image}
                />
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 ${lab.facultyColor} text-[10px] font-bold rounded uppercase`}>
                    {lab.faculty}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <span className="material-icons-round text-sm">room</span> {lab.location}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-4 line-clamp-1">{lab.name}</h3>
                <button className="mt-auto w-full py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  View Details <span className="material-icons-round text-base">arrow_forward</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AssetsSection;
