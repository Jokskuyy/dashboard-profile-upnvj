import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import type { Professor, ProgramData, ProgramStudi } from "../../../types";
import type { FacultyInfo } from "../../../services/api/dataService";

interface ProfessorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (professor: Omit<Professor, "id"> | Professor) => Promise<void>;
  professor?: Professor;
  faculties: FacultyInfo[];
  programs?: (ProgramData | ProgramStudi)[]; // Support both formats
}

export default function ProfessorModal({
  isOpen,
  onClose,
  onSave,
  professor,

  programs = [],
}: ProfessorModalProps) {
  const [formData, setFormData] = useState({
    nidn: "",
    nama_dosen: "",
    jabatan_fungsional: "",
    id_prodi: 0,
    expertise: [] as string[],
    email: "",
    id_sinta: "",
    id_scopus: "",
    id_gs: "",
  });
  const [loading, setLoading] = useState(false);
  const [expertiseInput, setExpertiseInput] = useState("");

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

    if (professor) {
      // Parse kompetensi from JSON string to array
      let expertiseArray: string[] = [];
      try {
        if (professor.kompetensi) {
          expertiseArray = JSON.parse(professor.kompetensi);
        }
      } catch (e) {
        // If not JSON, treat as comma-separated string
        expertiseArray = professor.kompetensi
          ? professor.kompetensi.split(",").map((s) => s.trim())
          : [];
      }

      setFormData({
        nidn: professor.nidn,
        nama_dosen: professor.nama_dosen,
        jabatan_fungsional: professor.jabatan_fungsional,
        id_prodi: professor.id_prodi,
        expertise: expertiseArray,
        email: professor.email || "",
        id_sinta: professor.id_sinta || "",
        id_scopus: professor.id_scopus || "",
        id_gs: professor.id_gs || "",
      });
    } else {
      const defaultProdiId =
        programs.length > 0
          ? typeof programs[0].id === "string"
            ? parseInt(programs[0].id)
            : programs[0].id
          : 0;

      setFormData({
        nidn: "",
        nama_dosen: "",
        jabatan_fungsional: "",
        id_prodi: defaultProdiId,
        expertise: [],
        email: "",
        id_sinta: "",
        id_scopus: "",
        id_gs: "",
      });
    }
  }, [professor, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert expertise array to JSON string for database
      const dataToSave = {
        ...formData,
        kompetensi: JSON.stringify(formData.expertise),
      };

      if (professor) {
        await onSave({ ...dataToSave, id: professor.id });
      } else {
        await onSave(dataToSave);
      }
      onClose();
    } catch (error) {
      console.error("Error saving professor:", error);
      alert("Gagal menyimpan data dosen");
    } finally {
      setLoading(false);
    }
  };

  const addExpertise = () => {
    if (expertiseInput.trim()) {
      setFormData({
        ...formData,
        expertise: [...formData.expertise, expertiseInput.trim()],
      });
      setExpertiseInput("");
    }
  };

  const removeExpertise = (index: number) => {
    setFormData({
      ...formData,
      expertise: formData.expertise.filter((_, i) => i !== index),
    });
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-green-50">
          <h2 className="text-2xl font-bold text-gray-900">
            {professor ? "Edit Data Dosen" : "Tambah Dosen Baru"}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    htmlFor="nidn"
                  >
                    NIP / NIDN *
                  </label>
                  <input
                    type="text"
                    id="nidn"
                    required
                    value={formData.nidn}
                    onChange={(e) =>
                      setFormData({ ...formData, nidn: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all outline-none"
                    placeholder="Contoh: 198501012015011001"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    htmlFor="nama_dosen"
                  >
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    id="nama_dosen"
                    required
                    value={formData.nama_dosen}
                    onChange={(e) =>
                      setFormData({ ...formData, nama_dosen: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all outline-none"
                    placeholder="Contoh: Dr. Jane Doe, S.Kom., M.TI."
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    htmlFor="email"
                  >
                    Email Institusi *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all outline-none"
                    placeholder="nama@upnvj.ac.id"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    htmlFor="id_prodi"
                  >
                    Program Studi *
                  </label>
                  <select
                    id="id_prodi"
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
                      // Handle both ProgramData and ProgramStudi types
                      const prodiId =
                        typeof prodi.id === "string"
                          ? parseInt(prodi.id)
                          : prodi.id;
                      const prodiName =
                        "nama_prodi" in prodi ? prodi.nama_prodi : prodi.name;
                      const prodiLevel =
                        "jenjang" in prodi ? prodi.jenjang : prodi.level;

                      return (
                        <option key={prodiId} value={prodiId}>
                          {prodiName} ({prodiLevel})
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    htmlFor="jabatan_fungsional"
                  >
                    Jabatan Fungsional *
                  </label>
                  <input
                    type="text"
                    id="jabatan_fungsional"
                    required
                    value={formData.jabatan_fungsional}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        jabatan_fungsional: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all outline-none"
                    placeholder="Contoh: Profesor, Lektor Kepala, Asisten Ahli"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    htmlFor="kompetensi"
                  >
                    Kepakaran / Kompetensi
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="kompetensi"
                      value={expertiseInput}
                      onChange={(e) => setExpertiseInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), addExpertise())
                      }
                      className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all outline-none"
                      placeholder="Tambah keahlian..."
                    />
                    <button
                      type="button"
                      onClick={addExpertise}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Tambah
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.expertise.map((item, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-600"
                      >
                        {item}
                        <button
                          type="button"
                          onClick={() => removeExpertise(index)}
                          className="hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Academic IDs Section */}
            <div className="mt-10 pt-8 border-t border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6">
                Informasi Akademik (ID)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label
                    className="block text-xs font-bold text-gray-700 mb-2"
                    htmlFor="id_sinta"
                  >
                    ID SINTA
                  </label>
                  <input
                    type="text"
                    id="id_sinta"
                    value={formData.id_sinta}
                    onChange={(e) =>
                      setFormData({ ...formData, id_sinta: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all outline-none"
                    placeholder="Contoh: 6021453"
                  />
                </div>

                <div>
                  <label
                    className="block text-xs font-bold text-gray-700 mb-2"
                    htmlFor="id_scopus"
                  >
                    ID SCOPUS
                  </label>
                  <input
                    type="text"
                    id="id_scopus"
                    value={formData.id_scopus}
                    onChange={(e) =>
                      setFormData({ ...formData, id_scopus: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all outline-none"
                    placeholder="Contoh: 5720490000"
                  />
                </div>

                <div>
                  <label
                    className="block text-xs font-bold text-gray-700 mb-2"
                    htmlFor="id_gs"
                  >
                    ID GOOGLE SCHOLAR
                  </label>
                  <input
                    type="text"
                    id="id_gs"
                    value={formData.id_gs}
                    onChange={(e) =>
                      setFormData({ ...formData, id_gs: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all outline-none"
                    placeholder="Contoh: rYv_X_8AAAAJ"
                  />
                </div>
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
