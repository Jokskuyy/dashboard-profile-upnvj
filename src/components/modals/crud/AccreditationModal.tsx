import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Accreditation } from '../../../types';

interface AccreditationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    accreditation: Omit<Accreditation, "id"> | Accreditation
  ) => Promise<void>;
  accreditation?: Accreditation;
}

export default function AccreditationModal({
  isOpen,
  onClose,
  onSave,
  accreditation,
}: AccreditationModalProps) {
  const [formData, setFormData] = useState({
    status: "",
    tgl_berlaku: "",
    tgl_kadaluarsa: "",
    keterangan: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    
    if (accreditation) {
      setFormData({
        status: accreditation.status || accreditation.level || "",
        tgl_berlaku: accreditation.tgl_berlaku || accreditation.validFrom || "",
        tgl_kadaluarsa: accreditation.tgl_kadaluarsa || accreditation.validUntil || "",
        keterangan: accreditation.keterangan || accreditation.notes || "",
      });
    } else {
      setFormData({
        status: "A",
        tgl_berlaku: "",
        tgl_kadaluarsa: "",
        keterangan: "",
      });
    }
  }, [accreditation, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (accreditation && 'id' in accreditation) {
        await onSave({ ...formData, id: accreditation.id });
      } else {
        await onSave(formData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving accreditation:", error);
      alert("Gagal menyimpan data akreditasi");
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
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-emerald-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-white text-xl font-bold tracking-tight">
            {accreditation ? "Edit Akreditasi" : "Tambah Akreditasi"}
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
              Status Akreditasi *
            </label>
            <select
              required
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all outline-none appearance-none cursor-pointer"
            >
              <option value="">Pilih Status</option>
              <option value="A">A (Unggul)</option>
              <option value="B">B (Baik Sekali)</option>
              <option value="C">C (Baik)</option>
              <option value="Baik Sekali">Baik Sekali</option>
              <option value="Unggul">Unggul</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Tanggal Berlaku *
              </label>
              <input
                type="date"
                required
                value={formData.tgl_berlaku}
                onChange={(e) =>
                  setFormData({ ...formData, tgl_berlaku: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Tanggal Kadaluarsa *
              </label>
              <input
                type="date"
                required
                value={formData.tgl_kadaluarsa}
                onChange={(e) =>
                  setFormData({ ...formData, tgl_kadaluarsa: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Keterangan
            </label>
            <textarea
              value={formData.keterangan}
              onChange={(e) =>
                setFormData({ ...formData, keterangan: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all outline-none resize-none"
              placeholder="Keterangan tambahan tentang akreditasi..."
            />
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
