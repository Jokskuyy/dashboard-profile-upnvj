import React, { useState, useRef, useEffect, useCallback } from "react";
import { supabase } from "../../../lib/supabase";
import { useLanguage } from "../../../contexts/LanguageContext";
import FacilityDetailModal from "../../modals/shared/FacilityDetailModal";

interface FacilityResult {
  id: number;
  nama_fasilitas: string;
  deskripsi_fasilitas?: string;
  tipe_fasilitas: string;
  color?: string;
  foto_url?: string;
  lantai?: number;
  gedung?: {
    id: number;
    nama_gedung: string;
    lokasi?: string;
    deskripsi_gedung?: string;
  };
}

const TIPE_ICON_MAP: Record<string, string> = {
  laboratorium: "biotech",
  perpustakaan: "local_library",
  "ruang baca": "local_library",
  "ruang kuliah": "school",
  "ruang kelas": "school",
  "ruang akademik": "school",
  auditorium: "theater_comedy",
  aula: "theater_comedy",
  administrasi: "admin_panel_settings",
  layanan: "admin_panel_settings",
  sekretariat: "admin_panel_settings",
  ibadah: "mosque",
  musholla: "mosque",
  olahraga: "sports_soccer",
  kantin: "restaurant",
  "ruang dosen": "person",
  "pusat penelitian": "science",
  "area mahasiswa": "groups",
};

function getIconForTipe(tipe: string): string {
  const lower = tipe.toLowerCase();
  for (const [keyword, icon] of Object.entries(TIPE_ICON_MAP)) {
    if (lower.includes(keyword)) return icon;
  }
  return "inventory_2";
}

const COLOR_MAP: Record<string, string> = {
  blue: "bg-blue-100 text-blue-700",
  green: "bg-emerald-100 text-emerald-700",
  red: "bg-red-100 text-red-700",
  purple: "bg-purple-100 text-purple-700",
  orange: "bg-orange-100 text-orange-700",
  yellow: "bg-amber-100 text-amber-700",
  cyan: "bg-cyan-100 text-cyan-700",
  teal: "bg-teal-100 text-teal-700",
  indigo: "bg-indigo-100 text-indigo-700",
  pink: "bg-pink-100 text-pink-700",
  brown: "bg-amber-200 text-amber-800",
  gray: "bg-gray-100 text-gray-600",
  emerald: "bg-emerald-100 text-emerald-700",
  sky: "bg-sky-100 text-sky-700",
};

function getColorClasses(color?: string): string {
  return COLOR_MAP[color || "gray"] || COLOR_MAP.gray;
}

