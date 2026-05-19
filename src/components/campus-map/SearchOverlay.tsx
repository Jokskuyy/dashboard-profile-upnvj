import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Navigation } from "lucide-react";
import { buildingList } from "../../data/buildingList";

interface SearchOverlayProps {
  isUnityLoaded: boolean;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isUnityLoaded }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  /** Block semua Unity input (keyboard sudah di-handle oleh patch, ini untuk mouse) */
  const lockUnityInput = useCallback(() => {
    const canvas = document.getElementById("unity-canvas") as HTMLCanvasElement | null;
    if (canvas) {
      canvas.style.pointerEvents = "none"; // block mouse ke Unity
    }
  }, []);

  /** Kembalikan Unity input */
  const unlockUnityInput = useCallback(() => {
    const canvas = document.getElementById("unity-canvas") as HTMLCanvasElement | null;
    if (canvas) {
      canvas.style.pointerEvents = "auto";
    }
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

  // Filter results based on query
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      setHighlightedIndex(-1);
      return;
    }
    const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
    const filtered = buildingList.filter((name) =>
      clean(name).includes(clean(query))
    );
    setResults(filtered);
    setHighlightedIndex(0); // auto-highlight pertama
    setIsOpen(true);
  }, [query]);

  // Close dropdown on outside click → unlock Unity
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        unlockUnityInput();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [unlockUnityInput]);

  const handleSelect = useCallback((name: string) => {
    setQuery(name);
    setSelectedBuilding(name);
    setIsOpen(false);
    inputRef.current?.blur();
    unlockUnityInput(); // kembalikan mouse ke Unity
    if (window.unityInstance) {
      window.unityInstance.SendMessage(
        "NavigationReceiver",
        "NavigateTo",
        name
      );
    }
  }, [unlockUnityInput]);

  const handleClear = useCallback(() => {
    setQuery("");
    setSelectedBuilding(null);
    setIsOpen(false);
    inputRef.current?.focus();
    if (window.unityInstance) {
      window.unityInstance.SendMessage(
        "NavigationReceiver",
        "StopNavigation",
        ""
      );
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" && isOpen && results.length > 0) {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < results.length - 1 ? prev + 1 : 0
      );
    }
    if (e.key === "ArrowUp" && isOpen && results.length > 0) {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : results.length - 1
      );
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

  return (
    <div ref={wrapperRef} className="search-overlay">
      {/* Search input */}
      <div className="search-overlay__input-wrapper">
        <Search size={16} className="search-overlay__icon" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Cari gedung... (tekan Enter)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={lockUnityInput}
          onBlur={() => {
            // Delay agar klik dropdown sempat diproses sebelum unlock
            setTimeout(unlockUnityInput, 200);
          }}
          className="search-overlay__input"
          id="campus-search-input"
          autoComplete="off"
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
      {selectedBuilding && !isOpen && (
        <div className="search-overlay__nav-indicator">
          <Navigation size={12} className="search-overlay__nav-icon" />
          <span>Navigasi ke {selectedBuilding}</span>
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
            results.map((name, idx) => (
              <li
                key={name}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(name);
                }}
                onMouseEnter={() => setHighlightedIndex(idx)}
                className={`search-overlay__item${
                  idx === highlightedIndex ? " search-overlay__item--active" : ""
                }`}
                id={`search-result-${idx}`}
              >
                <Search size={12} className="search-overlay__item-icon" />
                <span>{name}</span>
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
