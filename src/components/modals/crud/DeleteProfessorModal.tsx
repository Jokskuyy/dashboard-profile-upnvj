import { AlertTriangle } from "lucide-react";
import type { Professor } from "../../../types";

interface DeleteProfessorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  professor?: Professor;
}

export default function DeleteProfessorModal({
  isOpen,
  onClose,
  onConfirm,
  professor,
}: DeleteProfessorModalProps) {
  if (!isOpen || !professor) return null;

  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Error deleting professor:", error);
      alert("Gagal menghapus data dosen");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl transform transition-all">
        <div className="p-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 mb-6">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Hapus Data Dosen?
          </h2>

          <p className="text-gray-500 mb-8 leading-relaxed">
            Apakah Anda yakin ingin menghapus data{" "}
            <span className="font-bold text-gray-800">
              {professor.nama_dosen || professor.name}
            </span>
            ? Tindakan ini tidak dapat dibatalkan.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="w-full px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-500/30 transition-all hover:shadow-red-500/40 focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
            >
              Hapus Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
