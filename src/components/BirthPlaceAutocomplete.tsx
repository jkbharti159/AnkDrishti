import React, { useState, useEffect, useRef, useTransition } from "react";
import { MapPin, Search, Loader2, History, X, Globe } from "lucide-react";
import {
  searchBirthplaces,
  enrichTimezone,
  saveRecentPlaceToCache,
  getCachedSearchHistory,
  GeocodedPlace
} from "../services/geocodingService";

interface BirthPlaceAutocompleteProps {
  value: string;
  onSelectPlace: (place: GeocodedPlace) => void;
  placeholder?: string;
  className?: string;
  language?: string;
}

export default function BirthPlaceAutocomplete({
  value,
  onSelectPlace,
  placeholder = "Search birthplace...",
  className = "",
  language = "en"
}: BirthPlaceAutocompleteProps) {
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState<GeocodedPlace[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [, startTransition] = useTransition();

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = "birthplace-autocomplete-listbox";

  // Load search history as initial suggestions when focused and query is empty
  const [history, setHistory] = useState<GeocodedPlace[]>([]);

  useEffect(() => {
    setHistory(getCachedSearchHistory());
  }, [isOpen]);

  // Sync with prop value updates
  useEffect(() => {
    if (value !== undefined) {
      setQuery(value);
    }
  }, [value]);

  // Debounced search logic
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      setHasSearched(false);
      return;
    }

    // Check cache first or set loading
    setIsLoading(true);

    const delayDebounceFn = setTimeout(() => {
      startTransition(async () => {
        try {
          const results = await searchBirthplaces(query);
          setSuggestions(results);
          setHasSearched(true);
        } catch (error) {
          console.error("Autocomplete fetch error:", error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      });
    }, 250); // 250ms debounce rate

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
    setActiveIndex(-1);
  };

  const handleSelect = async (place: GeocodedPlace) => {
    setQuery(place.formattedAddress);
    setIsOpen(false);
    
    // Instantly triggers basic coords callback
    onSelectPlace(place);

    // Asynchronously enrich with high-accuracy API timezone data
    const enriched = await enrichTimezone(place);
    onSelectPlace(enriched);
    saveRecentPlaceToCache(enriched);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
      }
      return;
    }

    const displayedSuggestions = query.trim().length === 0 ? history : suggestions;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => 
          prev < displayedSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => 
          prev > 0 ? prev - 1 : displayedSuggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < displayedSuggestions.length) {
          handleSelect(displayedSuggestions[activeIndex]);
        } else if (displayedSuggestions.length > 0) {
          // If user hits enter and nothing is highlighted, select first suggestion
          handleSelect(displayedSuggestions[0]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        inputRef.current?.blur();
        break;
      case "Tab":
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const clearInput = () => {
    setQuery("");
    setSuggestions([]);
    setIsOpen(true);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  // Highlights text that matches the query input
  const renderHighlightedText = (text: string, highlight: string) => {
    if (!highlight.trim()) {
      return <span>{text}</span>;
    }
    const regex = new RegExp(`(${escapeRegExp(highlight)})`, "gi");
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) => 
          regex.test(part) ? (
            <mark key={i} className="bg-amber-500/30 text-amber-300 rounded px-0.5 font-semibold">
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  const activeSuggestions = query.trim().length === 0 ? history : suggestions;

  return (
    <div 
      id="birthplace-autocomplete-container"
      ref={containerRef} 
      className={`relative w-full ${className}`}
    >
      <div className="relative">
        <input
          id="birthplace-search-input"
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-activedescendant={
            activeIndex >= 0 ? `suggestion-item-${activeIndex}` : undefined
          }
          className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/20 transition font-sans text-sm outline-none"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-4 w-4 text-amber-500 animate-spin" />
          ) : (
            <Search className="h-4 w-4 text-slate-500" />
          )}
        </div>
        {query && (
          <button
            type="button"
            onClick={clearInput}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition"
            aria-label="Clear input"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div 
          id={listboxId}
          role="listbox"
          className="absolute z-50 w-full mt-2 bg-slate-900/95 backdrop-blur-xl border border-slate-800/90 rounded-xl shadow-2xl overflow-hidden max-h-[320px] overflow-y-auto custom-scrollbar"
        >
          {activeSuggestions.length > 0 ? (
            <div className="py-1.5">
              {query.trim().length === 0 && (
                <div className="px-3 py-1.5 text-[10px] font-mono tracking-wider text-slate-500 uppercase flex items-center gap-1">
                  <History className="w-3 h-3" /> Recent Search History
                </div>
              )}
              {activeSuggestions.map((place, index) => (
                <div
                  key={place.placeId}
                  id={`suggestion-item-${index}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  onClick={() => handleSelect(place)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`flex items-start gap-3 px-3.5 py-3 cursor-pointer transition select-none ${
                    index === activeIndex
                      ? "bg-amber-500/10 text-white border-l-2 border-amber-500"
                      : "text-slate-300 hover:bg-slate-800/40"
                  }`}
                >
                  {query.trim().length === 0 ? (
                    <History className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <MapPin className="w-4 h-4 text-amber-500/70 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-sm font-semibold text-slate-200 truncate">
                      {renderHighlightedText(place.placeName, query)}
                    </div>
                    <div className="text-xs text-slate-400 truncate mt-0.5">
                      {renderHighlightedText(place.formattedAddress, query)}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500 font-mono">
                      <span>Lat: {place.latitude.toFixed(4)}°</span>
                      <span>•</span>
                      <span>Lon: {place.longitude.toFixed(4)}°</span>
                      {place.state && (
                        <>
                          <span>•</span>
                          <span className="truncate">{place.state}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            query.trim().length >= 2 && hasSearched && !isLoading && (
              <div className="p-6 text-center text-slate-400">
                <Globe className="w-8 h-8 text-slate-600 mx-auto mb-2.5" />
                <p className="text-sm font-medium">No matching location found.</p>
                <p className="text-xs text-slate-500 mt-1">Please refine your search query.</p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
