import { Plus, Package, Edit2, Trash2 } from "lucide-react";
import type { Professor } from "../../../types";
import type { FacultyInfo } from "../../../services/api/supabaseDataService";
import { usePagination } from "../hooks/usePagination";
import Pagination from "../shared/Pagination";

interface ProfessorsTableProps {
  professors: Professor[];
  faculties: FacultyInfo[];
  onAdd: () => void;
  onEdit: (professor: Professor) => void;
  onDelete: (professor: Professor) => void;
}

export default function ProfessorsTable({
  professors,
  onAdd,
  onEdit,
  onDelete,
}: ProfessorsTableProps) {
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
  } = usePagination<Professor>({ totalItems: professors.length });

  const currentData = paginate(professors);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Daftar Dosen</h2>
          <p className="text-sm text-slate-500">
            Kelola data pengajar aktif di universitas.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
            <Package className="w-5 h-5" />
          </button>
          <button
            onClick={onAdd}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Tambah Dosen
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              <th className="px-6 py-4">Nama Dosen</th>
              <th className="px-6 py-4">Gelar</th>
              <th className="px-6 py-4">Fakultas</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {currentData.map((prof) => (
              <tr
                key={prof.id}
                className="hover:bg-slate-50 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                      {(prof.nama_dosen || prof.name || "NA")
                        .substring(0, 2)
                        .toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {prof.nama_dosen || prof.name}
                      </p>
                      <p className="text-xs text-slate-500">{prof.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                    {prof.title}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">{prof.faculty}</td>
                <td className="px-6 py-4 text-slate-500">{prof.email}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(prof)}
                      className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(prof)}
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
        totalItems={professors.length}
        pageNumbers={pageNumbers}
        onPageChange={setCurrentPage}
        onNext={goToNext}
        onPrev={goToPrev}
        isFirstPage={isFirstPage}
        isLastPage={isLastPage}
        itemLabel="dosen"
      />
    </div>
  );
}
