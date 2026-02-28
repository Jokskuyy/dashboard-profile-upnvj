import { useState, useEffect } from "react";
import { Plus, Package, Edit2, Trash2, RefreshCw } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import type { FacilityData } from "../../../services/api/supabaseDataService";
import { usePagination } from "../hooks/usePagination";
import Pagination from "../shared/Pagination";

interface FacilityRow {
  id: number;
  nama_fasilitas: string;
  deskripsi_fasilitas?: string;
  tipe_fasilitas?: string;
  id_gedung: number;
  color?: string;
  gedung?: {
    id: number;
    nama_gedung: string;
  };
}

interface FacilitiesTableProps {
  onAdd: () => void;
  onEdit: (facility: FacilityData) => void;
  onDelete: (facility: FacilityData) => void;
}

export default function FacilitiesTable({
  onAdd,
  onEdit,
  onDelete,
}: FacilitiesTableProps) {
  const [facilities, setFacilities] = useState<FacilityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("Semua");

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("fasilitas")
        .select(
          `
          *,
          gedung (
            id,
            nama_gedung
          )
        `,
        )
        .order("tipe_fasilitas", { ascending: true })
        .order("nama_fasilitas", { ascending: true });

      if (error) throw error;
      setFacilities(data || []);
    } catch (error) {
      console.error("Error fetching facilities:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique facility types for filtering
  const facilityTypes = [
    "Semua",
    ...new Set(facilities.map((f) => f.tipe_fasilitas)),
  ];

  // Filter facilities by selected type
  const filteredFacilities =
    selectedType === "Semua"
      ? facilities
      : facilities.filter((f) => f.tipe_fasilitas === selectedType);

  // Group facilities by type for display
  const facilitiesByType = filteredFacilities.reduce(
    (acc, facility) => {
      const type = facility.tipe_fasilitas || "Lainnya";
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(facility);
      return acc;
    },
    {} as Record<string, FacilityRow[]>,
  );

  const typeKeys = Object.keys(facilitiesByType);

  const {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    pageNumbers,
    goToNext,
    goToPrev,
    isFirstPage,
    isLastPage,
    setCurrentPage,
  } = usePagination({ totalItems: typeKeys.length });

  const currentTypes = typeKeys.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Daftar Fasilitas</h2>
          <p className="text-sm text-slate-500">
            {filteredFacilities.length} fasilitas terdaftar
            {selectedType !== "Semua" && ` dalam kategori ${selectedType}`}
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            {facilityTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <button
            onClick={onAdd}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Tambah Fasilitas
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {currentTypes.map((type) => {
          const typeFacilities = facilitiesByType[type];
          return (
            <div
              key={type}
              className="border border-slate-200 rounded-2xl overflow-hidden bg-white/50"
            >
              <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <Package className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">{type}</h4>
                    <p className="text-sm text-slate-500">
                      {typeFacilities.length} fasilitas
                    </p>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/30 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                      <th className="px-6 py-3">Nama Fasilitas</th>
                      <th className="px-6 py-3">Deskripsi</th>
                      <th className="px-6 py-3">Gedung</th>
                      <th className="px-6 py-3 text-center">Warna</th>
                      <th className="px-6 py-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-slate-100">
                    {typeFacilities.map((facility) => (
                      <tr
                        key={facility.id}
                        className="hover:bg-slate-50 group transition-colors"
                      >
                        <td className="px-6 py-4 text-slate-900 font-medium">
                          {facility.nama_fasilitas}
                        </td>
                        <td className="px-6 py-4 text-slate-600 max-w-md truncate">
                          {facility.deskripsi_fasilitas || "-"}
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {facility.gedung?.nama_gedung || "-"}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-block w-6 h-6 rounded-full bg-${facility.color || "gray"}-500`}
                            title={facility.color || "gray"}
                          ></span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => onEdit(facility)}
                              className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDelete(facility)}
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
            </div>
          );
        })}
      </div>

      {filteredFacilities.length === 0 && !loading && (
        <div className="text-center py-12 text-slate-500">
          <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-semibold">Tidak ada fasilitas</p>
          <p className="text-sm">
            {selectedType === "Semua"
              ? "Belum ada fasilitas yang terdaftar"
              : `Tidak ada fasilitas dengan tipe ${selectedType}`}
          </p>
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        totalItems={typeKeys.length}
        pageNumbers={pageNumbers}
        onPageChange={setCurrentPage}
        onNext={goToNext}
        onPrev={goToPrev}
        isFirstPage={isFirstPage}
        isLastPage={isLastPage}
        itemLabel="kategori"
      />
    </div>
  );
}
