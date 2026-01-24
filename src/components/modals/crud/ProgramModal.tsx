import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { ProgramData, Accreditation } from '../../../types';
import type { FacultyInfo } from '../../../services/api/dataService';

interface ProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (program: Omit<ProgramData, "id"> | ProgramData) => Promise<void>;
  program?: ProgramData;
  faculties: FacultyInfo[];
  accreditations: Accreditation[];
}

export default function ProgramModal({
  isOpen,
  onClose,
  onSave,
  program,
  faculties,
  accreditations,
}: ProgramModalProps) {
  const [formData, setFormData] = useState({
    nama_prodi: "",
    jenjang: "S1",
    id_fakultas: 0,
    id_akreditasi: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    
    if (program) {
      const fakultasId = typeof program.id_fakultas === 'string' ? parseInt(program.id_fakultas) : program.id_fakultas;
      const akreditasiId = typeof program.id_akreditasi === 'string' ? parseInt(program.id_akreditasi) : program.id_akreditasi;
      
      setFormData({
        nama_prodi: program.nama_prodi || program.name || "",
        jenjang: program.jenjang || program.level || "S1",
        id_fakultas: fakultasId || 0,
        id_akreditasi: akreditasiId || 0,
      });
    } else {
      const firstFacultyId = typeof faculties[0]?.id === 'string' ? parseInt(faculties[0].id) : faculties[0]?.id || 0;
      const firstAccreditationId = typeof accreditations[0]?.id === 'string' ? parseInt(accreditations[0].id) : accreditations[0]?.id || 0;
      
      setFormData({
        nama_prodi: "",
        jenjang: "S1",
        id_fakultas: firstFacultyId,
        id_akreditasi: firstAccreditationId,
      });
    }
  }, [program, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (program && 'id' in program) {
        await onSave({ ...formData, jenjang: formData.jenjang as "D3" | "S1" | "S2" | "S3", id: program.id });
      } else {
        await onSave({ ...formData, jenjang: formData.jenjang as "D3" | "S1" | "S2" | "S3" });
      }
      onClose();
    } catch (error) {
      console.error("Error saving program:", error);
      alert("Gagal menyimpan data program studi");
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
            {program ? "Edit Program Studi" : "Tambah Program Studi"}
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
              Nama Program Studi *
            </label>
            <input
              type="text"
              required
              value={formData.nama_prodi}
              onChange={(e) =>
                setFormData({ ...formData, nama_prodi: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all outline-none"
              placeholder="Contoh: Teknik Informatika"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Fakultas *
            </label>
            <select
              required
              value={formData.id_fakultas}
              onChange={(e) =>
                setFormData({ ...formData, id_fakultas: parseInt(e.target.value) })
              }
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all outline-none appearance-none cursor-pointer"
            >
              <option value="">Pilih Fakultas</option>
              {faculties.map((fac) => {
                const facId = typeof fac.id === 'string' ? parseInt(fac.id) : fac.id;
                return (
                  <option key={facId} value={facId}>
                    {fac.name}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Jenjang *
              </label>
              <select
                required
                value={formData.jenjang}
                onChange={(e) =>
                  setFormData({ ...formData, jenjang: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all outline-none appearance-none cursor-pointer"
              >
                <option value="D3">D3</option>
                <option value="D4">D4</option>
                <option value="S1">S1</option>
                <option value="S2">S2</option>
                <option value="S3">S3</option>
                <option value="Profesi">Profesi</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Akreditasi *
              </label>
              <select
                required
                value={formData.id_akreditasi}
                onChange={(e) =>
                  setFormData({ ...formData, id_akreditasi: parseInt(e.target.value) })
                }
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all outline-none appearance-none cursor-pointer"
              >
                <option value="">Pilih Akreditasi</option>
                {accreditations.map((acc) => {
                  const accId = typeof acc.id === 'string' ? parseInt(acc.id) : acc.id;
                  return (
                    <option key={accId} value={accId}>
                      {acc.status || acc.level || 'N/A'}
                    </option>
                  );
                })}
              </select>
            </div>
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
