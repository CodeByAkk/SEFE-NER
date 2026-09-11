import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Loader2, Navigation } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { searchLocations } from '@/services/openMeteo';
import type { GeocodingResult } from '@/services/openMeteo';

const DEBOUNCE_MS = 350;

export function LocationSearch({ compact = false }: { compact?: boolean }) {
  const { selectedLocation, setSelectedLocation, fetchWeather, showToast, locateUser } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [myLocationLoading, setMyLocationLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (!query.trim() || query.length < 2) {
        setResults([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      searchLocations(query, (results, loading) => {
        setResults(results);
        setLoading(loading);
      });
    }, DEBOUNCE_MS);

    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (loc: GeocodingResult) => {
    setSelectedLocation(loc);
    fetchWeather(loc.latitude, loc.longitude);
    setQuery('');
    setResults([]);
    setShowDropdown(false);
    showToast(`Location set to ${loc.name}, ${loc.state || loc.country}`, 'success');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown && results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < results.length) {
        handleSelect(results[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      setHighlightedIndex(-1);
    }
  };

  const handleUseMyLocation = async () => {
    setMyLocationLoading(true);
    try {
           await locateUser();
    } finally {
      setMyLocationLoading(false);
    }
  };

  const currentDisplay = selectedLocation
    ? `${selectedLocation.name}${selectedLocation.state ? ', ' + selectedLocation.state : ''}`
    : 'Search city, district, state...';

  return (
    <div className={`relative ${compact ? 'w-full max-w-xs' : ''}`} ref={dropdownRef}>
      <div className={`flex items-center ${compact ? 'gap-1' : 'gap-2'}`}>
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
            compact ? 'text-navy-500' : 'text-navy-400'
          }`} />
          <input
            ref={inputRef}
            type="text"
            placeholder={currentDisplay}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
              setHighlightedIndex(-1);
            }}
            onFocus={() => setShowDropdown(true)}
            onKeyDown={handleKeyDown}
            className={`w-full bg-navy-800/90 border border-navy-700 rounded-lg pl-9 pr-3 py-2 text-sm text-navy-100 placeholder-navy-400 focus:outline-none focus:border-blue-500 transition-colors`}
            aria-label="Search location"
            aria-expanded={showDropdown}
            aria-autocomplete="list"
            autoComplete="off"
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-navy-400 animate-spin" />
          )}
        </div>

        {!compact && (
          <button
            onClick={handleUseMyLocation}
            disabled={myLocationLoading}
            className="flex items-center gap-1 px-2.5 py-2 rounded-lg bg-navy-800 border border-navy-700 text-navy-300 hover:text-navy-100 hover:bg-navy-700 transition-all text-xs disabled:opacity-50"
            title="Use my location"
            aria-label="Use my location"
          >
            {myLocationLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Navigation className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">My Location</span>
          </button>
        )}
      </div>

      {showDropdown && (
        <div className={`absolute z-30 mt-1 w-full bg-navy-800 border border-navy-700 rounded-lg shadow-xl overflow-hidden ${
          results.length === 0 && !loading ? 'hidden' : ''
        }`}>
          {loading && (
            <div className="p-3 text-xs text-navy-300 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Searching locations...
            </div>
          )}

          {!loading && results.length === 0 && query.length >= 2 && (
            <div className="p-3 text-xs text-navy-400">
              No locations found. Try a broader search term.
            </div>
          )}

          {!loading && results.map((loc, idx) => (
            <button
              key={`${loc.latitude}-${loc.longitude}`}
              onClick={() => handleSelect(loc)}
              onMouseEnter={() => setHighlightedIndex(idx)}
              className={`w-full text-left px-3 py-2 transition-all flex items-start gap-2 ${
                idx === highlightedIndex
                  ? 'bg-navy-700 text-navy-100'
                  : 'text-navy-200 hover:bg-navy-700/50'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{loc.name}</p>
                <p className="text-xs text-navy-400 truncate">
                  {[loc.state, loc.country].filter(Boolean).join(', ')}
                </p>
                {loc.elevation > 0 && (
                  <p className="text-[10px] text-navy-500 mt-0.5">
                    {loc.elevation} m elevation
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