const FacilitySearch: React.FC = () => {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FacilityResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] =
    useState<FacilityResult | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const resultRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  const searchFacilities = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const q = `%${searchQuery.trim()}%`;

      const { data, error } = await supabase
        .from("fasilitas")
        .select(
          `
          id,
          nama_fasilitas,
          deskripsi_fasilitas,
          tipe_fasilitas,
          color,
          foto_url,
          lantai,
          gedung:id_gedung (
            id,
            nama_gedung,
            lokasi,
            deskripsi_gedung
          )
        `,
        )
        .or(
          `nama_fasilitas.ilike.${q},tipe_fasilitas.ilike.${q},deskripsi_fasilitas.ilike.${q}`,
        )
        .order("nama_fasilitas", { ascending: true })
        .limit(20);

      if (error) throw error;

      const transformed: FacilityResult[] = (data || []).map((f: any) => ({
        ...f,
        gedung: Array.isArray(f.gedung) ? f.gedung[0] : f.gedung,
      }));

      setResults(transformed);
      setIsOpen(true);
      setActiveIndex(-1);
    } catch (error) {
      console.error("Error searching facilities:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(() => {
      searchFacilities(value);
    }, 300);
  };

  const handleSelect = (facility: FacilityResult) => {
    setSelectedFacility(facility);
    setIsDetailOpen(true);
    setIsOpen(false);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setTimeout(() => setSelectedFacility(null), 300);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : 0,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : results.length - 1,
        );
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < results.length) {
          handleSelect(results[activeIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && resultRefs.current[activeIndex]) {
      resultRefs.current[activeIndex]?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [activeIndex]);

  // Highlight matched text
  const highlightMatch = (text: string, search: string) => {
    if (!search.trim()) return text;
    const regex = new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200/70 text-inherit rounded-sm px-0.5">
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  const isId = t("assetsTitle") === "Fasilitas & Aset";
  const placeholderText = isId
    ? "Cari fasilitas, lab, ruang kelas..."
    : "Search facilities, labs, classrooms...";
  const noResultsText = isId
    ? "Tidak ditemukan fasilitas"
    : "No facilities found";
  const typeToSearchText = isId
    ? "Ketik minimal 2 karakter untuk mencari"
    : "Type at least 2 characters to search";

  return (
    <>
      {/* Detail Modal */}
      <FacilityDetailModal
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        facility={selectedFacility}
      />

      {/* Search Container */}
      <div ref={containerRef} className="relative w-full mb-5">
        {/* Search Input */}
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            {loading ? (
              <div className="w-5 h-5 border-2 border-[#2C5F2D]/30 border-t-[#2C5F2D] rounded-full animate-spin" />
            ) : (
              <span className="material-icons-round text-xl text-gray-400 group-focus-within:text-[#2C5F2D] transition-colors">
                search
              </span>
            )}
          </div>
          <input
            ref={inputRef}
            id="facility-search"
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => {
              if (results.length > 0 && query.trim().length >= 2) {
                setIsOpen(true);
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholderText}
            autoComplete="off"
            className="w-full pl-12 pr-12 py-3.5 bg-white border-2 border-gray-200 rounded-2xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#2C5F2D] focus:ring-4 focus:ring-[#2C5F2D]/10 transition-all duration-200 shadow-sm hover:border-gray-300"
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <span className="material-icons-round text-lg">close</span>
            </button>
          )}
        </div>

        {/* Results Dropdown */}
        {isOpen && (
          <div
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
            style={{ maxHeight: "400px" }}
          >
            {results.length > 0 ? (
              <div className="overflow-y-auto" style={{ maxHeight: "400px" }}>
                {/* Result count */}
                <div className="px-4 py-2.5 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-medium">
                    {results.length} {isId ? "hasil ditemukan" : "results found"}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    ↑↓ {isId ? "navigasi" : "navigate"} · Enter {isId ? "pilih" : "select"}
                  </span>
                </div>

                {/* Results list */}
                <div className="py-1">
                  {results.map((facility, index) => (
                    <button
                      key={facility.id}
                      ref={(el) => { resultRefs.current[index] = el; }}
                      onClick={() => handleSelect(facility)}
                      className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors duration-100 ${
                        index === activeIndex
                          ? "bg-[#2C5F2D]/5 border-l-2 border-[#2C5F2D]"
                          : "border-l-2 border-transparent hover:bg-gray-50"
                      }`}
                    >
                      {/* Icon */}
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${getColorClasses(facility.color)}`}
                      >
                        <span className="material-icons-round text-base">
                          {getIconForTipe(facility.tipe_fasilitas || "")}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {highlightMatch(
                            facility.nama_fasilitas,
                            query,
                          )}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span
                            className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded ${getColorClasses(facility.color)}`}
                          >
                            {facility.tipe_fasilitas}
                          </span>
                          {facility.lantai && (
                            <span className="text-[10px] text-gray-400">
                              Lt. {facility.lantai}
                            </span>
                          )}
                        </div>
                        {facility.gedung && (
                          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1 truncate">
                            <span className="material-icons-round text-xs">
                              domain
                            </span>
                            {facility.gedung.nama_gedung}
                            {facility.gedung.lokasi && (
                              <span className="text-gray-300">
                                · {facility.gedung.lokasi}
                              </span>
                            )}
                          </p>
                        )}
                      </div>

                      {/* Arrow */}
                      <span className="material-icons-round text-gray-300 text-lg shrink-0 mt-1">
                        chevron_right
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : !loading ? (
              <div className="px-4 py-8 text-center">
                <span className="material-icons-round text-3xl text-gray-200 block mb-2">
                  search_off
                </span>
                <p className="text-sm text-gray-400">{noResultsText}</p>
                <p className="text-xs text-gray-300 mt-1">
                  "{query}"
                </p>
              </div>
            ) : null}
          </div>
        )}

        {/* Hint text when focused but no query */}
        {!isOpen && query.length > 0 && query.length < 2 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden z-50 px-4 py-3">
            <p className="text-xs text-gray-400 text-center">
              {typeToSearchText}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default FacilitySearch;
