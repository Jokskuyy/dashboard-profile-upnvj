import { useState } from "react";
import { Plus, Edit2, Trash2, Search, BookOpen } from "lucide-react";
import type { ProgramData } from "../../../types";
import type { FacultyInfo } from "../../../services/api/dataService";
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
  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("Semua");

  // Unique levels
  const levels = ["Semua", ...new Set(programs.map((p) => p.level))];

  // Filter
  const filtered = programs.filter((p) => {
    const matchesLevel = selectedLevel === "Semua" || p.level === selectedLevel;
    const matchesSearch =
      !search ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.faculty?.toLowerCase().includes(search.toLowerCase());
    return matchesLevel && matchesSearch;
  });

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
  } = usePagination<ProgramData>({ totalItems: filtered.length });

  const currentData = paginate(filtered);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleLevelChange = (value: string) => {
    setSelectedLevel(value);
    setCurrentPage(1);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Program Studi</h2>
          <p className="text-sm text-slate-500">{filtered.length} program</p>
        </div>
        <button
          onClick={onAdd}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-semibold text-sm shadow-sm flex items-center gap-2 transition-colors active:scale-[0.98] w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          Tambah Program
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari program studi atau fakultas..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <select
          value={selectedLevel}
          onChange={(e) => handleLevelChange(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent sm:w-40"
        >
          {levels.map((lvl) => (
            <option key={lvl} value={lvl}>{lvl}</option>
          ))}
        </select>
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                <th className="px-5 py-3">Nama Program</th>
                <th className="px-5 py-3">Jenjang</th>
                <th className="px-5 py-3">Fakultas</th>
                <th className="px-5 py-3 text-center w-20">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {currentData.map((program) => (
                <tr key={program.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3 font-medium text-slate-900">{program.name}</td>
                  <td className="px-5 py-3">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {program.level}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-500">{program.faculty}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onEdit(program)}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(program)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus"
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
      </div>

      {/* Mobile card view */}
      <div className="sm:hidden space-y-2">
        {currentData.map((program) => (
          <div
            key={program.id}
            className="border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{program.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-block px-2 py-0.5 text-[11px] font-medium rounded-full bg-blue-50 text-blue-700">
                  {program.level}
                </span>
                <span className="text-xs text-slate-400 truncate">{program.faculty}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => onEdit(program)}
                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(program)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <BookOpen className="w-14 h-14 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">Tidak ada program studi</p>
          <p className="text-sm mt-1">
            {search ? `Tidak ditemukan untuk "${search}"` : "Belum ada program studi terdaftar"}
          </p>
        </div>
      )}

      {/* Pagination */}
      {filtered.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={filtered.length}
          pageNumbers={pageNumbers}
          onPageChange={setCurrentPage}
          onNext={goToNext}
          onPrev={goToPrev}
          isFirstPage={isFirstPage}
          isLastPage={isLastPage}
          itemLabel="program studi"
        />
      )}
    </div>
  );
}
