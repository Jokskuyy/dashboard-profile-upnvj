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
    filter: string;
  } | null;
  onFacilityClick: (facility: Facility) => void;
}

const CategoryFacilitiesModal: React.FC<CategoryFacilitiesModalProps> = ({
  isOpen,
  onClose,
  category,
  onFacilityClick: _onFacilityClick,
}) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

  const fetchFacilities = useCallback(async () => {
    if (!category) return;

    setLoading(true);
    try {
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
          if (category.filter) {
            filteredData = filteredData.filter(
              (f) => f.tipe_fasilitas === category.filter,
            );
          }
      }

      const transformedData = filteredData.map((f) => ({
        id: f.id,
        nama_fasilitas: f.nama_fasilitas,
        deskripsi_fasilitas: f.deskripsi_fasilitas,
        tipe_fasilitas: f.tipe_fasilitas,
        color: f.color,
        foto_url: f.foto_url,
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

  useEffect(() => {
    if (isOpen && category) {
      document.body.style.overflow = "hidden";
      fetchFacilities();
    } else {
      document.body.style.overflow = "unset";
      setSelectedFacility(null);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, category, fetchFacilities]);

  if (!isOpen || !category) return null;

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
            <div className="flex items-center gap-3 min-w-0">
              {selectedFacility && (
                <button
                  onClick={() => setSelectedFacility(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/15 transition-colors shrink-0"
                >
                  <span className="material-icons-round text-xl">arrow_back</span>
                </button>
              )}
              <div className="min-w-0">
                <h2 className="text-lg font-semibold truncate">
                  {selectedFacility ? selectedFacility.nama_fasilitas : category.name}
                </h2>
                <p className="text-white/70 text-xs mt-0.5">
                  {selectedFacility
                    ? selectedFacility.tipe_fasilitas
                    : loading
                      ? "Memuat data..."
                      : `${facilities.length} fasilitas tersedia`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/15 transition-colors text-white shrink-0"
            >
              <span className="material-icons-round text-xl">close</span>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            {selectedFacility ? (
              /* ===== Detail View ===== */
              <div>
                {/* Facility image */}
                {selectedFacility.foto_url && (
                  <div className="w-full h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={selectedFacility.foto_url}
                      alt={selectedFacility.nama_fasilitas}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).parentElement!.style.display = "none";
                      }}
                    />
                  </div>
                )}

                <div className="p-4 md:p-6 space-y-4">
                  {/* Location & Type badges */}
                  <div className="flex flex-wrap gap-3">
                    {selectedFacility.gedung && (
                      <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-3 border border-gray-200 flex-1 min-w-[180px]">
                        <div className="w-8 h-8 bg-[#E8F0E8] rounded-lg flex items-center justify-center shrink-0">
                          <span className="material-icons-round text-[#2C5F2D] text-base">
                            domain
                          </span>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Gedung</p>
                          <p className="text-sm text-gray-900">{selectedFacility.gedung.nama_gedung}</p>
                        </div>
                      </div>
                    )}
                    {selectedFacility.gedung?.lokasi && (
                      <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-3 border border-gray-200 flex-1 min-w-[180px]">
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                          <span className="material-icons-round text-blue-600 text-base">
                            location_on
                          </span>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Lokasi</p>
                          <p className="text-sm text-gray-900">{selectedFacility.gedung.lokasi}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Type badge */}
                  {selectedFacility.tipe_fasilitas && (
                    <div className="flex items-center gap-2">
                      <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-[#E8F0E8] text-[#2C5F2D]">
                        {selectedFacility.tipe_fasilitas}
                      </span>
                    </div>
                  )}

                  {/* Description */}
                  {selectedFacility.deskripsi_fasilitas ? (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Deskripsi</p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {selectedFacility.deskripsi_fasilitas}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-300">
                      <span className="material-icons-round text-4xl mb-2 block">description</span>
                      <p className="text-sm">Belum ada deskripsi</p>
                    </div>
                  )}
                </div>
              </div>
            ) : loading ? (
              /* Loading */
              <div className="p-4 md:p-6 space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-gray-200 h-24 rounded-lg"
                  />
                ))}
              </div>
            ) : facilities.length > 0 ? (
              /* ===== List View ===== */
              <div className="p-4 md:p-6 space-y-3">
                {facilities.map((facility) => (
                  <button
                    key={facility.id}
                    className="w-full text-left bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-[#2C5F2D]/40 hover:shadow-sm transition-all duration-150 group flex"
                    onClick={() => setSelectedFacility(facility)}
                  >
                    {/* Thumbnail */}
                    {facility.foto_url ? (
                      <div className="w-24 sm:w-32 shrink-0 bg-gray-100 overflow-hidden">
                        <img
                          src={facility.foto_url}
                          alt={facility.nama_fasilitas}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).parentElement!.style.display = "none";
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-24 sm:w-32 shrink-0 bg-[#E8F0E8] flex items-center justify-center">
                        <span className="material-icons-round text-[#2C5F2D]/40 text-3xl">
                          {category.icon || "inventory_2"}
                        </span>
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0 p-4 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm group-hover:text-[#2C5F2D] transition-colors">
                          {facility.nama_fasilitas}
                        </h3>
                        {facility.gedung && (
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <span className="material-icons-round text-xs">domain</span>
                            {facility.gedung.nama_gedung}
                          </p>
                        )}
                        {facility.deskripsi_fasilitas && (
                          <p className="text-xs text-gray-400 mt-1.5 line-clamp-2">
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
              /* Empty */
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
              onClick={() => {
                if (selectedFacility) {
                  setSelectedFacility(null);
                } else {
                  onClose();
                }
              }}
              className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition-colors text-sm"
            >
              {selectedFacility ? "Kembali" : "Tutup"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryFacilitiesModal;
