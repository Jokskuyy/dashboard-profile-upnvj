import { useState, useEffect } from "react";
import { Plus, Building2, Edit2, Trash2, RefreshCw, Search } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import type { GedungData } from "../../../services/api/dataService";
import { usePagination } from "../hooks/usePagination";
import Pagination from "../shared/Pagination";

interface BuildingsTableProps {
  onAdd: () => void;
  onEdit: (building: GedungData) => void;
  onDelete: (building: GedungData) => void;
}

export default function BuildingsTable({
  onAdd,
  onEdit,
  onDelete,
}: BuildingsTableProps) {
  const [buildings, setBuildings] = useState<GedungData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchBuildings();
  }, []);

  const fetchBuildings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("gedung")
        .select("*")
        .order("nama_gedung", { ascending: true });

      if (error) throw error;
      setBuildings(data || []);
    } catch (error) {
      console.error("Error fetching buildings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter by search
  const filteredBuildings = buildings.filter((b) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      b.nama_gedung.toLowerCase().includes(q) ||
      b.lokasi?.toLowerCase().includes(q) ||
      b.deskripsi_gedung?.toLowerCase().includes(q)
    );
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
  } = usePagination<GedungData>({ totalItems: filteredBuildings.length, itemsPerPage: 10 });

  const currentItems = paginate(filteredBuildings);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Daftar Gedung</h2>
          <p className="text-sm text-slate-500">
            {filteredBuildings.length} gedung
          </p>
        </div>
        <button
          onClick={onAdd}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-semibold text-sm shadow-sm flex items-center gap-2 transition-colors active:scale-[0.98] w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          Tambah Gedung
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama gedung atau lokasi..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                <th className="px-5 py-3">Nama Gedung</th>
                <th className="px-5 py-3">Lokasi</th>
                <th className="px-5 py-3 text-center">Lantai</th>
                <th className="px-5 py-3 text-center">Foto</th>
                <th className="px-5 py-3 text-center w-20">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {currentItems.map((building) => (
                <tr key={building.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-slate-900">{building.nama_gedung}</p>
                      {building.unity_object_name && (
                        <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                          {building.unity_object_name}
                        </span>
                      )}
                    </div>
                    {building.deskripsi_gedung && (
                      <p className="text-xs text-slate-400 truncate max-w-xs mt-0.5">
                        {building.deskripsi_gedung}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-3 text-slate-500">
                    {building.lokasi || "—"}
                  </td>
                  <td className="px-5 py-3 text-center text-slate-600">
                    {building.jumlah_lantai || "—"}
                  </td>
                  <td className="px-5 py-3 text-center">
                    {building.foto_url ? (
                      <span className="inline-block px-2 py-0.5 text-[11px] font-medium rounded-full bg-blue-50 text-blue-600">
                        Ada
                      </span>
                    ) : (
                      <span className="text-xs text-slate-300">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onEdit(building)}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(building)}
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
        {currentItems.map((building) => (
          <div
            key={building.id}
            className="border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {building.nama_gedung}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-400">
                  {building.lokasi || "Lokasi tidak tersedia"}
                </span>
                {building.jumlah_lantai && (
                  <span className="inline-block px-2 py-0.5 text-[11px] font-medium rounded-full bg-slate-100 text-slate-600">
                    {building.jumlah_lantai} lantai
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => onEdit(building)}
                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(building)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredBuildings.length === 0 && !loading && (
        <div className="text-center py-12 text-slate-400">
          <Building2 className="w-14 h-14 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">Tidak ada gedung</p>
          <p className="text-sm mt-1">
            {search
              ? `Tidak ditemukan untuk "${search}"`
              : "Belum ada gedung yang terdaftar"}
          </p>
        </div>
      )}

      {/* Pagination */}
      {filteredBuildings.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={filteredBuildings.length}
          pageNumbers={pageNumbers}
          onPageChange={setCurrentPage}
          onNext={goToNext}
          onPrev={goToPrev}
          isFirstPage={isFirstPage}
          isLastPage={isLastPage}
          itemLabel="gedung"
        />
      )}
    </div>
  );
}
