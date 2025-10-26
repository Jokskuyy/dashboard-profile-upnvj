import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { AssetCategory } from "../../types";

interface AssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (asset: Omit<AssetCategory, "id"> | AssetCategory) => Promise<void>;
  asset?: AssetCategory;
}

export default function AssetModal({
  isOpen,
  onClose,
  onSave,
  asset,
}: AssetModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    color: "blue",
    icon: "Package",
    count: 0,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (asset) {
      setFormData({
        name: asset.name,
        color: asset.color,
        icon: asset.icon,
        count: asset.count,
      });
    } else {
      setFormData({
        name: "",
        color: "blue",
        icon: "Package",
        count: 0,
      });
    }
  }, [asset, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const assetData = {
        ...formData,
        // Keep existing details if editing, otherwise empty array
        details: asset?.details || [],
      };

      if (asset?.id) {
        await onSave({ ...assetData, id: asset.id });
      } else {
        await onSave(assetData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving asset:", error);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-900">
            {asset ? "Edit Kategori Aset" : "Tambah Kategori Aset"}
          </h2>
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
              Nama Kategori <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              placeholder="Contoh: Ruang Kelas"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Warna
            </label>
            <select
              value={formData.color}
              onChange={(e) =>
                setFormData({ ...formData, color: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="blue">Biru</option>
              <option value="green">Hijau</option>
              <option value="purple">Ungu</option>
              <option value="orange">Orange</option>
              <option value="red">Merah</option>
              <option value="yellow">Kuning</option>
              <option value="pink">Pink</option>
              <option value="indigo">Indigo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon (Lucide Icon Name)
            </label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) =>
                setFormData({ ...formData, icon: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Package, Users, BookOpen, dll"
            />
            <p className="text-xs text-gray-500 mt-1">
              Gunakan nama icon dari Lucide React (contoh: Package, Users,
              BookOpen)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jumlah Item
            </label>
            <input
              type="number"
              value={formData.count}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  count: parseInt(e.target.value) || 0,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              placeholder="0"
            />
          </div>

          {asset && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Catatan:</strong> Detail item dalam kategori ini tetap
                dipertahankan. Untuk mengedit detail item, gunakan fitur edit
                detail setelah menyimpan.
              </p>
            </div>
          )}

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
