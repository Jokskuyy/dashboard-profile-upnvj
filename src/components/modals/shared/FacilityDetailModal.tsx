import React, { useEffect } from "react";

interface FacilityDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  facility: {
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
      deskripsi_gedung?: string;
    };
  } | null;
}

const FacilityDetailModal: React.FC<FacilityDetailModalProps> = ({
  isOpen,
  onClose,
  facility,
}) => {
  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !facility) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        style={{ zIndex: 10002 }}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 flex items-center justify-center p-4"
        style={{ zIndex: 10003 }}
      >
        <div
          className="w-full max-w-lg max-h-[85vh] flex flex-col bg-white rounded-xl shadow-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-[#2C5F2D] text-white px-6 py-4 flex justify-between items-start shrink-0">
            <div className="flex-1 min-w-0 pr-4">
              <span className="inline-block px-2 py-0.5 bg-white/15 text-white/90 text-[10px] font-medium rounded mb-2">
                {facility.tipe_fasilitas}
              </span>
              <h2 className="text-lg font-semibold leading-snug">
                {facility.nama_fasilitas}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/15 transition-colors text-white shrink-0 mt-0.5"
            >
              <span className="material-icons-round text-xl">close</span>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Facility Image */}
            {facility.foto_url && (
              <div className="rounded-lg overflow-hidden mb-5 border border-gray-200">
                <img
                  src={facility.foto_url}
                  alt={facility.nama_fasilitas}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
            {/* Location */}
            {facility.gedung && (
              <div className="flex items-start gap-2.5 mb-5 pb-5 border-b border-gray-100">
                <div className="w-8 h-8 bg-[#E8F0E8] rounded-lg flex items-center justify-center shrink-0">
                  <span className="material-icons-round text-[#2C5F2D] text-base">
                    location_on
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {facility.gedung.nama_gedung}
                  </p>
                  {facility.gedung.lokasi && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {facility.gedung.lokasi}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            {facility.deskripsi_fasilitas && (
              <div className="mb-5">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Deskripsi
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {facility.deskripsi_fasilitas}
                </p>
              </div>
            )}

            {/* Building Details */}
            {facility.gedung && facility.gedung.deskripsi_gedung && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Informasi Gedung
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {facility.gedung.deskripsi_gedung}
                </p>
              </div>
            )}

            {/* No description placeholder */}
            {!facility.deskripsi_fasilitas && !facility.gedung?.deskripsi_gedung && (
              <div className="text-center py-8 text-gray-300">
                <span className="material-icons-round text-4xl mb-2 block">description</span>
                <p className="text-sm">Belum ada deskripsi</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-gray-100 bg-white shrink-0">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-lg bg-[#2C5F2D] hover:bg-[#234d24] text-white font-medium transition-colors text-sm"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FacilityDetailModal;
