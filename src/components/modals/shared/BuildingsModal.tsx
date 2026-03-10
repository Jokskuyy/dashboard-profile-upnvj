import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";

interface Building {
  id: number;
  nama_gedung: string;
  deskripsi_gedung?: string;
  lokasi?: string;
}

interface BuildingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BuildingsModal: React.FC<BuildingsModalProps> = ({ isOpen, onClose }) => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(false);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      fetchBuildings();
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const fetchBuildings = async () => {
    setLoading(true);
    try {
      // Fetch buildings
      const { data: buildingsData, error: buildingsError } = await supabase
        .from("gedung")
        .select("*")
        .order("nama_gedung", { ascending: true });

      if (buildingsError) throw buildingsError;

      setBuildings(buildingsData || []);
    } catch (error) {
      console.error("Error fetching buildings:", error);
      setBuildings([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Helper to get building image
  const getBuildingImage = () => {
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
                  Campus Buildings
                </h1>
                <p className="text-white text-xs md:text-sm">
                  {loading
                    ? "Loading..."
                    : `${buildings.length} buildings available on campus`}
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
            ) : buildings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {buildings.map((building) => (
                  <article
                    key={building.id}
                    className="flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-200 transition-all duration-300 group"
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        alt={`${building.nama_gedung} Facade`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        src={getBuildingImage()}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-60"></div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      {/* Location */}
                      {building.lokasi && (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-3">
                          {building.lokasi}
                        </div>
                      )}

                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
                        {building.nama_gedung}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-600 line-clamp-2 mb-6 flex-1">
                        {building.deskripsi_gedung ||
                          "No description available"}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <span className="material-icons text-6xl mb-4 block opacity-20">
                  domain
                </span>
                <p>No buildings data available</p>
              </div>
            )}
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

export default BuildingsModal;
