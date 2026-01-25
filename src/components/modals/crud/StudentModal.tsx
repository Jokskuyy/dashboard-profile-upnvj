import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { StudentData, ProgramData } from "../../../types";

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Omit<StudentData, "id"> | StudentData) => Promise<void>;
  student?: StudentData;
  programs?: ProgramData[];
}

export default function StudentModal({
  isOpen,
  onClose,
  onSave,
  student,
  programs = [],
}: StudentModalProps) {
  const [formData, setFormData] = useState({
    nim: "",
    nama_mahasiswa: "",
    angkatan: new Date().getFullYear(),
    status: "Aktif",
    id_prodi: 0,
  });
  const [loading, setLoading] = useState(false);

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
    if (!isOpen) return;

    if (student) {
      setFormData({
        nim: student.nim || "",
        nama_mahasiswa: student.nama_mahasiswa || "",
        angkatan: student.angkatan || new Date().getFullYear(),
        status: student.status || "Aktif",
        id_prodi: student.id_prodi || 0,
      });
    } else {
      const defaultProdiId =
        programs.length > 0
          ? typeof programs[0].id === "string"
            ? parseInt(programs[0].id)
            : programs[0].id
          : 0;

      setFormData({
        nim: "",
        nama_mahasiswa: "",
        angkatan: new Date().getFullYear(),
        status: "Aktif",
        id_prodi: defaultProdiId,
      });
    }
  }, [student, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (student && "id" in student) {
        await onSave({ ...formData, id: student.id });
      } else {
        await onSave(formData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving student data:", error);
      alert("Gagal menyimpan data mahasiswa");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-hidden"
      style={{ touchAction: "none" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-green-50">
          <h2 className="text-2xl font-bold text-gray-900">
            {student ? "Edit Data Mahasiswa" : "Tambah Mahasiswa Baru"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                NIM *
              </label>
              <input
                type="text"
                required
                value={formData.nim}
                onChange={(e) =>
                  setFormData({ ...formData, nim: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all outline-none"
                placeholder="Contoh: 2021123456"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Lengkap *
              </label>
              <input
                type="text"
                required
                value={formData.nama_mahasiswa}
                onChange={(e) =>
                  setFormData({ ...formData, nama_mahasiswa: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all outline-none"
                placeholder="Contoh: John Doe"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Angkatan *
                </label>
                <input
                  type="number"
                  required
                  value={formData.angkatan}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      angkatan: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all outline-none"
                  placeholder="2021"
                  min="2000"
                  max={new Date().getFullYear() + 1}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all outline-none appearance-none cursor-pointer"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Cuti">Cuti</option>
                  <option value="Lulus">Lulus</option>
                  <option value="DO">DO</option>
                  <option value="Mengundurkan Diri">Mengundurkan Diri</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Program Studi *
              </label>
              <select
                required
                value={formData.id_prodi}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    id_prodi: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all outline-none appearance-none cursor-pointer"
              >
                <option value="">Pilih Program Studi</option>
                {programs.map((prodi) => {
                  const prodiId =
                    typeof prodi.id === "string"
                      ? parseInt(prodi.id)
                      : prodi.id;
                  const prodiName = prodi.nama_prodi || prodi.name;
                  const prodiLevel = prodi.jenjang || prodi.level;

                  return (
                    <option key={prodiId} value={prodiId}>
                      {prodiName} ({prodiLevel})
                    </option>
                  );
                })}
              </select>
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
