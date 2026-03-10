import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { FACILITY_TYPES, COLOR_OPTIONS } from "../../../constants/facilityConstants";

interface Building {
  id: number;
  nama_gedung: string;
}

interface FacilityData {
  id?: number;
  nama_fasilitas: string;
  deskripsi_fasilitas: string;
  tipe_fasilitas: string;
  id_gedung: number;
  color: string;
}

interface FacilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (facility: FacilityData) => void;
  facility?: FacilityData;
}

export default function FacilityModal({
  isOpen,
  onClose,
  onSave,
  facility,
}: FacilityModalProps) {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FacilityData>({
    nama_fasilitas: "",
    deskripsi_fasilitas: "",
    tipe_fasilitas: "Laboratorium",
    id_gedung: 0,
    color: "gray",
  });

  useEffect(() => {
    if (isOpen) {
      fetchBuildings();
      if (facility) {
        setFormData(facility);
      } else {
        setFormData({
          nama_fasilitas: "",
          deskripsi_fasilitas: "",
          tipe_fasilitas: "Laboratorium",
          id_gedung: 0,
          color: "gray",
        });
      }
    }
  }, [isOpen, facility]);

  const fetchBuildings = async () => {
    try {
      const { data, error } = await supabase
        .from("gedung")
        .select("id, nama_gedung")
        .order("nama_gedung", { ascending: true });

      if (error) throw error;
      setBuildings(data || []);
    } catch (error) {
      console.error("Error fetching buildings:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama_fasilitas.trim()) {
      alert("Nama fasilitas harus diisi");
      return;
    }
    if (!formData.id_gedung) {
      alert("Gedung harus dipilih");
      return;
    }
    setLoading(true);
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-linear-to-r from-emerald-50 to-green-50">
          <h2 className="text-2xl font-bold text-gray-900">
            {facility ? "Edit Fasilitas" : "Tambah Fasilitas Baru"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-5">
            {/* Nama Fasilitas */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Fasilitas <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nama_fasilitas}
                onChange={(e) =>
                  setFormData({ ...formData, nama_fasilitas: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="Contoh: Laboratorium Komputer 1"
                required
              />
            </div>

            {/* Deskripsi Fasilitas */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Deskripsi Fasilitas
              </label>
              <textarea
                value={formData.deskripsi_fasilitas}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    deskripsi_fasilitas: e.target.value,
                  })
                }
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                placeholder="Deskripsi detail tentang fasilitas ini..."
              />
            </div>

            {/* Row for Tipe and Gedung */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Tipe Fasilitas */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tipe Fasilitas <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.tipe_fasilitas}
                  onChange={(e) =>
                    setFormData({ ...formData, tipe_fasilitas: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  required
                >
                  {FACILITY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Pilih kategori/tipe fasilitas
                </p>
              </div>

              {/* Gedung */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Gedung <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.id_gedung}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      id_gedung: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  required
                >
                  <option value={0}>Pilih Gedung</option>
                  {buildings.map((building) => (
                    <option key={building.id} value={building.id}>
                      {building.nama_gedung}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Pilih gedung lokasi fasilitas
                </p>
              </div>
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Warna Label
              </label>
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, color: color.value })
                    }
                    className={`relative h-10 rounded-lg ${color.class} transition-all hover:scale-110 ${
                      formData.color === color.value
                        ? "ring-4 ring-offset-2 ring-emerald-500 scale-110"
                        : ""
                    }`}
                    title={color.label}
                  >
                    {formData.color === color.value && (
                      <span className="absolute inset-0 flex items-center justify-center text-white font-bold">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Pilih warna untuk kategori fasilitas
              </p>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-semibold disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-semibold shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Menyimpan...
              </>
            ) : (
              "Simpan"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
