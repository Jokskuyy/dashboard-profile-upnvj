import { Plus, Edit2, Trash2 } from "lucide-react";
import type { StudentData } from "../../../types";
import { usePagination } from "../hooks/usePagination";
import Pagination from "../shared/Pagination";

interface StudentsTableProps {
  students: StudentData[];
  onAdd: () => void;
  onEdit: (student: StudentData) => void;
  onDelete: (student: StudentData) => void;
}

export default function StudentsTable({
  students,
  onAdd,
  onEdit,
  onDelete,
}: StudentsTableProps) {
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
  } = usePagination<StudentData>({ totalItems: students.length });

  const currentData = paginate(students);

  const totalStudents = students.reduce(
    (sum, s) => sum + (s.totalStudents || 0),
    0,
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Data Mahasiswa</h2>
          <p className="text-sm text-slate-500">
            {students.length} Fakultas - Total: {totalStudents.toLocaleString()}{" "}
            mahasiswa
          </p>
        </div>
        <button
          onClick={onAdd}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Tambah Data
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              <th className="px-6 py-4">Fakultas</th>
              <th className="px-6 py-4 text-right">S1/D3</th>
              <th className="px-6 py-4 text-right">S2</th>
              <th className="px-6 py-4 text-right">Total</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {currentData.map((student, idx) => (
              <tr
                key={idx}
                className="hover:bg-slate-50 transition-colors group"
              >
                <td className="px-6 py-4 font-semibold text-slate-900">
                  {student.faculty}
                </td>
                <td className="px-6 py-4 text-slate-600 text-right">
                  {(student.undergraduate || 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-slate-600 text-right">
                  {(student.graduate || 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 font-bold text-slate-900 text-right">
                  {(student.totalStudents || 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(student)}
                      className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(student)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-50 border-t-2 border-slate-300">
            <tr>
              <td className="px-6 py-4 text-sm font-bold text-slate-900">
                TOTAL
              </td>
              <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">
                {students
                  .reduce((sum, s) => sum + (s.undergraduate || 0), 0)
                  .toLocaleString()}
              </td>
              <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                {students
                  .reduce((sum, s) => sum + (s.graduate || 0), 0)
                  .toLocaleString()}
              </td>
              <td className="px-4 py-3 text-sm font-bold text-blue-600 text-right">
                {totalStudents.toLocaleString()}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        totalItems={students.length}
        pageNumbers={pageNumbers}
        onPageChange={setCurrentPage}
        onNext={goToNext}
        onPrev={goToPrev}
        isFirstPage={isFirstPage}
        isLastPage={isLastPage}
        itemLabel="fakultas"
      />
    </div>
  );
}
