import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { StudentData } from '../../../types';
import type { FacultyInfo } from '../../../services/api/dataService';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: StudentData) => Promise<void>;
  student?: StudentData;
  faculties: FacultyInfo[];
}

export default function StudentModal({
  isOpen,
  onClose,
  onSave,
  student,
  faculties,
}: StudentModalProps) {
  const [formData, setFormData] = useState({
    faculty: "",
    undergraduate: 0,
    graduate: 0,
    postgraduate: 0,
    totalStudents: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData({
        faculty: student.faculty,
        undergraduate: student.undergraduate,
        graduate: student.graduate,
        postgraduate: student.postgraduate,
        totalStudents: student.totalStudents,
      });
    } else {
      setFormData({
        faculty: faculties[0]?.name || "",
        undergraduate: 0,
        graduate: 0,
        postgraduate: 0,
        totalStudents: 0,
      });
    }
  }, [student, faculties, isOpen]);

  // Auto calculate total
  useEffect(() => {
    const total =
      formData.undergraduate + formData.graduate + formData.postgraduate;
    setFormData((prev) => ({ ...prev, totalStudents: total }));
  }, [formData.undergraduate, formData.graduate, formData.postgraduate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave(formData);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">
            {student ? "Edit Data Mahasiswa" : "Tambah Data Mahasiswa"}
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
              S1/D3 *
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.undergraduate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  undergraduate: parseInt(e.target.value) || 0,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Jumlah mahasiswa S1/D3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              S2 *
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.graduate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  graduate: parseInt(e.target.value) || 0,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Jumlah mahasiswa S2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              S3 *
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.postgraduate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  postgraduate: parseInt(e.target.value) || 0,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Jumlah mahasiswa S3"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Total Mahasiswa:
              </span>
              <span className="text-2xl font-bold text-blue-600">
                {formData.totalStudents.toLocaleString()}
              </span>
            </div>
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
