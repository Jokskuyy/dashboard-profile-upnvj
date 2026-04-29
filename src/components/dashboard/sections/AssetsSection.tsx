import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const [labScrollPosition, setLabScrollPosition] = useState(0);

  // State untuk data real dari database
  const [buildingsCount, setBuildingsCount] = useState(0);
  const [facilitiesData, setFacilitiesData] = useState<FacilityDetail[]>([]);
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
          const counts = {
            laboratorium: allFacilities.filter(
              (f) =>
                f.tipe_fasilitas === "Laboratorium" ||
                f.tipe_fasilitas?.toLowerCase().includes("lab"),
            ).length,
            perpustakaan: allFacilities.filter(
              (f) =>
                f.tipe_fasilitas === "Perpustakaan" ||
                f.tipe_fasilitas?.toLowerCase().includes("perpustakaan") ||
                f.tipe_fasilitas?.toLowerCase().includes("ruang baca"),
            ).length,
            ruangKuliah: allFacilities.filter(
              (f) =>
                f.tipe_fasilitas === "Ruang Kuliah" ||
                f.tipe_fasilitas?.toLowerCase().includes("ruang kuliah") ||
                f.tipe_fasilitas?.toLowerCase().includes("ruang kelas"),
            ).length,
            auditorium: allFacilities.filter(
              (f) =>
                f.tipe_fasilitas === "Auditorium" ||
                f.tipe_fasilitas?.toLowerCase().includes("auditorium") ||
                f.tipe_fasilitas?.toLowerCase().includes("aula"),
            ).length,
            olahraga: allFacilities.filter(
              (f) =>
                f.tipe_fasilitas === "Olahraga" ||
                f.tipe_fasilitas?.toLowerCase().includes("olahraga") ||
                f.tipe_fasilitas?.toLowerCase().includes("sport"),
            ).length,
            kesehatan: allFacilities.filter(
              (f) =>
                f.tipe_fasilitas === "Kesehatan" ||
                f.tipe_fasilitas?.toLowerCase().includes("kesehatan") ||
                f.tipe_fasilitas?.toLowerCase().includes("klinik"),
            ).length,
            ibadah: allFacilities.filter(
              (f) =>
                f.tipe_fasilitas === "Ibadah" ||
                f.tipe_fasilitas?.toLowerCase().includes("ibadah") ||
                f.tipe_fasilitas?.toLowerCase().includes("masjid") ||
                f.tipe_fasilitas?.toLowerCase().includes("musholla"),
            ).length,
            kantin: allFacilities.filter(
              (f) =>
                f.tipe_fasilitas === "Kantin" ||
                f.tipe_fasilitas?.toLowerCase().includes("kantin") ||
                f.tipe_fasilitas?.toLowerCase().includes("food"),
            ).length,
          };
          setFacilityCounts(counts);
        }

        // Fetch fasilitas featured (Auditorium dan Lab penting) untuk display
        const { data: allFacilitiesData, error: facilitiesError } =
          await supabase
            .from("fasilitas")
            .select(
              `
            id,
            nama_fasilitas,
            deskripsi_fasilitas,
            tipe_fasilitas,
            color,
            gedung:id_gedung (
              id,
              nama_gedung,
              lokasi,
              deskripsi_gedung
            )
          `,
            )
            .order("tipe_fasilitas", { ascending: true })
            .order("nama_fasilitas", { ascending: true });

        if (!facilitiesError && allFacilitiesData) {
          // Filter di client-side untuk menangkap semua variasi Lab dan Auditorium
          const featuredFacilities = allFacilitiesData.filter(
            (f) =>
              f.tipe_fasilitas === "Auditorium" ||
              f.tipe_fasilitas?.toLowerCase().includes("auditorium") ||
              f.tipe_fasilitas?.toLowerCase().includes("aula") ||
              f.tipe_fasilitas === "Laboratorium Komputer" ||
              f.tipe_fasilitas?.toLowerCase().includes("laboratorium"),
          ).map(f => ({
            ...f,
            gedung: Array.isArray(f.gedung) ? f.gedung[0] : f.gedung
          }));
          setFacilitiesData(featuredFacilities.slice(0, 12));
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
        color: "bg-linear-to-r from-purple-600 to-blue-600",
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
        color: "bg-linear-to-r from-emerald-600 to-green-600",
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
        color: "bg-linear-to-r from-amber-600 to-orange-600",
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
        color: "bg-linear-to-r from-purple-600 to-pink-600",
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
        color: "bg-linear-to-r from-indigo-600 to-blue-600",
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
        color: "bg-linear-to-r from-red-600 to-pink-600",
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
        color: "bg-linear-to-r from-violet-600 to-purple-600",
        filter: "Ibadah",
      },
    },
  ];

  // Mapping gambar default untuk fasilitas berdasarkan tipe dan nama
  const getFacilityImage = (
    facilityName: string,
    facilityType: string,
  ) => {
    const name = facilityName.toLowerCase();
    const type = facilityType.toLowerCase();

    // Laboratorium images
    if (type.includes("laboratorium") || type.includes("lab")) {
      if (name.includes("anatomi") || name.includes("fisiologi")) {
        return "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80";
      } else if (name.includes("robotika") || name.includes("iot")) {
        return "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&q=80";
      } else if (
        name.includes("cyber") ||
        name.includes("keamanan") ||
        name.includes("ai") ||
        name.includes("artificial")
      ) {
        return "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80";
      } else if (name.includes("mikro") || name.includes("biologi")) {
        return "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&q=80";
      } else if (name.includes("jaringan") || name.includes("network")) {
        return "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&q=80";
      } else if (name.includes("multimedia") || name.includes("desain")) {
        return "https://images.unsplash.com/photo-1561998338-13ad7883b20f?w=400&q=80";
      } else if (name.includes("mesin") || name.includes("motor")) {
        return "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&q=80";
      } else if (name.includes("elektronika") || name.includes("elektro")) {
        return "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&q=80";
      } else if (name.includes("kimia")) {
        return "https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=400&q=80";
      } else if (name.includes("keperawatan")) {
        return "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80";
      } else if (name.includes("basis data") || name.includes("database")) {
        return "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&q=80";
      } else if (name.includes("programming") || name.includes("pemrograman")) {
        return "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80";
      }
      return "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&q=80";
    }

    // Perpustakaan images
    if (type.includes("perpustakaan") || type.includes("library")) {
      return "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400&q=80";
    }

    // Auditorium/Aula images
    if (type.includes("auditorium") || type.includes("aula")) {
      return "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80";
    }

    // Studio images
    if (type.includes("studio")) {
      return "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&q=80";
    }

    // Default facility image
    return "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=400&q=80";
  };

  const scrollLabs = (direction: "left" | "right") => {
    const container = document.getElementById("labs-container");
    if (container) {
      const scrollAmount = 320;
      const newPosition =
        direction === "left"
          ? Math.max(0, labScrollPosition - scrollAmount)
          : Math.min(
              container.scrollWidth - container.clientWidth,
              labScrollPosition + scrollAmount,
            );

      container.scrollTo({ left: newPosition, behavior: "smooth" });
      setLabScrollPosition(newPosition);
    }
  };

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
            <span className="material-symbols-outlined text-[#2C5F2D]">
              account_balance
            </span>
            {t("assetsTitle")}
          </h2>
          <p className="text-sm text-gray-500">{t("clickToViewDetail")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              className={`bg-white p-5 rounded-2xl shadow-sm border border-gray-200 transition-all ${
                asset.clickable
                  ? "cursor-pointer hover:shadow-lg hover:border-[#2C5F2D] hover:-translate-y-1"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 ${asset.iconBg} rounded-xl flex items-center justify-center ${asset.iconColor}`}
                >
                  <span className="material-symbols-outlined text-3xl">
                    {asset.icon}
                  </span>
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">
                {asset.title}
              </h3>
              <div className="flex items-end justify-between">
                <span className="text-gray-500 text-sm">{asset.unit}</span>
                <span className="text-2xl font-bold text-gray-900">
                  {asset.count}
                </span>
              </div>
              {asset.clickable && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <span className="text-xs text-[#2C5F2D] font-semibold flex items-center gap-1">
                    <span className="material-icons-round text-sm">
                      visibility
                    </span>
                    {t("viewAllAssets")}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Featured Facilities Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <span className="material-symbols-outlined text-[#2C5F2D]">
              star
            </span>
            {t("featuredAuditoriumsLabs")}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => scrollLabs("left")}
              className="p-2 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-[#2C5F2D] transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollLabs("right")}
              className="p-2 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-[#2C5F2D] transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div
          id="labs-container"
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {facilitiesData.map((facility) => {
            const facilityImage = getFacilityImage(
              facility.nama_fasilitas,
              facility.tipe_fasilitas,
            );

            return (
              <div
                key={facility.id}
                onClick={() => handleFacilityClick(facility)}
                className="w-[280px] shrink-0 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col group cursor-pointer hover:shadow-lg hover:border-[#2C5F2D] transition-all"
              >
                <div className="h-40 overflow-hidden bg-gray-100 relative">
                  <img
                    alt={facility.nama_fasilitas}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src={facilityImage}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=400&q=80";
                    }}
                  />
                </div>
                <div className="p-4 flex flex-col h-[180px]">
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 h-12 leading-6">
                    {facility.nama_fasilitas}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-3 flex-1 leading-relaxed">
                    {facility.deskripsi_fasilitas?.substring(0, 120) ||
                      t("modernFacilityDescription")}
                    ...
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFacilityClick(facility);
                    }}
                    className="w-full py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-[#2C5F2D] hover:text-white hover:border-[#2C5F2D] transition-colors flex items-center justify-center gap-1.5"
                  >
                    {t("viewDetails")}{" "}
                    <span className="material-icons-round text-sm">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {facilitiesData.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">
            <span className="material-symbols-outlined text-6xl mb-4 block">
              apartment
            </span>
            <p>{t("noFacilitiesAvailable")}</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default AssetsSection;
