import { Plus, Edit2, Trash2 } from "lucide-react";
import type { ProgramData } from "../../../types";
import type { FacultyInfo } from "../../../services/api/supabaseDataService";
import { usePagination } from "../hooks/usePagination";
import Pagination from "../shared/Pagination";

interface ProgramsTableProps {
  programs: ProgramData[];
  faculties: FacultyInfo[];
  onAdd: () => void;
  onEdit: (program: ProgramData) => void;
  onDelete: (program: ProgramData) => void;
}

export default function ProgramsTable({
  programs,
  onAdd,
  onEdit,
  onDelete,
}: ProgramsTableProps) {
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
  } = usePagination<ProgramData>({ totalItems: programs.length });

  const currentData = paginate(programs);

  const totalStudents = programs.reduce((sum, p) => sum + (p.students || 0), 0);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Program Studi</h2>
          <p className="text-sm text-slate-500">
            {programs.length} Program - Total: {totalStudents.toLocaleString()}{" "}
            mahasiswa
          </p>
        </div>
        <button
          onClick={onAdd}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Tambah Program
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              <th className="px-6 py-4">Nama Program</th>
              <th className="px-6 py-4">Jenjang</th>
              <th className="px-6 py-4">Fakultas</th>
              <th className="px-6 py-4 text-right">Mahasiswa</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {currentData.map((program) => (
              <tr
                key={program.id}
                className="hover:bg-slate-50 transition-colors group"
              >
                <td className="px-6 py-4 font-semibold text-slate-900">
                  {program.name}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {program.level}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">{program.faculty}</td>
                <td className="px-6 py-4 text-slate-900 text-right font-bold">
                  {(program.students || 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(program)}
                      className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(program)}
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
        totalItems={programs.length}
        pageNumbers={pageNumbers}
        onPageChange={setCurrentPage}
        onNext={goToNext}
        onPrev={goToPrev}
        isFirstPage={isFirstPage}
        isLastPage={isLastPage}
        itemLabel="program studi"
      />
    </div>
  );
}
