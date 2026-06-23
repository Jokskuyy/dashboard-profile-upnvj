import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";

interface Facility {
  id: number;
  nama_fasilitas: string;
  tipe_fasilitas?: string;
  foto_url?: string;
}

interface Building {
  id: number;
  nama_gedung: string;
  deskripsi_gedung?: string;
  lokasi?: string;
  jumlah_lantai?: number;
  foto_url?: string;
  facilities: Facility[];
}

interface BuildingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BuildingsModal: React.FC<BuildingsModalProps> = ({ isOpen, onClose }) => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      fetchBuildings();
    } else {
      document.body.style.overflow = "unset";
      setSelectedBuilding(null);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const fetchBuildings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("gedung")
        .select(`
          id,
          nama_gedung,
          deskripsi_gedung,
          lokasi,
          jumlah_lantai,
          foto_url,
          fasilitas (
            id,
            nama_fasilitas,
            tipe_fasilitas,
            foto_url
          )
        `)
        .order("nama_gedung", { ascending: true });

      if (error) throw error;

      type RawBuilding = Omit<Building, "facilities"> & {
        fasilitas?: Facility[] | null;
      };
      const mapped: Building[] = (
        (data ?? []) as unknown as RawBuilding[]
      ).map((b) => ({
        id: b.id,
        nama_gedung: b.nama_gedung,
        deskripsi_gedung: b.deskripsi_gedung,
        lokasi: b.lokasi,
        jumlah_lantai: b.jumlah_lantai,
        foto_url: b.foto_url,
        facilities: b.fasilitas || [],
      }));

      setBuildings(mapped);
    } catch (error) {
      console.error("Error fetching buildings:", error);
      setBuildings([]);
    } finally {
      setLoading(false);
    }
  };

  // Use building's own foto_url, fallback to first facility photo
  const getBuildingCover = (building: Building): string | null => {
    if (building.foto_url) return building.foto_url;
    const withPhoto = (building.facilities || []).find((f) => f.foto_url);
    return withPhoto?.foto_url || null;
  };

  if (!isOpen) return null;

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
              {selectedBuilding && (
                <button
                  onClick={() => setSelectedBuilding(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/15 transition-colors shrink-0"
                >
                  <span className="material-icons-round text-xl">arrow_back</span>
                </button>
              )}
              <div className="min-w-0">
                <h2 className="text-lg font-semibold truncate">
                  {selectedBuilding ? selectedBuilding.nama_gedung : "Gedung Kampus"}
                </h2>
                <p className="text-white/70 text-xs mt-0.5">
                  {selectedBuilding
                    ? `${(selectedBuilding.facilities || []).length} fasilitas`
                    : loading
                      ? "Memuat data..."
                      : `${buildings.length} gedung tersedia`}
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
            {selectedBuilding ? (
              /* ===== Detail View ===== */
              <div>
                {/* Building cover image */}
                {(() => {
                  const cover = getBuildingCover(selectedBuilding);
                  return cover ? (
                    <div className="w-full h-48 bg-gray-200 overflow-hidden">
                      <img
                        src={cover}
                        alt={selectedBuilding.nama_gedung}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  ) : null;
                })()}

                <div className="p-4 md:p-6 space-y-4">
                  {/* Location & Floors */}
                  <div className="flex flex-wrap gap-3">
                    {selectedBuilding.lokasi && (
                      <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-3 border border-gray-200 flex-1 min-w-[180px]">
                        <div className="w-8 h-8 bg-[#E8F0E8] rounded-lg flex items-center justify-center shrink-0">
                          <span className="material-icons-round text-[#2C5F2D] text-base">
                            location_on
                          </span>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Lokasi</p>
                          <p className="text-sm text-gray-900">{selectedBuilding.lokasi}</p>
                        </div>
                      </div>
                    )}
                    {selectedBuilding.jumlah_lantai && (
                      <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-3 border border-gray-200 min-w-[130px]">
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                          <span className="material-icons-round text-blue-600 text-base">
                            layers
                          </span>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Lantai</p>
                          <p className="text-sm text-gray-900">{selectedBuilding.jumlah_lantai} lantai</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {selectedBuilding.deskripsi_gedung && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Deskripsi</p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {selectedBuilding.deskripsi_gedung}
                      </p>
                    </div>
                  )}

                  {/* Facilities with images */}
                  {(selectedBuilding.facilities || []).length > 0 ? (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Fasilitas ({(selectedBuilding.facilities || []).length})
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {(selectedBuilding.facilities || []).map((facility) => (
                          <div
                            key={facility.id}
                            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-[#2C5F2D]/30 transition-colors"
                          >
                            {facility.foto_url && (
                              <div className="h-28 bg-gray-100 overflow-hidden">
                                <img
                                  src={facility.foto_url}
                                  alt={facility.nama_fasilitas}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).parentElement!.style.display = "none";
                                  }}
                                />
                              </div>
                            )}
                            <div className="p-3">
                              <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                                {facility.nama_fasilitas}
                              </h4>
                              {facility.tipe_fasilitas && (
                                <span className="inline-block mt-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#E8F0E8] text-[#2C5F2D]">
                                  {facility.tipe_fasilitas}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-300">
                      <span className="material-icons-round text-4xl mb-2 block">inventory_2</span>
                      <p className="text-sm">Belum ada fasilitas terdaftar</p>
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
            ) : buildings.length > 0 ? (
              /* ===== List View ===== */
              <div className="p-4 md:p-6 space-y-3">
                {buildings.map((building) => {
                  const cover = getBuildingCover(building);
                  return (
                    <button
                      key={building.id}
                      className="w-full text-left bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-[#2C5F2D]/40 hover:shadow-sm transition-all duration-150 group flex"
                      onClick={() => setSelectedBuilding(building)}
                    >
                      {/* Thumbnail */}
                      {cover ? (
                        <div className="w-24 sm:w-32 shrink-0 bg-gray-100 overflow-hidden">
                          <img
                            src={cover}
                            alt={building.nama_gedung}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).parentElement!.style.display = "none";
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-24 sm:w-32 shrink-0 bg-[#E8F0E8] flex items-center justify-center">
                          <span className="material-icons-round text-[#2C5F2D]/40 text-3xl">domain</span>
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0 p-4 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm group-hover:text-[#2C5F2D] transition-colors">
                            {building.nama_gedung}
                          </h3>
                          {building.lokasi && (
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              <span className="material-icons-round text-xs">location_on</span>
                              {building.lokasi}
                            </p>
                          )}
                          <div className="flex items-center gap-3 mt-2">
                            {building.jumlah_lantai && (
                              <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                                <span className="material-icons-round text-xs">layers</span>
                                {building.jumlah_lantai} lantai
                              </span>
                            )}
                            <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                              <span className="material-icons-round text-xs">inventory_2</span>
                              {(building.facilities || []).length} fasilitas
                            </span>
                          </div>
                        </div>
                        <span className="material-icons-round text-gray-300 group-hover:text-[#2C5F2D] transition-colors text-lg shrink-0 mt-0.5">
                          chevron_right
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Empty */
              <div className="text-center py-16 text-gray-400">
                <span className="material-symbols-outlined text-5xl mb-3 block">
                  domain
                </span>
                <p className="text-sm">Belum ada data gedung</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-white border-t border-gray-200 px-6 py-3 flex justify-end shrink-0">
            <button
              onClick={() => {
                if (selectedBuilding) {
                  setSelectedBuilding(null);
                } else {
                  onClose();
                }
              }}
              className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition-colors text-sm"
            >
              {selectedBuilding ? "Kembali" : "Tutup"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BuildingsModal;
