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
      const defaultProdiId = programs.length > 0 
        ? (typeof programs[0].id === 'string' ? parseInt(programs[0].id) : programs[0].id) 
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
      if (student && 'id' in student) {
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
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-emerald-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-white text-xl font-bold tracking-tight">
            {student ? "Edit Data Mahasiswa" : "Tambah Data Mahasiswa"}
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              NIM *
            </label>
            <input
              type="text"
              required
              value={formData.nim}
              onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all outline-none"
              placeholder="Contoh: 2021123456"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Nama Lengkap *
            </label>
            <input
              type="text"
              required
              value={formData.nama_mahasiswa}
              onChange={(e) => setFormData({ ...formData, nama_mahasiswa: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all outline-none"
              placeholder="Contoh: John Doe"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Angkatan *
              </label>
              <input
                type="number"
                required
                value={formData.angkatan}
                onChange={(e) => setFormData({ ...formData, angkatan: parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all outline-none"
                placeholder="2021"
                min="2000"
                max={new Date().getFullYear() + 1}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Status *
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all outline-none appearance-none cursor-pointer"
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
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Program Studi *
            </label>
            <select
              required
              value={formData.id_prodi}
              onChange={(e) => setFormData({ ...formData, id_prodi: parseInt(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all outline-none appearance-none cursor-pointer"
            >
              <option value="">Pilih Program Studi</option>
              {programs.map((prodi) => {
                const prodiId = typeof prodi.id === 'string' ? parseInt(prodi.id) : prodi.id;
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

          {/* Footer */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2.5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
