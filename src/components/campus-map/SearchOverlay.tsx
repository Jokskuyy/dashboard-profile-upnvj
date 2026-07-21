import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Navigation, Building2, LayoutGrid, StopCircle, CornerDownLeft, CheckCircle2 } from "lucide-react";
import { useBuildingSearch, type SearchResult } from "../../hooks/useBuildingSearch";
import { useLanguage } from "../../contexts/LanguageContext";

interface SearchOverlayProps {
  isUnityLoaded: boolean;
  onNavigate?: (item: SearchResult) => void;
  onCancelNavigation?: () => void;
}

type NavigationCompletedPayload = {
  unity_object_name: string;
};

const SearchOverlay: React.FC<SearchOverlayProps> = ({
  isUnityLoaded,
  onNavigate,
  onCancelNavigation,
}) => {
  const { language } = useLanguage();
  const isIndonesian = language === "id";
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
  const arrivalTimeoutRef = useRef<number | null>(null);
  const activeNavigationRef = useRef<SearchResult | null>(null);

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

  const clearArrivalTimeout = useCallback(() => {
    if (arrivalTimeoutRef.current !== null) {
      window.clearTimeout(arrivalTimeoutRef.current);
      arrivalTimeoutRef.current = null;
    }
  }, []);

  const resetNavigationUi = useCallback(() => {
    clearArrivalTimeout();
    activeNavigationRef.current = null;
    setQuery("");
    setDebouncedQuery("");
    setSelectedItem(null);
    setIsOpen(false);
    setIsNavigating(false);
    setHasReachedDestination(false);
    setResults([]);
    setHighlightedIndex(-1);
    unlockUnityInput();
  }, [clearArrivalTimeout, unlockUnityInput]);

  const handleCancelNavigation = useCallback(() => {
    resetNavigationUi();
    if (onCancelNavigation) {
      onCancelNavigation();
    } else if (window.unityInstance) {
      window.unityInstance.SendMessage("NavigationReceiver", "StopNavigation", "");
    }
  }, [onCancelNavigation, resetNavigationUi]);

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

    window.addEventListener("keydown", handler, true);

    return () => {
      window.removeEventListener("keydown", handler, true);
    };
  }, [lockUnityInput, isNavigating, handleCancelNavigation]);

  useEffect(() => {
    const handleNavigationCompleted = (event: Event) => {
      const detail = (event as CustomEvent<unknown>).detail;
      if (typeof detail !== "string" || !detail.trim()) return;

      let payload: NavigationCompletedPayload;
      try {
        payload = JSON.parse(detail) as NavigationCompletedPayload;
      } catch {
        console.warn("[SearchOverlay] Payload OnNavigationCompleted tidak valid.");
        return;
      }

      const completedKey =
        typeof payload?.unity_object_name === "string"
          ? payload.unity_object_name.trim().toLowerCase()
          : "";
      const activeItem = activeNavigationRef.current;
      const selectedKey = activeItem?.unityObjectName.trim().toLowerCase() ?? "";

      if (!activeItem || !completedKey || !selectedKey || completedKey !== selectedKey) {
        return;
      }

      setSelectedItem(activeItem);
      setIsNavigating(true);
      setHasReachedDestination(true);
      clearArrivalTimeout();
      arrivalTimeoutRef.current = window.setTimeout(() => {
        arrivalTimeoutRef.current = null;
        resetNavigationUi();
      }, 4000);
    };

    window.addEventListener(
      "OnNavigationCompleted",
      handleNavigationCompleted as EventListener,
    );

    return () => {
      window.removeEventListener(
        "OnNavigationCompleted",
        handleNavigationCompleted as EventListener,
      );
      clearArrivalTimeout();
    };
  }, [clearArrivalTimeout, resetNavigationUi]);

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
      clearArrivalTimeout();
      activeNavigationRef.current = item;
      setQuery(item.label);
      setSelectedItem(item);
      setIsOpen(false);
      setIsNavigating(true);
      setHasReachedDestination(false);
      setResults([]);
      inputRef.current?.blur();
      unlockUnityInput();

      if (onNavigate) {
        onNavigate(item);
      } else if (window.unityInstance) {
        window.unityInstance.SendMessage(
          "NavigationReceiver",
          "NavigateTo",
          item.unityObjectName
        );
      }
    },
    [clearArrivalTimeout, onNavigate, unlockUnityInput]
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
    ? isIndonesian
      ? "Memuat data gedung..."
      : "Loading building data..."
    : isIndonesian
      ? "Cari gedung atau fasilitas... (Enter)"
      : "Search buildings or facilities... (Enter)";

  // ── NAVIGATING STATE ──
  // Show a navigation status bar instead of the search input
  if (isNavigating && selectedItem) {
    return (
      <div ref={wrapperRef} className="search-overlay">
        {/* DESTINATION REACHED TOAST */}
        {hasReachedDestination && (
          <div className="fixed top-20 md:top-24 left-1/2 -translate-x-1/2 z-[60] animate-[bounce_0.5s_ease-out]">
            <div className="flex items-center space-x-3 bg-white/95 backdrop-blur-md px-5 py-3 md:px-6 md:py-4 rounded-2xl shadow-2xl border border-green-200">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h4 className="text-green-800 font-bold text-sm md:text-base">
                  {isIndonesian ? "Tiba di Tujuan" : "Destination Reached"}
                </h4>
                <p className="text-gray-600 text-xs md:text-sm font-medium">
                  {isIndonesian ? "Anda telah sampai di" : "You have arrived at"} {selectedItem.label}
                </p>
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
              <span className="search-overlay__nav-bar-label">
                {isIndonesian ? "Navigasi ke" : "Navigating to"}
              </span>
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
            aria-label={isIndonesian ? "Batalkan navigasi" : "Cancel navigation"}
            id="cancel-navigation-btn"
          >
            <StopCircle size={14} />
            <span>{isIndonesian ? "Batalkan" : "Cancel"}</span>
          </button>
        </div>

        {/* Keyboard shortcut hint */}
        <div className="search-overlay__nav-hint">
          <CornerDownLeft size={10} />
          <span>{isIndonesian ? "Tekan Esc untuk berhenti" : "Press Esc to stop"}</span>
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
            aria-label={isIndonesian ? "Hapus pencarian" : "Clear search"}
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
              <span>
                {isIndonesian ? `"${query}" tidak ditemukan` : `No results found for "${query}"`}
              </span>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchOverlay;
