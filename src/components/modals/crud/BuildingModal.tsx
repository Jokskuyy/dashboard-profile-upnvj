import { useState, useEffect } from "react";
import { X, Save, Loader2 } from "lucide-react";
import type { Gedung } from "../../../services/api/dataService";

interface BuildingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (building: Gedung) => void;
  building?: Gedung;
}

const INITIAL_FORM: Gedung = {
  nama_gedung: "",
  deskripsi_gedung: "",
  lokasi: "",
  jumlah_lantai: 1,
  foto_url: "",
  unity_object_name: "",
};

export default function BuildingModal({
  isOpen,
  onClose,
  onSave,
  building,
}: BuildingModalProps) {
  const [form, setForm] = useState<Gedung>(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEdit = !!building?.id;

  useEffect(() => {
    if (isOpen) {
      if (building) {
        setForm({
          ...building,
          deskripsi_gedung: building.deskripsi_gedung || "",
          lokasi: building.lokasi || "",
          jumlah_lantai: building.jumlah_lantai || 1,
          foto_url: building.foto_url || "",
          unity_object_name: building.unity_object_name || "",
        });
      } else {
        setForm(INITIAL_FORM);
      }
      setErrors({});
    }
  }, [isOpen, building]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.nama_gedung.trim()) {
      newErrors.nama_gedung = "Nama gedung wajib diisi";
    }
    if (form.jumlah_lantai !== undefined && form.jumlah_lantai < 1) {
      newErrors.jumlah_lantai = "Jumlah lantai minimal 1";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      await onSave(form);
    } catch {
      // Error handled by parent
    } finally {
      setSaving(false);
    }
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
        className="fixed inset-0 flex items-center justify-center p-4"
        style={{ zIndex: 10001 }}
      >
        <div
          className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">
              {isEdit ? "Edit Gedung" : "Tambah Gedung Baru"}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Nama Gedung */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Nama Gedung <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.nama_gedung}
                onChange={(e) => setForm({ ...form, nama_gedung: e.target.value })}
                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                  errors.nama_gedung ? "border-red-300" : "border-slate-200"
                }`}
                placeholder="Gedung Jenderal Sudirman"
              />
              {errors.nama_gedung && (
                <p className="text-xs text-red-500 mt-1">{errors.nama_gedung}</p>
              )}
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Deskripsi
              </label>
              <textarea
                value={form.deskripsi_gedung}
                onChange={(e) => setForm({ ...form, deskripsi_gedung: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                rows={3}
                placeholder="Deskripsi singkat tentang gedung..."
              />
            </div>

            {/* Lokasi */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Lokasi
              </label>
              <input
                type="text"
                value={form.lokasi}
                onChange={(e) => setForm({ ...form, lokasi: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Klaster Fakultas Ilmu Komputer"
              />
            </div>

            {/* Jumlah Lantai */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Jumlah Lantai
              </label>
              <input
                type="number"
                min={1}
                max={99}
                value={form.jumlah_lantai || 1}
                onChange={(e) =>
                  setForm({ ...form, jumlah_lantai: parseInt(e.target.value) || 1 })
                }
                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                  errors.jumlah_lantai ? "border-red-300" : "border-slate-200"
                }`}
              />
              {errors.jumlah_lantai && (
                <p className="text-xs text-red-500 mt-1">{errors.jumlah_lantai}</p>
              )}
            </div>

            {/* Nama Objek Unity */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Nama Objek Unity (unity_object_name)
              </label>
              <input
                type="text"
                value={form.unity_object_name || ""}
                onChange={(e) => setForm({ ...form, unity_object_name: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="gedung_rektorat"
              />
              <p className="text-xs text-slate-400 mt-1">
                Harus sama persis dengan nama GameObject di scene Unity (gunakan lowercase + underscore).
              </p>
            </div>

            {/* URL Foto */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                URL Foto
              </label>
              <input
                type="url"
                value={form.foto_url}
                onChange={(e) => setForm({ ...form, foto_url: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="https://example.com/foto-gedung.jpg"
              />
              {form.foto_url && (
                <div className="mt-2 rounded-lg overflow-hidden border border-slate-200">
                  <img
                    src={form.foto_url}
                    alt="Preview"
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {isEdit ? "Update" : "Simpan"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
