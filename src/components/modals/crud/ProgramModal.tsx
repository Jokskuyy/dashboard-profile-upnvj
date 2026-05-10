import { useState, useEffect, useRef } from "react";
import { X, BookOpen, Loader2, Save } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import type { ProgramData } from "../../../types";

interface FacultyRow {
  id: number;
  nama_fakultas: string;
}

// Akreditasi options matching the seed data values
const AKREDITASI_OPTIONS = [
  "Unggul",
  "Baik Sekali",
  "Baik",
  "B",
  "Izin Operasional",
  "Ijin Operasional",
];

const JENJANG_OPTIONS = [
  { value: "Vokasi", label: "Vokasi (D3/D4)" },
  { value: "D3", label: "D3" },
  { value: "D4", label: "D4" },
  { value: "Sarjana", label: "Sarjana (S1)" },
  { value: "Magister", label: "Magister (S2)" },
  { value: "Doktor", label: "Doktor (S3)" },
  { value: "Profesi", label: "Profesi" },
  { value: "Spesialis", label: "Spesialis" },
];

interface ProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (program: Omit<ProgramData, "id"> | ProgramData) => Promise<void>;
  program?: ProgramData;
}

interface FormState {
  nama_prodi: string;
  jenjang: string;
  id_fakultas: number;
  akreditasi: string;
}

const INITIAL_FORM: FormState = {
  nama_prodi: "",
  jenjang: "Sarjana",
  id_fakultas: 0,
  akreditasi: "",
};

export default function ProgramModal({
  isOpen,
  onClose,
  onSave,
  program,
}: ProgramModalProps) {
  const [formData, setFormData] = useState<FormState>({ ...INITIAL_FORM });
  const [loading, setLoading] = useState(false);
  const [faculties, setFaculties] = useState<FacultyRow[]>([]);
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

  // Fetch faculties with real DB IDs (avoids NaN from string IDs)
  useEffect(() => {
    if (!isOpen) return;
    const fetchFaculties = async () => {
      try {
        const { data, error } = await supabase
          .from("fakultas")
          .select("id, nama_fakultas")
          .order("nama_fakultas", { ascending: true });
        if (error) throw error;
        setFaculties(data || []);
      } catch (err) {
        console.error("Error fetching faculties:", err);
      }
    };
    fetchFaculties();
  }, [isOpen]);

  // Populate form
  useEffect(() => {
    if (!isOpen) return;

    if (program) {
      // Get the numeric faculty ID — handle both numeric and string IDs
      let fakultasId = 0;
      if (typeof program.id_fakultas === "number") {
        fakultasId = program.id_fakultas;
      } else if (typeof program.id_fakultas === "string") {
        const parsed = parseInt(program.id_fakultas);
        fakultasId = isNaN(parsed) ? 0 : parsed;
      }

      setFormData({
        nama_prodi:
          program.nama_prodi || program.name || "",
        jenjang:
          program.jenjang || program.level || "Sarjana",
        id_fakultas: fakultasId,
        akreditasi:
          (program as Record<string, unknown>).akreditasi as string || "",
      });
    } else {
      setFormData({ ...INITIAL_FORM });
    }

    setLoading(false);
  }, [program, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nama_prodi.trim()) return;
    if (!formData.id_fakultas) return;

    setLoading(true);
    try {
      const saveData: Record<string, unknown> = {
        nama_prodi: formData.nama_prodi,
        jenjang: formData.jenjang,
        id_fakultas: formData.id_fakultas,
        akreditasi: formData.akreditasi || null,
      };

      if (program && "id" in program) {
        saveData.id = program.id;
      }

      await onSave(saveData as Omit<ProgramData, "id"> | ProgramData);
      onClose();
    } catch (error) {
      console.error("Error saving program:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateField = <K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

  const isEditing = Boolean(program && "id" in program);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-hidden"
      style={{ touchAction: "none" }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
        style={{
          animation: "modalIn 0.2s ease-out",
        }}
      >
        {/* ─── Header ─────────────────────────────────── */}
        <div className="relative px-6 py-5 border-b border-slate-100">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-indigo-50/50 to-transparent" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {isEditing ? "Edit Program Studi" : "Tambah Program Studi"}
                </h2>
                <p className="text-xs text-slate-400">
                  {isEditing
                    ? "Perbarui informasi program studi"
                    : "Daftarkan program studi baru"}
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
          className="flex-1 overflow-y-auto p-6 space-y-5"
        >
          {/* Nama Program Studi */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Nama Program Studi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.nama_prodi}
              onChange={(e) => updateField("nama_prodi", e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white placeholder:text-slate-300"
              placeholder="cth. Teknik Informatika"
            />
          </div>

          {/* Fakultas */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Fakultas <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.id_fakultas}
              onChange={(e) =>
                updateField("id_fakultas", parseInt(e.target.value) || 0)
              }
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white appearance-none cursor-pointer"
            >
              <option value={0}>Pilih Fakultas</option>
              {faculties.map((fac) => (
                <option key={fac.id} value={fac.id}>
                  {fac.nama_fakultas}
                </option>
              ))}
            </select>
          </div>

          {/* Row: Jenjang + Akreditasi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Jenjang <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.jenjang}
                onChange={(e) => updateField("jenjang", e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white appearance-none cursor-pointer"
              >
                {JENJANG_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Akreditasi
              </label>
              <select
                value={formData.akreditasi}
                onChange={(e) => updateField("akreditasi", e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white appearance-none cursor-pointer"
              >
                <option value="">Belum Terakreditasi</option>
                {AKREDITASI_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
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
            className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center gap-2"
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
