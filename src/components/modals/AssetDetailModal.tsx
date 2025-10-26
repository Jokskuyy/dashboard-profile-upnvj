import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import type { AssetDetail } from "../../types";

interface AssetDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (detail: Omit<AssetDetail, "id"> | AssetDetail) => Promise<void>;
  detail?: AssetDetail;
  categoryName: string;
}

export default function AssetDetailModal({
  isOpen,
  onClose,
  onSave,
  detail,
  categoryName,
}: AssetDetailModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    room: "",
    building: "",
    capacity: 0,
    equipment: [] as string[],
    description: "",
  });
  const [newEquipment, setNewEquipment] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (detail) {
      setFormData({
        name: detail.name,
        room: detail.room,
        building: detail.building,
        capacity: detail.capacity || 0,
        equipment: detail.equipment || [],
        description: detail.description || "",
      });
    } else {
      setFormData({
        name: "",
        room: "",
        building: "",
        capacity: 0,
        equipment: [],
        description: "",
      });
    }
  }, [detail, isOpen]);

  const handleAddEquipment = () => {
    if (newEquipment.trim()) {
      setFormData({
        ...formData,
        equipment: [...formData.equipment, newEquipment.trim()],
      });
      setNewEquipment("");
    }
  };

  const handleRemoveEquipment = (index: number) => {
    setFormData({
      ...formData,
      equipment: formData.equipment.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const detailData = {
        ...formData,
        capacity: formData.capacity || undefined,
        equipment:
          formData.equipment.length > 0 ? formData.equipment : undefined,
        description: formData.description || undefined,
      };

      if (detail?.id) {
        await onSave({ ...detailData, id: detail.id });
      } else {
        await onSave(detailData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving asset detail:", error);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {detail ? "Edit Item" : "Tambah Item"}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Kategori: {categoryName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Item <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              placeholder="Contoh: Ruang Kelas A101"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ruangan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.room}
                onChange={(e) =>
                  setFormData({ ...formData, room: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                placeholder="Contoh: A101"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gedung <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.building}
                onChange={(e) =>
                  setFormData({ ...formData, building: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                placeholder="Contoh: Gedung A"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kapasitas (orang)
            </label>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  capacity: parseInt(e.target.value) || 0,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Peralatan
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newEquipment}
                onChange={(e) => setNewEquipment(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddEquipment();
                  }
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tambah peralatan..."
              />
              <button
                type="button"
                onClick={handleAddEquipment}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Tambah
              </button>
            </div>
            {formData.equipment.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.equipment.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full"
                  >
                    <span className="text-sm text-gray-700">{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveEquipment(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Deskripsi tambahan..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={saving}
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={saving}
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
