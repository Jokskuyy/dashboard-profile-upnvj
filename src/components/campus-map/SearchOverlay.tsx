import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Navigation, Building2, LayoutGrid } from "lucide-react";
import { useBuildingSearch, type SearchResult } from "../../hooks/useBuildingSearch";

interface SearchOverlayProps {
  isUnityLoaded: boolean;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isUnityLoaded }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SearchResult | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Fetch data dari Supabase
  const { search, loading: dataLoading } = useBuildingSearch();

  /** Block mouse input ke Unity saat search fokus */
  const lockUnityInput = useCallback(() => {
    const canvas = document.getElementById("unity-canvas") as HTMLCanvasElement | null;
    if (canvas) canvas.style.pointerEvents = "none";
  }, []);

  /** Kembalikan mouse input ke Unity */
  const unlockUnityInput = useCallback(() => {
    const canvas = document.getElementById("unity-canvas") as HTMLCanvasElement | null;
    if (canvas) canvas.style.pointerEvents = "auto";
  }, []);

  // Global shortcut: Enter → fokus ke search bar + lock Unity input
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const active = document.activeElement;
      const isInput =
        active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement;

      if (e.key === "Enter" && !isInput) {
        e.preventDefault();
        lockUnityInput();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [lockUnityInput]);

  // Filter results berdasarkan query
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      setHighlightedIndex(-1);
      return;
    }
    const filtered = search(query);
    setResults(filtered);
    setHighlightedIndex(0);
    setIsOpen(true);
  }, [query, search]);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        unlockUnityInput();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [unlockUnityInput]);

  const handleSelect = useCallback(
    (item: SearchResult) => {
      setQuery(item.label);
      setSelectedItem(item);
      setIsOpen(false);
      inputRef.current?.blur();
      unlockUnityInput();

      if (window.unityInstance) {
        window.unityInstance.SendMessage(
          "NavigationReceiver",
          "NavigateTo",
          item.unityObjectName
        );
      }
    },
    [unlockUnityInput]
  );

  const handleClear = useCallback(() => {
    setQuery("");
    setSelectedItem(null);
    setIsOpen(false);
    inputRef.current?.focus();
    lockUnityInput();
    if (window.unityInstance) {
      window.unityInstance.SendMessage("NavigationReceiver", "StopNavigation", "");
    }
  }, [lockUnityInput]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" && isOpen && results.length > 0) {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    }
    if (e.key === "ArrowUp" && isOpen && results.length > 0) {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    }
    if (e.key === "Enter" && results.length > 0) {
      e.preventDefault();
      const idx = highlightedIndex >= 0 ? highlightedIndex : 0;
      handleSelect(results[idx]);
    }
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
      unlockUnityInput();
    }
  };

  if (!isUnityLoaded) return null;

  const placeholder = dataLoading
    ? "Memuat data gedung..."
    : "Cari gedung atau fasilitas... (Enter)";

  return (
    <div ref={wrapperRef} className="search-overlay">
      {/* Search input */}
      <div className="search-overlay__input-wrapper">
        <Search size={16} className="search-overlay__icon" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={lockUnityInput}
          onBlur={() => {
            setTimeout(unlockUnityInput, 200);
          }}
          className="search-overlay__input"
          id="campus-search-input"
          autoComplete="off"
          disabled={dataLoading}
        />
        {query && (
          <button
            onClick={handleClear}
            className="search-overlay__clear-btn"
            aria-label="Hapus pencarian"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Active navigation indicator */}
      {selectedItem && !isOpen && (
        <div className="search-overlay__nav-indicator">
          <Navigation size={12} className="search-overlay__nav-icon" />
          <span>
            Navigasi ke {selectedItem.label}
            {selectedItem.type === "fasilitas" && selectedItem.sublabel && (
              <span className="search-overlay__nav-sublabel"> ({selectedItem.sublabel})</span>
            )}
          </span>
          <button
            onClick={handleClear}
            className="search-overlay__nav-stop"
            aria-label="Hentikan navigasi"
          >
            Berhenti
          </button>
        </div>
      )}

      {/* Dropdown results */}
      {isOpen && (
        <ul className="search-overlay__dropdown" id="campus-search-results">
          {results.length > 0 ? (
            results.map((item, idx) => (
              <li
                key={`${item.type}-${item.label}-${idx}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(item);
                }}
                onMouseEnter={() => setHighlightedIndex(idx)}
                className={`search-overlay__item${
                  idx === highlightedIndex ? " search-overlay__item--active" : ""
                }`}
                id={`search-result-${idx}`}
              >
                {/* Ikon berbeda untuk gedung vs fasilitas */}
                {item.type === "gedung" ? (
                  <Building2 size={12} className="search-overlay__item-icon" />
                ) : (
                  <LayoutGrid size={12} className="search-overlay__item-icon search-overlay__item-icon--facility" />
                )}
                <div className="search-overlay__item-text">
                  <span>{item.label}</span>
                  {item.sublabel && (
                    <span className="search-overlay__item-sublabel">
                      {item.sublabel}
                    </span>
                  )}
                </div>
              </li>
            ))
          ) : (
            <li className="search-overlay__item search-overlay__item--empty">
              <span>"{query}" tidak ditemukan</span>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchOverlay;
