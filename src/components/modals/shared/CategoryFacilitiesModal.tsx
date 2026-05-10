import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../../../lib/supabase";

interface Facility {
  id: number;
  nama_fasilitas: string;
  deskripsi_fasilitas?: string;
  tipe_fasilitas: string;
  color?: string;
  foto_url?: string;
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

  const fetchFacilities = useCallback(async () => {
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
          foto_url,
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
  }, [category]);

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
  }, [isOpen, category, fetchFacilities]);

  if (!isOpen || !category) return null;

  const handleFacilityClick = (facility: Facility) => {
    onFacilityClick(facility);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        style={{ zIndex: 10000 }}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 flex items-center justify-center p-4 lg:p-8"
        style={{ zIndex: 10001 }}
      >
        <div
          className="w-full max-w-3xl max-h-[85vh] flex flex-col bg-white rounded-xl shadow-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-[#2C5F2D] text-white px-6 py-4 flex justify-between items-center shrink-0">
            <div>
              <h2 className="text-lg font-semibold">{category.name}</h2>
              <p className="text-white/70 text-xs mt-0.5">
                {loading
                  ? "Memuat data..."
                  : `${facilities.length} fasilitas tersedia`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/15 transition-colors text-white"
            >
              <span className="material-icons-round text-xl">close</span>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-gray-200 h-20 rounded-lg"
                  />
                ))}
              </div>
            ) : facilities.length > 0 ? (
              <div className="space-y-2">
                {facilities.map((facility) => (
                  <button
                    key={facility.id}
                    className="w-full text-left bg-white rounded-lg border border-gray-200 p-4 hover:border-[#2C5F2D]/40 hover:shadow-sm transition-all duration-150 group"
                    onClick={() => handleFacilityClick(facility)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm group-hover:text-[#2C5F2D] transition-colors">
                          {facility.nama_fasilitas}
                        </h3>
                        {facility.gedung && (
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <span className="material-icons-round text-xs">location_on</span>
                            {facility.gedung.nama_gedung}
                          </p>
                        )}
                        {facility.deskripsi_fasilitas && (
                          <p className="text-xs text-gray-400 mt-1.5 line-clamp-1">
                            {facility.deskripsi_fasilitas}
                          </p>
                        )}
                      </div>
                      <span className="material-icons-round text-gray-300 group-hover:text-[#2C5F2D] transition-colors text-lg shrink-0 mt-0.5">
                        chevron_right
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <span className="material-symbols-outlined text-5xl mb-3 block">
                  {category.icon}
                </span>
                <p className="text-sm">Belum ada fasilitas dalam kategori ini</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-white border-t border-gray-200 px-6 py-3 flex justify-end shrink-0">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition-colors text-sm"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryFacilitiesModal;
