import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Accreditation } from "../../types";

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
    program: "",
    level: "",
    accreditor: "",
    validUntil: "",
    status: "active" as "active" | "expired" | "pending",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (accreditation) {
      setFormData({
        program: accreditation.program,
        level: accreditation.level,
        accreditor: accreditation.accreditor,
        validUntil: accreditation.validUntil,
        status: accreditation.status,
      });
    } else {
      setFormData({
        program: "",
        level: "S1",
        accreditor: "BAN-PT",
        validUntil: "",
        status: "active",
      });
    }
  }, [accreditation, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (accreditation) {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">
            {accreditation ? "Edit Akreditasi" : "Tambah Akreditasi"}
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
              Program Studi *
            </label>
            <input
              type="text"
              required
              value={formData.program}
              onChange={(e) =>
                setFormData({ ...formData, program: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Teknik Informatika"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jenjang *
              </label>
              <select
                required
                value={formData.level}
                onChange={(e) =>
                  setFormData({ ...formData, level: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="D3">D3</option>
                <option value="S1">S1</option>
                <option value="S2">S2</option>
                <option value="S3">S3</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lembaga Akreditasi *
              </label>
              <select
                required
                value={formData.accreditor}
                onChange={(e) =>
                  setFormData({ ...formData, accreditor: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="BAN-PT">BAN-PT</option>
                <option value="LAM-PTKes">LAM-PTKes</option>
                <option value="LAMEMBA">LAMEMBA</option>
                <option value="LAM-Infokom">LAM-Infokom</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Berlaku Hingga *
              </label>
              <input
                type="date"
                required
                value={formData.validUntil}
                onChange={(e) =>
                  setFormData({ ...formData, validUntil: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as any })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Aktif</option>
                <option value="pending">Pending</option>
                <option value="expired">Kadaluarsa</option>
              </select>
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
