import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { ProgramData } from '../../../types';
import type { FacultyInfo } from '../../../services/api/dataService';

interface ProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (program: Omit<ProgramData, "id"> | ProgramData) => Promise<void>;
  program?: ProgramData;
  faculties: FacultyInfo[];
}

export default function ProgramModal({
  isOpen,
  onClose,
  onSave,
  program,
  faculties,
}: ProgramModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    faculty: "",
    level: "S1" as "S1" | "D3" | "S2",
    students: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (program) {
      setFormData({
        name: program.name,
        faculty: program.faculty,
        level: program.level as "S1" | "D3" | "S2",
        students: program.students,
      });
    } else {
      setFormData({
        name: "",
        faculty: faculties[0]?.name || "",
        level: "S1",
        students: 0,
      });
    }
  }, [program, faculties, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (program) {
        await onSave({ ...formData, id: program.id });
      } else {
        await onSave(formData);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">
            {program ? "Edit Program Studi" : "Tambah Program Studi"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Program Studi *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Teknik Informatika"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fakultas *
              </label>
              <select
                required
                value={formData.faculty}
                onChange={(e) =>
                  setFormData({ ...formData, faculty: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {faculties.map((fac) => (
                  <option key={fac.id} value={fac.name}>
                    {fac.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jenjang *
              </label>
              <select
                required
                value={formData.level}
                onChange={(e) =>
                  setFormData({ ...formData, level: e.target.value as any })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="D3">D3</option>
                <option value="S1">S1</option>
                <option value="S2">S2</option>
                <option value="Profesi">Profesi</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jumlah Mahasiswa *
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.students}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  students: parseInt(e.target.value) || 0,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Total mahasiswa aktif"
            />
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-all disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
