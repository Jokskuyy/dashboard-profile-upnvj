import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Accreditation } from "../../../types";

interface AccreditationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    accreditation: Omit<Accreditation, "id"> | Accreditation,
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

    if (accreditation) {
      setFormData({
        status: accreditation.status || accreditation.level || "",
        tgl_berlaku:
          typeof accreditation.tgl_berlaku === "string"
            ? accreditation.tgl_berlaku
            : accreditation.tgl_berlaku instanceof Date
              ? accreditation.tgl_berlaku.toISOString().split("T")[0]
              : accreditation.validUntil || "",
        tgl_kadaluarsa:
          typeof accreditation.tgl_kadaluarsa === "string"
            ? accreditation.tgl_kadaluarsa
            : accreditation.tgl_kadaluarsa?.toISOString().split("T")[0] ||
              accreditation.validUntil ||
              "",
        keterangan: accreditation.keterangan || "",
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
      if (accreditation && "id" in accreditation) {
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-hidden"
      style={{ touchAction: "none" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-green-50">
          <h2 className="text-2xl font-bold text-gray-900">
            {accreditation ? "Edit Akreditasi" : "Tambah Akreditasi Baru"}
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
                Status Akreditasi *
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all outline-none appearance-none cursor-pointer"
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tanggal Berlaku *
                </label>
                <input
                  type="date"
                  required
                  value={formData.tgl_berlaku}
                  onChange={(e) =>
                    setFormData({ ...formData, tgl_berlaku: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tanggal Kadaluarsa *
                </label>
                <input
                  type="date"
                  required
                  value={formData.tgl_kadaluarsa}
                  onChange={(e) =>
                    setFormData({ ...formData, tgl_kadaluarsa: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Keterangan
              </label>
              <textarea
                value={formData.keterangan}
                onChange={(e) =>
                  setFormData({ ...formData, keterangan: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all outline-none resize-none"
                placeholder="Keterangan tambahan tentang akreditasi..."
              />
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
