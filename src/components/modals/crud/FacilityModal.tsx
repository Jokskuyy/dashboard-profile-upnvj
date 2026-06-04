import { useState, useEffect, useRef } from "react";
import {
  X,
  Building2,
  ImageIcon,
  Layers,
  Palette,
  Save,
  Loader2,
} from "lucide-react";
import { supabase } from "../../../lib/supabase";
import {
  FACILITY_TYPES,
  COLOR_OPTIONS,
} from "../../../constants/facilityConstants";

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
  lantai?: number | null;
  foto_url?: string;
  // May contain nested join objects from Supabase
  gedung?: { id: number; nama_gedung: string };
}

interface FacilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (facility: FacilityData) => void;
  facility?: FacilityData;
}

const INITIAL_FORM: FacilityData = {
  nama_fasilitas: "",
  deskripsi_fasilitas: "",
  tipe_fasilitas: "Laboratorium",
  id_gedung: 0,
  color: "gray",
  lantai: 1,
  foto_url: "",
};

// Tailwind color mapping for the color picker swatches
const COLOR_CLASS_MAP: Record<string, string> = {
  gray: "bg-gray-500",
  red: "bg-red-500",
  orange: "bg-orange-500",
  amber: "bg-amber-500",
  green: "bg-green-500",
  emerald: "bg-emerald-500",
  teal: "bg-teal-500",
  cyan: "bg-cyan-500",
  blue: "bg-blue-500",
  indigo: "bg-indigo-500",
  violet: "bg-violet-500",
  purple: "bg-purple-500",
  pink: "bg-pink-500",
};

export default function FacilityModal({
  isOpen,
  onClose,
  onSave,
  facility,
}: FacilityModalProps) {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FacilityData>({ ...INITIAL_FORM });
  const [imageError, setImageError] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Prevent body scroll when modal is open
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

  useEffect(() => {
    if (isOpen) {
      fetchBuildings();
      if (facility) {
        setFormData({
          ...facility,
          lantai: facility.lantai ?? 1,
          foto_url: facility.foto_url || "",
          color: facility.color || "gray",
        });
      } else {
        setFormData({ ...INITIAL_FORM });
      }
      setImageError(false);
      setLoading(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nama_fasilitas.trim()) return;
    if (!formData.id_gedung) return;

    setLoading(true);
    try {
      // Strip nested join objects before saving — only send DB columns
      const { gedung: _gedung, ...cleanData } = formData;
      await onSave(cleanData);
    } catch {
      // Error is handled by parent (AdminDashboard)
    } finally {
      setLoading(false);
    }
  };

  const updateField = <K extends keyof FacilityData>(
    key: K,
    value: FacilityData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

  const isEditing = Boolean(facility?.id);
  const hasImage = formData.foto_url && formData.foto_url.trim() !== "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-hidden"
      style={{ touchAction: "none" }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
        style={{
          animation: "modalIn 0.2s ease-out",
        }}
      >
        {/* ─── Header ─────────────────────────────────── */}
        <div className="relative px-6 py-5 border-b border-slate-100">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 via-teal-50/50 to-transparent" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {isEditing ? "Edit Fasilitas" : "Tambah Fasilitas"}
                </h2>
                <p className="text-xs text-slate-400">
                  {isEditing
                    ? "Perbarui informasi fasilitas"
                    : "Daftarkan fasilitas baru ke sistem"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* ─── Form Content ───────────────────────────── */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          {/* Nama Fasilitas */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Nama Fasilitas <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nama_fasilitas}
              onChange={(e) => updateField("nama_fasilitas", e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none bg-white placeholder:text-slate-300"
              placeholder="cth. Laboratorium Komputer 1"
              required
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Deskripsi
            </label>
            <textarea
              value={formData.deskripsi_fasilitas}
              onChange={(e) =>
                updateField("deskripsi_fasilitas", e.target.value)
              }
              rows={3}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none bg-white resize-none placeholder:text-slate-300"
              placeholder="Deskripsi singkat tentang fasilitas ini..."
            />
          </div>

          {/* ─── Row: Tipe + Gedung ───────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                Tipe <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.tipe_fasilitas}
                onChange={(e) => updateField("tipe_fasilitas", e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none bg-white appearance-none cursor-pointer"
                required
              >
                {FACILITY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                Gedung <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.id_gedung}
                onChange={(e) =>
                  updateField("id_gedung", parseInt(e.target.value) || 0)
                }
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none bg-white appearance-none cursor-pointer"
                required
              >
                <option value={0}>Pilih Gedung</option>
                {buildings.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.nama_gedung}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ─── Row: Lantai + Foto URL ───────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                Lantai
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={formData.lantai ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  updateField("lantai", val === "" ? null : parseInt(val) || 1);
                }}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none bg-white placeholder:text-slate-300"
                placeholder="1"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                URL Foto
              </label>
              <input
                type="url"
                value={formData.foto_url || ""}
                onChange={(e) => {
                  updateField("foto_url", e.target.value);
                  setImageError(false);
                }}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none bg-white placeholder:text-slate-300"
                placeholder="https://example.com/foto.jpg"
              />
            </div>
          </div>

          {/* Image Preview */}
          {hasImage && (
            <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
              {!imageError ? (
                <img
                  src={formData.foto_url}
                  alt="Preview"
                  className="w-full h-40 object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex items-center justify-center h-40 text-slate-400 text-sm gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Gagal memuat gambar
                </div>
              )}
            </div>
          )}

          {/* ─── Color Picker ─────────────────────────── */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
              <Palette className="w-3.5 h-3.5 text-slate-400" />
              Warna Label
            </label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((color) => {
                const isSelected = formData.color === color.value;
                const bgClass =
                  COLOR_CLASS_MAP[color.value] || color.class || "bg-gray-500";
                return (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => updateField("color", color.value)}
                    className={`group relative w-9 h-9 rounded-lg ${bgClass} transition-all duration-150 hover:scale-110 ${
                      isSelected
                        ? "ring-[3px] ring-offset-2 ring-emerald-500 scale-110"
                        : "ring-1 ring-black/10"
                    }`}
                    title={color.label}
                  >
                    {isSelected && (
                      <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold drop-shadow">
                        ✓
                      </span>
                    )}
                    {/* Tooltip */}
                    <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-medium">
                      {color.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </form>

        {/* ─── Footer ─────────────────────────────────── */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/80">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            onClick={() => formRef.current?.requestSubmit()}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Simpan
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
