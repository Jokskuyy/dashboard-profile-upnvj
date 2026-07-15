import { useState, useEffect } from "react";
import { Plus, Package, Edit2, Trash2, RefreshCw, Search } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import type { Fasilitas } from "../../../services/api/dataService";
import { usePagination } from "../hooks/usePagination";
import Pagination from "../shared/Pagination";

interface FacilityRow extends Fasilitas {
  gedung?: {
    id: number;
    nama_gedung: string;
  };
}

interface FacilitiesTableProps {
  onAdd: () => void;
  onEdit: (facility: Fasilitas) => void;
  onDelete: (facility: Fasilitas) => void;
}

export default function FacilitiesTable({
  onAdd,
  onEdit,
  onDelete,
}: FacilitiesTableProps) {
  const [facilities, setFacilities] = useState<FacilityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("Semua");
  const [selectedBuilding, setSelectedBuilding] = useState<string>("Semua");
  const [selectedFloor, setSelectedFloor] = useState<string>("Semua");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("fasilitas")
        .select(`
          *,
          gedung (
            id,
            nama_gedung
          )
        `)
        .order("tipe_fasilitas", { ascending: true })
        .order("nama_fasilitas", { ascending: true });

      if (error) throw error;
      setFacilities((data ?? []) as FacilityRow[]);
    } catch (error) {
      console.error("Error fetching facilities:", error);
    } finally {
      setLoading(false);
    }
  };

  // Unique types for filter
  const facilityTypes = [
    "Semua",
    ...new Set(facilities.map((f) => f.tipe_fasilitas)),
  ];

  // Unique buildings
  const buildings = [
    "Semua",
    ...Array.from(new Set(facilities.map((f) => f.gedung?.nama_gedung).filter(Boolean) as string[])),
  ].sort();

  // Unique floors
  const floors = [
    "Semua",
    ...Array.from(new Set(facilities.map((f) => f.lantai?.toString()).filter(Boolean) as string[])),
  ].sort((a, b) => {
    if (a === "Semua") return -1;
    if (b === "Semua") return 1;
    return parseInt(a) - parseInt(b);
  });

  // Filter by type, building, floor + search
  const filteredFacilities = facilities.filter((f) => {
    const matchesType = selectedType === "Semua" || f.tipe_fasilitas === selectedType;
    const matchesBuilding = selectedBuilding === "Semua" || f.gedung?.nama_gedung === selectedBuilding;
    const matchesFloor = selectedFloor === "Semua" || f.lantai?.toString() === selectedFloor;
    const matchesSearch =
      !search ||
      f.nama_fasilitas.toLowerCase().includes(search.toLowerCase()) ||
      f.gedung?.nama_gedung?.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesBuilding && matchesFloor && matchesSearch;
  });

  // Paginate flat list of filtered facilities
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
  } = usePagination<FacilityRow>({ totalItems: filteredFacilities.length, itemsPerPage: 10 });

  const currentItems = paginate(filteredFacilities);

  // Reset page when filter changes
  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    setCurrentPage(1);
  };
  
  const handleBuildingChange = (value: string) => {
    setSelectedBuilding(value);
    setCurrentPage(1);
  };

  const handleFloorChange = (value: string) => {
    setSelectedFloor(value);
    setCurrentPage(1);
  };

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
          <h2 className="text-lg font-bold text-slate-900">Daftar Fasilitas</h2>
          <p className="text-sm text-slate-500">
            {filteredFacilities.length} fasilitas
            {selectedType !== "Semua" && ` — ${selectedType}`}
          </p>
        </div>
        <button
          onClick={onAdd}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-semibold text-sm shadow-sm flex items-center gap-2 transition-colors active:scale-[0.98] w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          Tambah Fasilitas
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama fasilitas atau gedung..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          <select
            value={selectedType}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-36 shrink-0 bg-white"
          >
            {facilityTypes.map((type) => (
              <option key={type} value={type}>{type === "Semua" ? "Semua Tipe" : type}</option>
            ))}
          </select>
          <select
            value={selectedBuilding}
            onChange={(e) => handleBuildingChange(e.target.value)}
            className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-40 shrink-0 bg-white"
          >
            {buildings.map((b) => (
              <option key={b} value={b}>{b === "Semua" ? "Semua Gedung" : b}</option>
            ))}
          </select>
          <select
            value={selectedFloor}
            onChange={(e) => handleFloorChange(e.target.value)}
            className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-32 shrink-0 bg-white"
          >
            {floors.map((f) => (
              <option key={f} value={f}>{f === "Semua" ? "Semua Lantai" : `Lantai ${f}`}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                <th className="px-5 py-3">Nama</th>
                <th className="px-5 py-3">Tipe</th>
                <th className="px-5 py-3">Gedung</th>
                <th className="px-5 py-3">Lantai</th>
                <th className="px-5 py-3 text-center w-20">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {currentItems.map((facility) => (
                <tr key={facility.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-slate-900">{facility.nama_fasilitas}</p>
                      {facility.unity_object_name && (
                        <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                          {facility.unity_object_name}
                        </span>
                      )}
                    </div>
                    {facility.deskripsi_fasilitas && (
                      <p className="text-xs text-slate-400 truncate max-w-xs mt-0.5">
                        {facility.deskripsi_fasilitas}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700">
                      {facility.tipe_fasilitas}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-500">
                    {facility.gedung?.nama_gedung || "—"}
                  </td>
                  <td className="px-5 py-3 text-slate-500 font-medium">
                    {facility.lantai || "—"}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onEdit(facility)}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(facility)}
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
        {currentItems.map((facility) => (
          <div
            key={facility.id}
            className="border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {facility.nama_fasilitas}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-block px-2 py-0.5 text-[11px] font-medium rounded-full bg-emerald-50 text-emerald-700">
                  {facility.tipe_fasilitas}
                </span>
                <span className="text-xs text-slate-400">
                  {facility.gedung?.nama_gedung || "—"}
                  {facility.lantai ? ` • Lt. ${facility.lantai}` : ""}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => onEdit(facility)}
                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(facility)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredFacilities.length === 0 && !loading && (
        <div className="text-center py-12 text-slate-400">
          <Package className="w-14 h-14 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">Tidak ada fasilitas</p>
          <p className="text-sm mt-1">
            {search
              ? `Tidak ditemukan untuk "${search}"`
              : selectedType === "Semua"
                ? "Belum ada fasilitas yang terdaftar"
                : `Tidak ada fasilitas tipe ${selectedType}`}
          </p>
        </div>
      )}

      {/* Pagination */}
      {filteredFacilities.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={filteredFacilities.length}
          pageNumbers={pageNumbers}
          onPageChange={setCurrentPage}
          onNext={goToNext}
          onPrev={goToPrev}
          isFirstPage={isFirstPage}
          isLastPage={isLastPage}
          itemLabel="fasilitas"
        />
      )}
    </div>
  );
}
