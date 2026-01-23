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

  // Helper untuk mendapatkan gambar fasilitas
  const getFacilityImage = () => {
    // Default placeholder image
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
        className="fixed inset-0 w-screen h-screen flex items-center justify-center p-4"
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
          className="relative w-full max-w-5xl max-h-[90vh] md:h-[650px] bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button Mobile */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white md:hidden transition-colors"
          >
            <span className="material-icons-round">close</span>
          </button>

          {/* Image Section */}
          <div className="w-full md:w-5/12 h-48 md:h-full relative shrink-0">
            <img
              alt={facility.nama_fasilitas}
              className="absolute inset-0 w-full h-full object-cover"
              src={getFacilityImage()}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden"></div>
            <div className="absolute bottom-4 left-4 right-4 text-white md:hidden">
              <h2 className="text-xl font-bold leading-tight">
                {facility.nama_fasilitas}
              </h2>
            </div>
          </div>

          {/* Content Section */}
          <div className="w-full md:w-7/12 flex flex-col h-full bg-white relative">
            {/* Close Button Desktop */}
            <div className="hidden md:flex justify-end p-4 absolute top-0 right-0 z-10">
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
              >
                <span className="material-icons-round text-2xl">close</span>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 pt-6 md:pt-12">
              {/* Header Desktop */}
              <div className="mb-8 hidden md:block">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-[#336940] text-xs font-semibold uppercase tracking-wide">
                    Fasilitas Kampus
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
                  {facility.nama_fasilitas}
                </h1>
                {facility.gedung && (
                  <div className="flex items-start gap-2 text-gray-500">
                    <span className="material-icons-round text-[#336940] text-lg mt-0.5">
                      location_on
                    </span>
                    <p className="text-sm font-medium">
                      {facility.gedung.nama_gedung}
                      {facility.gedung.lokasi && ` - ${facility.gedung.lokasi}`}
                    </p>
                  </div>
                )}
              </div>

              {/* Location Mobile */}
              <div className="md:hidden mb-6 mt-2">
                {facility.gedung && (
                  <div className="flex items-start gap-2 text-gray-500">
                    <span className="material-icons-round text-[#336940] text-lg mt-0.5">
                      location_on
                    </span>
                    <p className="text-sm font-medium">
                      {facility.gedung.nama_gedung}
                      {facility.gedung.lokasi && ` - ${facility.gedung.lokasi}`}
                    </p>
                  </div>
                )}
              </div>

              {/* Description */}
              {facility.deskripsi_fasilitas && (
                <section className="mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="material-icons-round text-gray-400">
                      info
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Deskripsi Lengkap
                    </h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                    {facility.deskripsi_fasilitas}
                  </p>
                </section>
              )}

              {/* Building Details */}
              {facility.gedung && (
                <section className="bg-gray-50 rounded-xl p-5 md:p-6 border border-gray-100">
                  <div className="mb-5">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Informasi Gedung
                    </h3>
                  </div>
                  <div className="space-y-5">
                    <div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-0.5">
                          Nama Gedung
                        </p>
                        <p className="text-sm md:text-base font-medium text-gray-900">
                          {facility.gedung.nama_gedung}
                        </p>
                      </div>
                    </div>
                    {facility.gedung.lokasi && (
                      <div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-0.5">
                            Lokasi
                          </p>
                          <p className="text-sm md:text-base font-medium text-gray-900">
                            {facility.gedung.lokasi}
                          </p>
                        </div>
                      </div>
                    )}
                    {facility.gedung.deskripsi_gedung && (
                      <div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-0.5">
                            Deskripsi Gedung
                          </p>
                          <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                            {facility.gedung.deskripsi_gedung}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 md:p-6 border-t border-gray-100 bg-white z-20">
              <button
                onClick={onClose}
                className="w-full bg-[#336940] hover:bg-[#265030] text-white font-medium py-3.5 px-6 rounded-lg shadow-lg shadow-green-900/10 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 group"
              >
                <span className="material-icons-round text-xl group-hover:rotate-90 transition-transform duration-300">
                  close
                </span>
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
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

export default FacilityDetailModal;
