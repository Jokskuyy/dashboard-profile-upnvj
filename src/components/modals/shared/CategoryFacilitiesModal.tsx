import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";

interface Facility {
  id: number;
  nama_fasilitas: string;
  deskripsi_fasilitas?: string;
  tipe_fasilitas: string;
  color?: string;
  gedung?: {
    id: number;
    nama_gedung: string;
    lokasi?: string;
  };
}

interface CategoryFacilitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: {
    name: string;
    icon: string;
    color: string;
    filter: string; // SQL filter untuk tipe_fasilitas
  } | null;
  onFacilityClick: (facility: Facility) => void;
}

const CategoryFacilitiesModal: React.FC<CategoryFacilitiesModalProps> = ({
  isOpen,
  onClose,
  category,
  onFacilityClick,
}) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(false);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen && category) {
      document.body.style.overflow = "hidden";
      fetchFacilities();
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, category]);

  const fetchFacilities = async () => {
    if (!category) return;

    setLoading(true);
    try {
      // Fetch all facilities and filter in memory for consistent logic
      const { data, error } = await supabase
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
            lokasi
          )
        `,
        )
        .order("nama_fasilitas", { ascending: true });

      if (error) throw error;

      // Filter based on category using the same logic as counting
      let filteredData = data || [];

      switch (category.name) {
        case "Laboratorium":
          filteredData = filteredData.filter(
            (f) =>
              f.tipe_fasilitas === "Laboratorium" ||
              f.tipe_fasilitas?.toLowerCase().includes("lab"),
          );
          break;
        case "Perpustakaan & Ruang Baca":
          filteredData = filteredData.filter(
            (f) =>
              f.tipe_fasilitas === "Perpustakaan" ||
              f.tipe_fasilitas?.toLowerCase().includes("perpustakaan") ||
              f.tipe_fasilitas?.toLowerCase().includes("ruang baca"),
          );
          break;
        case "Ruang Kuliah":
          filteredData = filteredData.filter(
            (f) =>
              f.tipe_fasilitas === "Ruang Kuliah" ||
              f.tipe_fasilitas?.toLowerCase().includes("ruang kuliah") ||
              f.tipe_fasilitas?.toLowerCase().includes("ruang kelas"),
          );
          break;
        case "Auditorium & Aula":
          filteredData = filteredData.filter(
            (f) =>
              f.tipe_fasilitas === "Auditorium" ||
              f.tipe_fasilitas?.toLowerCase().includes("auditorium") ||
              f.tipe_fasilitas?.toLowerCase().includes("aula"),
          );
          break;
        case "Fasilitas Olahraga":
          filteredData = filteredData.filter(
            (f) =>
              f.tipe_fasilitas === "Olahraga" ||
              f.tipe_fasilitas?.toLowerCase().includes("olahraga") ||
              f.tipe_fasilitas?.toLowerCase().includes("sport"),
          );
          break;
        case "Fasilitas Kesehatan":
          filteredData = filteredData.filter(
            (f) =>
              f.tipe_fasilitas === "Kesehatan" ||
              f.tipe_fasilitas?.toLowerCase().includes("kesehatan") ||
              f.tipe_fasilitas?.toLowerCase().includes("klinik"),
          );
          break;
        case "Fasilitas Ibadah":
          filteredData = filteredData.filter(
            (f) =>
              f.tipe_fasilitas === "Ibadah" ||
              f.tipe_fasilitas?.toLowerCase().includes("ibadah") ||
              f.tipe_fasilitas?.toLowerCase().includes("masjid") ||
              f.tipe_fasilitas?.toLowerCase().includes("musholla"),
          );
          break;
        case "Kantin & Food Court":
          filteredData = filteredData.filter(
            (f) =>
              f.tipe_fasilitas === "Kantin" ||
              f.tipe_fasilitas?.toLowerCase().includes("kantin") ||
              f.tipe_fasilitas?.toLowerCase().includes("food"),
          );
          break;
        default:
          // Use the filter from category if provided
          if (category.filter) {
            filteredData = filteredData.filter(
              (f) => f.tipe_fasilitas === category.filter,
            );
          }
      }

      // Transform data with proper typing
      const transformedData = filteredData.map((f) => ({
        id: f.id,
        nama_fasilitas: f.nama_fasilitas,
        deskripsi_fasilitas: f.deskripsi_fasilitas,
        tipe_fasilitas: f.tipe_fasilitas,
        color: f.color,
        gedung: Array.isArray(f.gedung) ? f.gedung[0] : f.gedung,
      }));
      setFacilities(transformedData);
    } catch (error) {
      console.error("Error fetching facilities:", error);
      setFacilities([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !category) return null;

  const handleFacilityClick = (facility: Facility) => {
    onFacilityClick(facility);
    onClose();
  };

  // Helper to get facility image
  const getFacilityImage = () => {
    return `https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=60`;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 w-screen h-screen bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 10000,
        }}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 w-screen h-screen flex items-center justify-center p-4 lg:p-8"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 10001,
        }}
      >
        <div
          className="w-full max-w-[1400px] h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-[#336940] text-white px-6 py-5 md:px-8 flex justify-between items-center shrink-0 shadow-md z-20">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white">
                  {category.name}
                </h1>
                <p className="text-white text-xs md:text-sm">
                  {loading
                    ? "Loading..."
                    : `${facilities.length} facilities available`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-800 transition-colors text-white hover:text-white text-2xl font-light outline-none focus:outline-none"
            >
              ×
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50 p-6 md:p-8">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-gray-200 h-96 rounded-xl"
                  ></div>
                ))}
              </div>
            ) : facilities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {facilities.map((facility) => (
                  <article
                    key={facility.id}
                    className="flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-200 transition-all duration-300 group cursor-pointer"
                    onClick={() => handleFacilityClick(facility)}
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        alt={facility.nama_fasilitas}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        src={getFacilityImage()}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      {/* Location */}
                      {facility.gedung && (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-3">
                          {(facility.gedung as any).nama_gedung}
                        </div>
                      )}

                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug line-clamp-2">
                        {facility.nama_fasilitas}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-600 line-clamp-2 mb-6 flex-1">
                        {facility.deskripsi_fasilitas ||
                          "No description available"}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <span className="material-icons text-6xl mb-4 block opacity-20">
                  {category.icon}
                </span>
                <p>No facilities available in this category</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-white border-t border-gray-200 p-4 md:p-6 flex justify-end items-center shrink-0 z-10 shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.05)]">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 font-medium transition-colors text-sm flex items-center gap-2 outline-none focus:outline-none"
            >
              × Close Window
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
      `}</style>
    </>
  );
};

export default CategoryFacilitiesModal;
