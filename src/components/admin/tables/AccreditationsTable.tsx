import { Plus, Edit2, Trash2 } from "lucide-react";
import type { Accreditation } from "../../../types";
import { usePagination } from "../hooks/usePagination";
import Pagination from "../shared/Pagination";

interface AccreditationsTableProps {
  accreditations: Accreditation[];
  onAdd: () => void;
  onEdit: (accreditation: Accreditation) => void;
  onDelete: (accreditation: Accreditation) => void;
}

const getStatusBadge = (status: string) => {
  const styles = {
    active: "bg-green-100 text-green-700",
    expired: "bg-red-100 text-red-700",
    pending: "bg-yellow-100 text-yellow-700",
  };
  return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-700";
};

export default function AccreditationsTable({
  accreditations,
  onAdd,
  onEdit,
  onDelete,
}: AccreditationsTableProps) {
  const {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    pageNumbers,
    paginate,
    goToNext,
    goToPrev,
    isFirstPage,
    isLastPage,
    setCurrentPage,
  } = usePagination<Accreditation>({ totalItems: accreditations.length });

  const currentData = paginate(accreditations);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Daftar Akreditasi
          </h2>
          <p className="text-sm text-slate-500">
            Kelola data akreditasi program studi.
          </p>
        </div>
        <button
          onClick={onAdd}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Tambah Akreditasi
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              <th className="px-6 py-4">Program</th>
              <th className="px-6 py-4">Jenjang</th>
              <th className="px-6 py-4">Akreditor</th>
              <th className="px-6 py-4">Berlaku Hingga</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {currentData.map((acc) => (
              <tr
                key={acc.id}
                className="hover:bg-slate-50 transition-colors group"
              >
                <td className="px-6 py-4 font-semibold text-slate-900">
                  {acc.program}
                </td>
                <td className="px-6 py-4 text-slate-600">{acc.level}</td>
                <td className="px-6 py-4 text-slate-600">{acc.accreditor}</td>
                <td className="px-6 py-4 text-slate-600">
                  {acc.validUntil
                    ? new Date(acc.validUntil).toLocaleDateString("id-ID")
                    : "-"}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                      acc.status,
                    )}`}
                  >
                    {acc.status === "active"
                      ? "Aktif"
                      : acc.status === "expired"
                        ? "Kadaluarsa"
                        : "Pending"}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(acc)}
                      className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(acc)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        totalItems={accreditations.length}
        pageNumbers={pageNumbers}
        onPageChange={setCurrentPage}
        onNext={goToNext}
        onPrev={goToPrev}
        isFirstPage={isFirstPage}
        isLastPage={isLastPage}
        itemLabel="akreditasi"
      />
    </div>
  );
}
