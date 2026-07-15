import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Navigation, Building2, LayoutGrid, StopCircle, CornerDownLeft, CheckCircle2 } from "lucide-react";
import { useBuildingSearch, type SearchResult } from "../../hooks/useBuildingSearch";

interface SearchOverlayProps {
  isUnityLoaded: boolean;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isUnityLoaded }) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SearchResult | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isNavigating, setIsNavigating] = useState(false);
  const [hasReachedDestination, setHasReachedDestination] = useState(false);
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

  const handleCancelNavigation = useCallback(() => {
    setQuery("");
    setSelectedItem(null);
    setIsOpen(false);
    setIsNavigating(false);
    setHasReachedDestination(false);
    setResults([]);
    unlockUnityInput();

    if (window.unityInstance) {
      window.unityInstance.SendMessage("NavigationReceiver", "StopNavigation", "");
    }
  }, [unlockUnityInput]);

  // Global shortcut: Enter → fokus ke search bar + lock Unity input
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const active = document.activeElement;
      const isInput =
        active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement;

      // Enter to focus search (when not navigating)
      if (e.key === "Enter" && !isInput && !isNavigating) {
        e.preventDefault();
        lockUnityInput();
        inputRef.current?.focus();
      }

      // Escape to cancel navigation
      if (e.key === "Escape" && isNavigating) {
        e.preventDefault();
        handleCancelNavigation();
      }
    };

    const handleNavigationCompleted = () => {
      console.log("[SearchOverlay] Navigation completed event received from Unity");
      setHasReachedDestination(true);
      setTimeout(() => {
        handleCancelNavigation();
      }, 4000);
    };

    window.addEventListener("keydown", handler, true);
    window.addEventListener("OnNavigationCompleted", handleNavigationCompleted as EventListener);
    
    return () => {
      window.removeEventListener("keydown", handler, true);
      window.removeEventListener("OnNavigationCompleted", handleNavigationCompleted as EventListener);
    };
  }, [lockUnityInput, isNavigating, handleCancelNavigation]);

  // Debounce query — delay search by 300ms to avoid searching every keystroke
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Filter results berdasarkan debouncedQuery
  useEffect(() => {
    // Jangan filter saat sedang navigasi
    if (isNavigating) return;

    if (!debouncedQuery.trim()) {
      setResults([]);
      setIsOpen(false);
      setHighlightedIndex(-1);
      return;
    }
    const filtered = search(debouncedQuery);
    setResults(filtered);
    setHighlightedIndex(0);
    setIsOpen(true);
  }, [debouncedQuery, search, isNavigating]);

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
      setIsNavigating(true);
      setResults([]);
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

  const handleClearSearch = useCallback(() => {
    setQuery("");
    setResults([]);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
    lockUnityInput();
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

  // ── NAVIGATING STATE ──
  // Show a navigation status bar instead of the search input
  if (isNavigating && selectedItem) {
    return (
      <div ref={wrapperRef} className="search-overlay">
        {/* DESTINATION REACHED TOAST */}
        {hasReachedDestination && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] animate-[bounce_0.5s_ease-out]">
            <div className="flex items-center space-x-3 bg-white/95 backdrop-blur-md px-5 py-3 md:px-6 md:py-4 rounded-2xl shadow-2xl border border-green-200">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h4 className="text-green-800 font-bold text-sm md:text-base">Tiba di Tujuan</h4>
                <p className="text-gray-600 text-xs md:text-sm font-medium">Anda telah sampai di {selectedItem.label}</p>
              </div>
            </div>
          </div>
        )}

        <div className="search-overlay__nav-bar">
          {/* Icon + destination info */}
          <div className="search-overlay__nav-bar-info">
            <div className="search-overlay__nav-bar-pulse">
              <Navigation size={14} className="search-overlay__nav-bar-icon" />
            </div>
            <div className="search-overlay__nav-bar-text">
              <span className="search-overlay__nav-bar-label">Navigasi ke</span>
              <span className="search-overlay__nav-bar-dest">
                {selectedItem.label}
                {selectedItem.type === "fasilitas" && selectedItem.sublabel && (
                  <span className="search-overlay__nav-bar-sublabel"> · {selectedItem.sublabel}</span>
                )}
              </span>
            </div>
          </div>

          {/* Cancel button */}
          <button
            onClick={handleCancelNavigation}
            className="search-overlay__nav-cancel"
            aria-label="Batalkan navigasi"
            id="cancel-navigation-btn"
          >
            <StopCircle size={14} />
            <span>Batalkan</span>
          </button>
        </div>

        {/* Keyboard shortcut hint */}
        <div className="search-overlay__nav-hint">
          <CornerDownLeft size={10} />
          <span>Tekan Esc untuk berhenti</span>
        </div>
      </div>
    );
  }

  // ── SEARCH STATE ──
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
          onFocus={() => {
            lockUnityInput();
            if (query.trim()) {
              setIsOpen(true);
            }
          }}
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
            onClick={handleClearSearch}
            className="search-overlay__clear-btn"
            aria-label="Hapus pencarian"
          >
            <X size={14} />
          </button>
        )}
      </div>

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
