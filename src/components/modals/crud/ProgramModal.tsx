import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { ProgramData, Accreditation } from "../../../types";
import type { FacultyInfo } from "../../../services/api/dataService";

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

    if (program) {
      const fakultasId =
        typeof program.id_fakultas === "string"
          ? parseInt(program.id_fakultas)
          : program.id_fakultas;
      const akreditasiId =
        typeof program.id_akreditasi === "string"
          ? parseInt(program.id_akreditasi)
          : program.id_akreditasi;

      setFormData({
        nama_prodi: program.nama_prodi || program.name || "",
        jenjang: program.jenjang || program.level || "S1",
        id_fakultas: fakultasId || 0,
        id_akreditasi: akreditasiId || 0,
      });
    } else {
      const firstFacultyId =
        typeof faculties[0]?.id === "string"
          ? parseInt(faculties[0].id)
          : faculties[0]?.id || 0;
      const firstAccreditationId =
        typeof accreditations[0]?.id === "string"
          ? parseInt(accreditations[0].id)
          : accreditations[0]?.id || 0;

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
      if (program && "id" in program) {
        await onSave({
          ...formData,
          jenjang: formData.jenjang as "D3" | "S1" | "S2" | "S3",
          id: program.id,
        });
      } else {
        await onSave({
          ...formData,
          jenjang: formData.jenjang as "D3" | "S1" | "S2" | "S3",
        });
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
            {program ? "Edit Program Studi" : "Tambah Program Studi Baru"}
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
                Nama Program Studi *
              </label>
              <input
                type="text"
                required
                value={formData.nama_prodi}
                onChange={(e) =>
                  setFormData({ ...formData, nama_prodi: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all outline-none"
                placeholder="Contoh: Teknik Informatika"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Fakultas *
              </label>
              <select
                required
                value={formData.id_fakultas}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    id_fakultas: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all outline-none appearance-none cursor-pointer"
              >
                <option value="">Pilih Fakultas</option>
                {faculties.map((fac) => {
                  const facId =
                    typeof fac.id === "string" ? parseInt(fac.id) : fac.id;
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Jenjang *
                </label>
                <select
                  required
                  value={formData.jenjang}
                  onChange={(e) =>
                    setFormData({ ...formData, jenjang: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all outline-none appearance-none cursor-pointer"
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Akreditasi *
                </label>
                <select
                  required
                  value={formData.id_akreditasi}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      id_akreditasi: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all outline-none appearance-none cursor-pointer"
                >
                  <option value="">Pilih Akreditasi</option>
                  {accreditations.map((acc) => {
                    const accId =
                      typeof acc.id === "string" ? parseInt(acc.id) : acc.id;
                    return (
                      <option key={accId} value={accId}>
                        {acc.status || acc.level || "N/A"}
                      </option>
                    );
                  })}
                </select>
              </div>
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
