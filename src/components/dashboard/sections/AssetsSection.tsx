import React, { useState, useEffect } from "react";
import { useLanguage } from "../../../contexts/LanguageContext";
import { supabase } from "../../../lib/supabase";
import FacilityDetailModal from "../../modals/shared/FacilityDetailModal";
import CategoryFacilitiesModal from "../../modals/shared/CategoryFacilitiesModal";
import BuildingsModal from "../../modals/shared/BuildingsModal";

// Interface untuk data gedung dan fasilitas
interface Building {
  id: number;
  nama_gedung: string;
  deskripsi_gedung?: string;
  lokasi?: string;
}

interface FacilityDetail {
  id: number;
  nama_fasilitas: string;
  deskripsi_fasilitas?: string;
  tipe_fasilitas: string;
  color?: string;
  foto_url?: string;
  gedung?: Building;
}

interface AssetCategory {
  name: string;
  icon: string;
  color: string;
  filter: string;
}

const AssetsSection: React.FC = () => {
  const { t } = useLanguage();

  // State untuk data real dari database
  const [buildingsCount, setBuildingsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedFacility, setSelectedFacility] =
    useState<FacilityDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isBuildingsModalOpen, setIsBuildingsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | null>(null);

  // State untuk count berbagai tipe fasilitas
  const [facilityCounts, setFacilityCounts] = useState({
    laboratorium: 0,
    perpustakaan: 0,
    ruangKuliah: 0,
    auditorium: 0,
    olahraga: 0,
    kesehatan: 0,
    ibadah: 0,
    kantin: 0,
  });

  // Fetch data real dari Supabase
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        // Fetch jumlah gedung
        const { count: buildingCount, error: buildingError } = await supabase
          .from("gedung")
          .select("*", { count: "exact", head: true });

        if (!buildingError && buildingCount !== null) {
          setBuildingsCount(buildingCount);
        }

        // Fetch semua fasilitas untuk counting
        const { data: allFacilities, error: countError } = await supabase
          .from("fasilitas")
          .select("tipe_fasilitas");

        if (!countError && allFacilities) {
          const categoryMatchers: Record<string, string[]> = {
            laboratorium:  ["lab"],
            perpustakaan:  ["perpustakaan", "ruang baca"],
            ruangKuliah:   ["ruang kuliah", "ruang kelas"],
            auditorium:    ["auditorium", "aula"],
            olahraga:      ["olahraga", "sport"],
            kesehatan:     ["kesehatan", "klinik"],
            ibadah:        ["ibadah", "masjid", "musholla"],
            kantin:        ["kantin", "food"],
          };

          const counts: Record<string, number> = {};
          for (const key of Object.keys(categoryMatchers)) {
            counts[key] = 0;
          }

          for (const f of allFacilities) {
            const tipe = f.tipe_fasilitas?.toLowerCase() ?? "";
            for (const [key, keywords] of Object.entries(categoryMatchers)) {
              if (keywords.some((kw: string) => tipe.includes(kw))) {
                counts[key]++;
              }
            }
          }

          setFacilityCounts(counts as typeof facilityCounts);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching real data:", error);
        setLoading(false);
      }
    };

    fetchRealData();
  }, []);

  const handleFacilityClick = (facility: FacilityDetail) => {
    setSelectedFacility(facility);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedFacility(null), 300);
  };

  const handleCategoryClick = (category: AssetCategory) => {
    setSelectedCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleCloseCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setTimeout(() => setSelectedCategory(null), 300);
  };

  const handleBuildingsClick = () => {
    setIsBuildingsModalOpen(true);
  };

  const handleCloseBuildingsModal = () => {
    setIsBuildingsModalOpen(false);
  };

  const assets = [
    {
      id: 1,
      title: t("campusBuildings"),
      icon: "corporate_fare",
      count: buildingsCount.toString(),
      unit: t("buildingsUnit"),
      status: t("operational"),
      statusColor: "bg-green-100 text-green-700",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      clickable: true,
      isBuildings: true,
    },
    {
      id: 2,
      title: t("laboratoriesTitle"),
      icon: "biotech",
      count: facilityCounts.laboratorium.toString(),
      unit: t("labsUnit"),
      status: t("activeStatus"),
      statusColor: "bg-green-100 text-green-700",
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      clickable: true,
      category: {
        name: "Laboratorium",
        icon: "biotech",
        color: "bg-[#2C5F2D]",
        filter: "Laboratorium",
      },
    },
    {
      id: 3,
      title: t("librariesReadingRooms"),
      icon: "local_library",
      count: facilityCounts.perpustakaan.toString(),
      unit: t("facilitiesUnit"),
      status: t("available"),
      statusColor: "bg-green-100 text-green-700",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      clickable: true,
      category: {
        name: "Perpustakaan & Ruang Baca",
        icon: "local_library",
        color: "bg-[#1B4332]",
        filter: "Perpustakaan",
      },
    },
    {
      id: 4,
      title: t("classrooms"),
      icon: "school",
      count: facilityCounts.ruangKuliah.toString(),
      unit: t("roomsUnit"),
      status: t("ready"),
      statusColor: "bg-blue-100 text-blue-700",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      clickable: true,
      category: {
        name: "Ruang Kuliah",
        icon: "school",
        color: "bg-amber-700",
        filter: "Ruang Kuliah",
      },
    },
    {
      id: 5,
      title: t("auditoriumsHalls"),
      icon: "theater_comedy",
      count: facilityCounts.auditorium.toString(),
      unit: t("venuesUnit"),
      status: t("available"),
      statusColor: "bg-purple-100 text-purple-700",
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      clickable: true,
      category: {
        name: "Auditorium & Aula",
        icon: "theater_comedy",
        color: "bg-slate-700",
        filter: "Auditorium",
      },
    },
    {
      id: 6,
      title: t("sportsFacilities"),
      icon: "sports_soccer",
      count: facilityCounts.olahraga.toString(),
      unit: t("facilitiesUnit"),
      status: t("activeStatus"),
      statusColor: "bg-indigo-100 text-indigo-700",
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
      clickable: true,
      category: {
        name: "Fasilitas Olahraga",
        icon: "sports_soccer",
        color: "bg-teal-700",
        filter: "Olahraga",
      },
    },
    {
      id: 7,
      title: t("healthFacilities"),
      icon: "medical_services",
      count: facilityCounts.kesehatan.toString(),
      unit: t("facilitiesUnit"),
      status: t("operational"),
      statusColor: "bg-red-100 text-red-700",
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
      clickable: true,
      category: {
        name: "Fasilitas Kesehatan",
        icon: "medical_services",
        color: "bg-red-700",
        filter: "Kesehatan",
      },
    },
    {
      id: 8,
      title: t("worshipFacilities"),
      icon: "mosque",
      count: facilityCounts.ibadah.toString(),
      unit: t("facilitiesUnit"),
      status: t("available"),
      statusColor: "bg-violet-100 text-violet-700",
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
      clickable: true,
      category: {
        name: "Fasilitas Ibadah",
        icon: "mosque",
        color: "bg-purple-700",
        filter: "Ibadah",
      },
    },
  ];


  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Facility Detail Modal */}
      <FacilityDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        facility={selectedFacility}
      />

      {/* Category Facilities Modal */}
      <CategoryFacilitiesModal
        isOpen={isCategoryModalOpen}
        onClose={handleCloseCategoryModal}
        category={selectedCategory}
        onFacilityClick={handleFacilityClick}
      />

      {/* Buildings Modal */}
      <BuildingsModal
        isOpen={isBuildingsModalOpen}
        onClose={handleCloseBuildingsModal}
      />

      {/* University Assets Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            {t("assetsTitle")}
          </h2>
          <p className="text-sm text-gray-500">{t("clickToViewDetail")}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {assets.map((asset) => (
            <div
              key={asset.id}
              onClick={() => {
                if (asset.clickable) {
                  if ("isBuildings" in asset && asset.isBuildings) {
                    handleBuildingsClick();
                  } else if (asset.category) {
                    handleCategoryClick(asset.category);
                  }
                }
              }}
              className={`bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-200 ${
                asset.clickable
                  ? "cursor-pointer hover:shadow-md hover:border-[#2C5F2D]/40"
                  : ""
              }`}
            >
              <div className="p-4">
                <div
                  className={`w-10 h-10 ${asset.iconBg} rounded-lg flex items-center justify-center ${asset.iconColor} mb-3`}
                >
                  <span className="material-symbols-outlined text-xl">
                    {asset.icon}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm truncate">
                  {asset.title}
                </h3>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-2xl font-bold text-gray-900">
                    {asset.count === "0" ? "—" : asset.count}
                  </span>
                  <span className="text-xs text-gray-400">{asset.unit}</span>
                </div>
              </div>
              {asset.clickable && (
                <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100">
                  <span className="text-xs text-[#2C5F2D] font-medium flex items-center gap-1">
                    <span className="material-icons-round text-sm">
                      arrow_forward
                    </span>
                    {t("viewAllAssets")}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AssetsSection;
