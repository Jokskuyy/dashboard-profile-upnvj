import React, { useState, useEffect, useRef } from "react";
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
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Filter results based on query
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
    const filtered = buildingList.filter((name) =>
      clean(name).includes(clean(query))
    );
    setResults(filtered);
    setIsOpen(true);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (name: string) => {
    setQuery(name);
    setSelectedBuilding(name);
    setIsOpen(false);
    if (window.unityInstance) {
      window.unityInstance.SendMessage(
        "NavigationReceiver",
        "NavigateTo",
        name
      );
    }
  };

  const handleClear = () => {
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
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && results.length > 0) {
      handleSelect(results[0]);
    }
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
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
          placeholder="Cari gedung..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="search-overlay__input"
          id="campus-search-input"
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
                onClick={() => handleSelect(name)}
                className="search-overlay__item"
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
